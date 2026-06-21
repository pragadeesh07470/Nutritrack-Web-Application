// ============================================================
//  NutriTrack — Database Layer  (backend/db.js)
//  All Firestore reads/writes go through this module so
//  server.js stays clean and data logic is centralised.
// ============================================================

import { db } from "./firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";

const serverTimestamp = () => FieldValue.serverTimestamp();

// ─── helpers ────────────────────────────────────────────────
const userRef  = (uid)             => db.collection("users").doc(uid);
const subCol   = (uid, col)        => userRef(uid).collection(col);
const subDoc   = (uid, col, docId) => subCol(uid, col).doc(docId);

function todayKey() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// ════════════════════════════════════════════════════════════
//  USER PROFILE
// ════════════════════════════════════════════════════════════

/**
 * Get a user's profile document.
 * Returns null if the user doesn't exist yet.
 */
export async function getProfile(uid) {
  const snap = await userRef(uid).get();
  return snap.exists ? snap.data() : null;
}

/**
 * Create or fully replace a user's profile.
 * Called on first login / registration.
 */
export async function createProfile(uid, data) {
  await userRef(uid).set({
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Partially update profile fields.
 */
export async function updateProfile(uid, fields) {
  await userRef(uid).update({
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a user and all sub-collections.
 * NOTE: Firestore doesn't auto-delete sub-collections,
 * so we recursively delete using the Admin SDK helper.
 */
export async function deleteUser(uid) {
  await db.recursiveDelete(userRef(uid));
}

// ════════════════════════════════════════════════════════════
//  PREFERENCES / GOALS
// ════════════════════════════════════════════════════════════

export async function getPrefs(uid) {
  const snap = await subDoc(uid, "settings", "prefs").get();
  if (snap.exists) return snap.data();
  // Return sensible defaults if none saved yet
  return {
    calories: 2000,
    protein:  150,
    carbs:    250,
    fat:      65,
    waterGoal: 2500,
    cupSize:   250,
    weightUnit: "kg",
    heightUnit: "cm",
    energyUnit: "kcal",
  };
}

export async function savePrefs(uid, prefs) {
  await subDoc(uid, "settings", "prefs").set({
    ...prefs,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ════════════════════════════════════════════════════════════
//  FOOD LOG
// ════════════════════════════════════════════════════════════

/**
 * Get a single day's food log.
 * @param {string} uid
 * @param {string} dateKey  "YYYY-MM-DD"  (defaults to today)
 */
export async function getDayLog(uid, dateKey = todayKey()) {
  const snap = await subDoc(uid, "food_log", dateKey).get();
  return snap.exists
    ? snap.data()
    : { meals: [], water: 0 };
}

/**
 * Get food logs for a date range.
 * @param {string} from  "YYYY-MM-DD"
 * @param {string} to    "YYYY-MM-DD"
 */
export async function getLogRange(uid, from, to) {
  const col   = subCol(uid, "food_log");
  const snaps = await col
    .where("__name__", ">=", from)
    .where("__name__", "<=", to)
    .orderBy("__name__")
    .get();

  const result = {};
  snaps.forEach(s => { result[s.id] = s.data(); });
  return result;
}

/**
 * Add a meal entry to a day's log.
 * @param {string} uid
 * @param {string} dateKey
 * @param {object} meal  { name, type, calories, protein, carbs, fat, serving, time }
 */
export async function addMeal(uid, dateKey = todayKey(), meal) {
  const ref     = subDoc(uid, "food_log", dateKey);
  const snap    = await ref.get();
  const current = snap.exists ? snap.data() : { meals: [], water: 0 };

  const newMeal = {
    id:        Date.now().toString(),
    ...meal,
    loggedAt:  new Date().toISOString(),
  };

  await ref.set({
    ...current,
    meals:     [...current.meals, newMeal],
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return newMeal;
}

/**
 * Delete a specific meal by its id from a day's log.
 */
export async function deleteMeal(uid, dateKey, mealId) {
  const ref  = subDoc(uid, "food_log", dateKey);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Day log not found");

  const data  = snap.data();
  const meals = (data.meals || []).filter(m => m.id !== mealId);
  await ref.update({ meals, updatedAt: serverTimestamp() });
}

/**
 * Update water intake for a day.
 */
export async function updateWater(uid, dateKey = todayKey(), ml) {
  const ref = subDoc(uid, "food_log", dateKey);
  await ref.set({ water: ml, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Delete an entire day's log.
 */
export async function deleteDayLog(uid, dateKey) {
  await subDoc(uid, "food_log", dateKey).delete();
}

// ════════════════════════════════════════════════════════════
//  WEIGHT HISTORY
// ════════════════════════════════════════════════════════════

/**
 * Get all weight entries, newest first.
 * @param {number} count  max entries to return (default 90)
 */
export async function getWeights(uid, count = 90) {
  const col   = subCol(uid, "weights");
  const snaps = await col.orderBy("date", "desc").limit(count).get();
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Log a new weight entry.
 * @param {object} entry  { weight: 72.5, note: "" }
 */
export async function addWeight(uid, entry) {
  const ref = await subCol(uid, "weights").add({
    weight:    entry.weight,
    note:      entry.note || "",
    date:      serverTimestamp(),
    dateKey:   todayKey(),
  });
  return ref.id;
}

/**
 * Delete a weight entry by document ID.
 */
export async function deleteWeight(uid, docId) {
  await subDoc(uid, "weights", docId).delete();
}

// ════════════════════════════════════════════════════════════
//  STREAK
// ════════════════════════════════════════════════════════════

export async function getStreak(uid) {
  const snap = await subDoc(uid, "settings", "streak").get();
  return snap.exists ? snap.data() : { count: 0, lastDate: null };
}

/**
 * Recalculate and persist the streak.
 * Call this every time a meal is logged.
 */
export async function updateStreak(uid) {
  const today    = todayKey();
  const snap     = await subDoc(uid, "settings", "streak").get();
  const current  = snap.exists ? snap.data() : { count: 0, lastDate: null };

  let { count, lastDate } = current;

  if (lastDate === today) {
    // Already incremented today — nothing to do
    return { count, lastDate };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayKey) {
    count += 1;           // Consecutive day — extend streak
  } else {
    count = 1;            // Streak broken — reset
  }

  const updated = { count, lastDate: today };
  await subDoc(uid, "settings", "streak").set(updated);
  return updated;
}

// ════════════════════════════════════════════════════════════
//  SUMMARY  (dashboard aggregate)
// ════════════════════════════════════════════════════════════

/**
 * Returns everything the dashboard needs in one round-trip.
 */
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
      acc.protein  += m.protein  || 0;
      acc.carbs    += m.carbs    || 0;
      acc.fat      += m.fat      || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    profile,
    prefs,
    today:   { ...dayLog, totals },
    weights,
    streak,
  };
}