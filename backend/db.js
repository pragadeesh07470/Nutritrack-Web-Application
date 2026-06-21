// ============================================================
//  NutriTrack — Database Layer  (backend/db.js)
//  Postgres-backed. server.js calls these exact functions the
//  same way it called the old Firestore version — only the
//  internals changed. Identity still comes from Firebase
//  (req.uid, verified by firebaseAdmin.js / requireAuth);
//  this file only ever touches data, never auth.
// ============================================================

import { pool } from "./pool.js";

function todayKey() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function resolveDateKey(dateKey) {
  return !dateKey || dateKey === "today" ? todayKey() : dateKey;
}

// Ensure a profiles row exists before writing child rows (daily_goals,
// food_log_days, weights, ... all have a FK to profiles.uid). Firestore
// never needed this since it has no foreign keys, so this is new.
async function ensureProfile(uid, email = "") {
  await pool.query(
    `INSERT INTO profiles (uid, email)
     VALUES ($1, $2)
     ON CONFLICT (uid) DO NOTHING`,
    [uid, email]
  );
}

// ════════════════════════════════════════════════════════════
//  USER PROFILE
// ════════════════════════════════════════════════════════════

export async function getProfile(uid) {
  const { rows } = await pool.query(
    `SELECT uid, email, fname, lname, gender,
            TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS dob,
            height_cm AS height, weight_kg AS weight,
            target_weight_kg AS "targetWeight", bio, activity, goal,
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM profiles WHERE uid = $1`,
    [uid]
  );
  return rows[0] || null;
}

export async function createProfile(uid, data) {
  await pool.query(
    `INSERT INTO profiles (uid, fname, lname, email, height_cm, weight_kg, goal)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (uid) DO UPDATE SET
       fname = EXCLUDED.fname, lname = EXCLUDED.lname, email = EXCLUDED.email,
       height_cm = EXCLUDED.height_cm, weight_kg = EXCLUDED.weight_kg,
       goal = EXCLUDED.goal, updated_at = NOW()`,
    [
      uid,
      data.fname || "",
      data.lname || "",
      data.email || "",
      data.height || null,
      data.weight || null,
      data.goal || "maintain",
    ]
  );
}

export async function updateProfile(uid, fields) {
  await ensureProfile(uid);

  // Build a dynamic SET clause from only the supplied keys, mapped to
  // their column names. Unknown keys are ignored rather than erroring,
  // matching the old Firestore behaviour of accepting a partial object.
  const colMap = {
    fname: "fname",
    lname: "lname",
    email: "email",
    height: "height_cm",
    weight: "weight_kg",
    goal: "goal",
    gender: "gender",
    dob: "date_of_birth",
    bio: "bio",
    targetWeight: "target_weight_kg",
    activity: "activity",
  };

  const sets = [];
  const values = [];
  let i = 1;

  for (const [key, col] of Object.entries(colMap)) {
    if (fields[key] !== undefined) {
      // Empty string dates aren't valid for a DATE column — store NULL instead.
      const value = key === "dob" && fields[key] === "" ? null : fields[key];
      sets.push(`${col} = $${i}`);
      values.push(value);
      i++;
    }
  }

  if (sets.length === 0) return; // nothing to update

  values.push(uid);
  await pool.query(
    `UPDATE profiles SET ${sets.join(", ")}, updated_at = NOW() WHERE uid = $${i}`,
    values
  );
}

export async function deleteUser(uid) {
  // ON DELETE CASCADE on every child table handles the rest.
  await pool.query(`DELETE FROM profiles WHERE uid = $1`, [uid]);
}

// ════════════════════════════════════════════════════════════
//  PREFERENCES / GOALS
//  Backed by daily_goals — we read/write the row with the most
//  recent effective_from for this uid (their "current" goals).
// ════════════════════════════════════════════════════════════

const DEFAULT_PREFS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  waterGoal: 2500,
  cupSize: 250,
  weightUnit: "kg",
  heightUnit: "cm",
  energyUnit: "kcal",
};

export async function getPrefs(uid) {
  const [goalsResult, profileResult] = await Promise.all([
    pool.query(
      `SELECT calories_kcal AS calories, protein_g AS protein, carbs_g AS carbs,
              fat_g AS fat, water_ml AS "waterGoal", cup_size_ml AS "cupSize"
       FROM daily_goals
       WHERE uid = $1
       ORDER BY effective_from DESC, created_at DESC
       LIMIT 1`,
      [uid]
    ),
    pool.query(
      `SELECT weight_unit AS "weightUnit", height_unit AS "heightUnit",
              energy_unit AS "energyUnit"
       FROM profiles WHERE uid = $1`,
      [uid]
    ),
  ]);

  return {
    ...DEFAULT_PREFS,
    ...(goalsResult.rows[0] || {}),
    ...(profileResult.rows[0] || {}),
  };
}

export async function savePrefs(uid, prefs) {
  await ensureProfile(uid);

  await pool.query(
    `INSERT INTO daily_goals
       (uid, calories_kcal, protein_g, carbs_g, fat_g, water_ml, cup_size_ml, effective_from)
     VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
     ON CONFLICT (uid, effective_from) DO UPDATE SET
       calories_kcal = EXCLUDED.calories_kcal,
       protein_g     = EXCLUDED.protein_g,
       carbs_g       = EXCLUDED.carbs_g,
       fat_g         = EXCLUDED.fat_g,
       water_ml      = EXCLUDED.water_ml,
       cup_size_ml   = EXCLUDED.cup_size_ml`,
    [
      uid,
      prefs.calories ?? DEFAULT_PREFS.calories,
      prefs.protein ?? DEFAULT_PREFS.protein,
      prefs.carbs ?? DEFAULT_PREFS.carbs,
      prefs.fat ?? DEFAULT_PREFS.fat,
      prefs.waterGoal ?? DEFAULT_PREFS.waterGoal,
      prefs.cupSize ?? DEFAULT_PREFS.cupSize,
    ]
  );

  // Unit preferences (kg/lb, cm/ft, kcal/kJ) live on the profile,
  // not on a per-day goals row — only write them if supplied so a
  // partial save doesn't reset units back to defaults.
  if (prefs.weightUnit || prefs.heightUnit || prefs.energyUnit) {
    await pool.query(
      `UPDATE profiles SET
         weight_unit = COALESCE($1, weight_unit),
         height_unit = COALESCE($2, height_unit),
         energy_unit = COALESCE($3, energy_unit),
         updated_at  = NOW()
       WHERE uid = $4`,
      [prefs.weightUnit || null, prefs.heightUnit || null, prefs.energyUnit || null, uid]
    );
  }
}

// ════════════════════════════════════════════════════════════
//  FOOD LOG
// ════════════════════════════════════════════════════════════

async function ensureDayLog(uid, dateKey) {
  await ensureProfile(uid);
  const { rows } = await pool.query(
    `INSERT INTO food_log_days (uid, log_date)
     VALUES ($1, $2)
     ON CONFLICT (uid, log_date) DO UPDATE SET uid = EXCLUDED.uid
     RETURNING id`,
    [uid, dateKey]
  );
  return rows[0].id;
}

function rowToMeal(row) {
  return {
    id: row.id,
    name: row.food_name,
    type: row.meal_type,
    calories: Number(row.calories_kcal),
    protein: Number(row.protein_g),
    carbs: Number(row.carbs_g),
    fat: Number(row.fat_g),
    fiber: row.fiber_g != null ? Number(row.fiber_g) : 0,
    sugar: row.sugar_g != null ? Number(row.sugar_g) : 0,
    sodium: row.sodium_mg != null ? Number(row.sodium_mg) : 0,
    vitc: row.vitamin_c_mg != null ? Number(row.vitamin_c_mg) : 0,
    calcium: row.calcium_mg != null ? Number(row.calcium_mg) : 0,
    iron: row.iron_mg != null ? Number(row.iron_mg) : 0,
    serving: row.serving_g != null ? Number(row.serving_g) : null,
    time: row.meal_time || null,
    loggedAt: row.logged_at,
  };
}

export async function getDayLog(uid, dateKey = todayKey()) {
  const key = resolveDateKey(dateKey);

  const dayResult = await pool.query(
    `SELECT id, water_ml FROM food_log_days WHERE uid = $1 AND log_date = $2`,
    [uid, key]
  );

  if (!dayResult.rows[0]) return { meals: [], water: 0 };

  const { id: dayId, water_ml } = dayResult.rows[0];

  const mealsResult = await pool.query(
    `SELECT id, food_name, meal_type, calories_kcal, protein_g, carbs_g, fat_g,
            fiber_g, sugar_g, sodium_mg, vitamin_c_mg, calcium_mg, iron_mg,
            serving_g, logged_at
     FROM food_log_entries
     WHERE log_day_id = $1
     ORDER BY logged_at ASC`,
    [dayId]
  );

  return {
    meals: mealsResult.rows.map(rowToMeal),
    water: water_ml,
  };
}

export async function getLogRange(uid, from, to) {
  const { rows } = await pool.query(
    `SELECT fld.log_date, fld.water_ml,
            fle.id, fle.food_name, fle.meal_type, fle.calories_kcal,
            fle.protein_g, fle.carbs_g, fle.fat_g,
            fle.fiber_g, fle.sugar_g, fle.sodium_mg, fle.vitamin_c_mg,
            fle.calcium_mg, fle.iron_mg,
            fle.serving_g, fle.logged_at
     FROM food_log_days fld
     LEFT JOIN food_log_entries fle ON fle.log_day_id = fld.id
     WHERE fld.uid = $1 AND fld.log_date BETWEEN $2 AND $3
     ORDER BY fld.log_date ASC, fle.logged_at ASC`,
    [uid, from, to]
  );

  const result = {};
  for (const row of rows) {
    const key = row.log_date; // already "YYYY-MM-DD" string, see pool.js type parser
    if (!result[key]) result[key] = { meals: [], water: row.water_ml };
    if (row.id) result[key].meals.push(rowToMeal(row));
  }
  return result;
}

export async function addMeal(uid, dateKey = todayKey(), meal) {
  const key = resolveDateKey(dateKey);
  const dayId = await ensureDayLog(uid, key);

  const { rows } = await pool.query(
    `INSERT INTO food_log_entries
       (log_day_id, meal_type, food_name, serving_g,
        calories_kcal, protein_g, carbs_g, fat_g,
        fiber_g, sugar_g, sodium_mg, vitamin_c_mg, calcium_mg, iron_mg)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING id, food_name, meal_type, calories_kcal, protein_g, carbs_g,
               fat_g, fiber_g, sugar_g, sodium_mg, vitamin_c_mg, calcium_mg,
               iron_mg, serving_g, logged_at`,
    [
      dayId,
      meal.type || "snack",
      meal.name,
      meal.serving || 100,
      meal.calories || 0,
      meal.protein || 0,
      meal.carbs || 0,
      meal.fat || 0,
      meal.fiber || 0,
      meal.sugar || 0,
      meal.sodium || 0,
      meal.vitc || 0,
      meal.calcium || 0,
      meal.iron || 0,
    ]
  );

  return rowToMeal(rows[0]);
}

export async function deleteMeal(uid, dateKey, mealId) {
  const key = resolveDateKey(dateKey);
  const { rowCount } = await pool.query(
    `DELETE FROM food_log_entries fle USING food_log_days fld
     WHERE fle.log_day_id = fld.id
       AND fld.uid = $1 AND fld.log_date = $2 AND fle.id = $3`,
    [uid, key, mealId]
  );
  if (rowCount === 0) throw new Error("Meal not found");
}

export async function updateWater(uid, dateKey = todayKey(), ml) {
  const key = resolveDateKey(dateKey);
  await ensureDayLog(uid, key);
  await pool.query(
    `UPDATE food_log_days SET water_ml = $1 WHERE uid = $2 AND log_date = $3`,
    [ml, uid, key]
  );
}

export async function deleteDayLog(uid, dateKey) {
  const key = resolveDateKey(dateKey);
  await pool.query(`DELETE FROM food_log_days WHERE uid = $1 AND log_date = $2`, [
    uid,
    key,
  ]);
}

// ════════════════════════════════════════════════════════════
//  WEIGHT HISTORY
// ════════════════════════════════════════════════════════════

export async function getWeights(uid, count = 90) {
  const { rows } = await pool.query(
    `SELECT id, weight_kg AS weight, notes AS note, logged_at AS date,
            TO_CHAR(logged_at, 'YYYY-MM-DD') AS "dateKey"
     FROM weight_logs
     WHERE uid = $1
     ORDER BY logged_at DESC
     LIMIT $2`,
    [uid, count]
  );
  return rows.map((r) => ({ ...r, weight: Number(r.weight) }));
}

export async function addWeight(uid, entry) {
  await ensureProfile(uid);
  const { rows } = await pool.query(
    `INSERT INTO weight_logs (uid, weight_kg, notes)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [uid, entry.weight, entry.note || ""]
  );
  return rows[0].id;
}

export async function deleteWeight(uid, docId) {
  await pool.query(`DELETE FROM weight_logs WHERE uid = $1 AND id = $2`, [
    uid,
    docId,
  ]);
}

// ════════════════════════════════════════════════════════════
//  STREAK
//  Maintained automatically by the fn_update_streak trigger on
//  food_log_days insert — these functions just read/write the
//  streaks table directly, matching the old Firestore shape.
// ════════════════════════════════════════════════════════════

export async function getStreak(uid) {
  const { rows } = await pool.query(
    `SELECT current_streak AS count, last_log_date AS "lastDate"
     FROM streaks WHERE uid = $1`,
    [uid]
  );
  if (!rows[0]) return { count: 0, lastDate: null };
  return { count: rows[0].count, lastDate: rows[0].lastDate || null };
}

/**
 * The trigger (fn_update_streak) already recalculates the streak
 * whenever a new food_log_days row is inserted (i.e. the first
 * meal logged on a new day). This function just touches today's
 * day-row to make sure that trigger has fired, then returns the
 * current value — same contract server.js expects after addMeal.
 */
export async function updateStreak(uid) {
  await ensureDayLog(uid, todayKey());
  return getStreak(uid);
}

// ════════════════════════════════════════════════════════════
//  SUMMARY  (dashboard aggregate)
// ════════════════════════════════════════════════════════════

export async function getDashboardSummary(uid) {
  const [profile, prefs, dayLog, weights, streak] = await Promise.all([
    getProfile(uid),
    getPrefs(uid),
    getDayLog(uid),
    getWeights(uid, 7),
    getStreak(uid),
  ]);

  const totals = (dayLog.meals || []).reduce(
    (acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fat += m.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    profile,
    prefs,
    today: { ...dayLog, totals },
    weights,
    streak,
  };
}
