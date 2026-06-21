-- ============================================================
--  NutriTrack — PostgreSQL Schema  (backend/schema.sql)
--  Data layer only. Auth stays on Firebase — every table is
--  keyed on the Firebase uid (TEXT), exactly what req.uid
--  already holds in server.js. No passwords or sessions live
--  here; Firebase owns identity, Postgres owns data.
--
--  Run once:
--    psql "$DATABASE_URL" -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  ENUM TYPES
-- ============================================================

CREATE TYPE meal_type      AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE goal_type      AS ENUM ('lose_fat', 'maintain', 'build_muscle');
CREATE TYPE activity_level AS ENUM (
    'sedentary', 'lightly_active', 'moderately_active',
    'very_active', 'extremely_active'
);
CREATE TYPE bmi_category   AS ENUM (
    'Underweight', 'Normal Weight', 'Overweight',
    'Obese Class I', 'Obese Class II', 'Obese Class III'
);
CREATE TYPE biological_sex AS ENUM ('male', 'female');

-- ============================================================
--  1. PROFILES  (one row per Firebase user; uid = Firebase UID)
-- ============================================================

CREATE TABLE profiles (
    uid             TEXT        PRIMARY KEY,        -- Firebase Auth UID
    email           TEXT,
    fname           TEXT        DEFAULT '',
    lname           TEXT        DEFAULT '',
    gender          TEXT,                            -- frontend sends: male | female | other
    date_of_birth   DATE,
    height_cm       NUMERIC(5,1),
    weight_kg       NUMERIC(5,2),
    target_weight_kg NUMERIC(5,2),
    bio             TEXT        DEFAULT '',
    activity        TEXT        DEFAULT 'moderate',  -- frontend f-activity select
    goal            TEXT        DEFAULT 'maintain',  -- frontend sends: lose | maintain | gain | recomp
    weight_unit     TEXT        NOT NULL DEFAULT 'kg',   -- kg | lb
    height_unit     TEXT        NOT NULL DEFAULT 'cm',   -- cm | ft
    energy_unit     TEXT        NOT NULL DEFAULT 'kcal', -- kcal | kj
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'One row per Firebase-authenticated user. No password here, Firebase owns auth.';

-- ============================================================
--  2. DAILY GOALS  (replaces localStorage nt_goals)
-- ============================================================

CREATE TABLE daily_goals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    uid             TEXT        NOT NULL REFERENCES profiles(uid) ON DELETE CASCADE,

    calories_kcal   INT         NOT NULL DEFAULT 2000,
    protein_g       NUMERIC(6,1) NOT NULL DEFAULT 150,
    carbs_g         NUMERIC(6,1) NOT NULL DEFAULT 250,
    fat_g           NUMERIC(6,1) NOT NULL DEFAULT 65,

    fiber_g         NUMERIC(6,1),
    sugar_g         NUMERIC(6,1),
    sodium_mg       NUMERIC(7,1),
    water_ml        INT         DEFAULT 2500,
    cup_size_ml     INT         DEFAULT 250,

    bmr_kcal        NUMERIC(7,1),
    tdee_kcal       NUMERIC(7,1),
    goal_type       goal_type,
    activity_level  activity_level,

    protein_pct     NUMERIC(5,2),
    carbs_pct       NUMERIC(5,2),
    fat_pct         NUMERIC(5,2),

    effective_from  DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT goals_macro_pct_check CHECK (
        protein_pct IS NULL OR
        ABS(COALESCE(protein_pct,0) + COALESCE(carbs_pct,0) + COALESCE(fat_pct,0) - 100) < 0.5
    )
);

CREATE UNIQUE INDEX idx_goals_uid_date ON daily_goals(uid, effective_from);
CREATE INDEX        idx_goals_uid      ON daily_goals(uid);

-- ============================================================
--  3. FOOD DATABASE  (the FOOD_DB array from food-log.html)
-- ============================================================

CREATE TABLE foods (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    brand           TEXT,
    barcode         TEXT,

    calories_kcal   NUMERIC(7,2) NOT NULL DEFAULT 0,
    protein_g       NUMERIC(6,2) NOT NULL DEFAULT 0,
    carbs_g         NUMERIC(6,2) NOT NULL DEFAULT 0,
    fat_g           NUMERIC(6,2) NOT NULL DEFAULT 0,
    fiber_g         NUMERIC(6,2),
    sugar_g         NUMERIC(6,2),
    saturated_fat_g NUMERIC(6,2),
    sodium_mg       NUMERIC(7,2),
    potassium_mg    NUMERIC(7,2),
    vitamin_c_mg    NUMERIC(6,2),
    calcium_mg      NUMERIC(7,2),
    iron_mg         NUMERIC(6,2),
    vitamin_d_mcg   NUMERIC(6,2),
    vitamin_b12_mcg NUMERIC(6,2),
    magnesium_mg    NUMERIC(7,2),
    zinc_mg         NUMERIC(6,2),

    is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_by      TEXT        REFERENCES profiles(uid) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_foods_name    ON foods USING GIN (to_tsvector('english', name));
CREATE INDEX idx_foods_barcode ON foods(barcode) WHERE barcode IS NOT NULL;

COMMENT ON COLUMN foods.calories_kcal IS 'All macros stored per 100 g - multiply by serving/100 in app';

-- ============================================================
--  4. FOOD LOG DAYS  (top-level container, nt_food_log keys)
-- ============================================================

CREATE TABLE food_log_days (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    uid         TEXT    NOT NULL REFERENCES profiles(uid) ON DELETE CASCADE,
    log_date    DATE    NOT NULL,
    water_ml    INT     NOT NULL DEFAULT 0,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (uid, log_date)
);

CREATE INDEX idx_log_days_uid_date ON food_log_days(uid, log_date DESC);

-- ============================================================
--  5. FOOD LOG ENTRIES  (individual meal items)
-- ============================================================

CREATE TABLE food_log_entries (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    log_day_id      UUID        NOT NULL REFERENCES food_log_days(id) ON DELETE CASCADE,
    food_id         UUID        REFERENCES foods(id) ON DELETE SET NULL,
    meal_type       meal_type   NOT NULL,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    food_name       TEXT        NOT NULL,
    serving_g       NUMERIC(7,2) NOT NULL DEFAULT 100,

    calories_kcal   NUMERIC(7,2) NOT NULL DEFAULT 0,
    protein_g       NUMERIC(6,2) NOT NULL DEFAULT 0,
    carbs_g         NUMERIC(6,2) NOT NULL DEFAULT 0,
    fat_g           NUMERIC(6,2) NOT NULL DEFAULT 0,
    fiber_g         NUMERIC(6,2),
    sugar_g         NUMERIC(6,2),
    sodium_mg       NUMERIC(7,2),
    vitamin_c_mg    NUMERIC(6,2),
    calcium_mg      NUMERIC(7,2),
    iron_mg         NUMERIC(6,2),

    notes           TEXT,
    sort_order      SMALLINT    NOT NULL DEFAULT 0
);

CREATE INDEX idx_entries_log_day ON food_log_entries(log_day_id);
CREATE INDEX idx_entries_food    ON food_log_entries(food_id) WHERE food_id IS NOT NULL;
CREATE INDEX idx_entries_meal    ON food_log_entries(log_day_id, meal_type);

-- ============================================================
--  6. WEIGHT LOG  (replaces localStorage nt_weights)
-- ============================================================

CREATE TABLE weight_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    uid             TEXT        NOT NULL REFERENCES profiles(uid) ON DELETE CASCADE,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    weight_kg       NUMERIC(5,2) NOT NULL,
    body_fat_pct    NUMERIC(4,1),
    muscle_mass_kg  NUMERIC(5,2),
    notes           TEXT,

    CONSTRAINT weight_positive CHECK (weight_kg > 0)
);

CREATE INDEX idx_weight_uid_date ON weight_logs(uid, logged_at DESC);

-- ============================================================
--  7. BMI HISTORY  (replaces localStorage nt_bmi_history)
-- ============================================================

CREATE TABLE bmi_records (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    uid                     TEXT        NOT NULL REFERENCES profiles(uid) ON DELETE CASCADE,
    calculated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    height_cm               NUMERIC(5,1) NOT NULL,
    weight_kg               NUMERIC(5,2) NOT NULL,
    age_years                SMALLINT    NOT NULL,
    sex                      biological_sex NOT NULL,

    bmi                      NUMERIC(5,2) NOT NULL,
    bmi_category              bmi_category NOT NULL,
    ideal_weight_kg           NUMERIC(5,2),
    body_fat_est_pct          NUMERIC(4,1),
    healthy_weight_min_kg     NUMERIC(5,2),
    healthy_weight_max_kg     NUMERIC(5,2)
);

CREATE INDEX idx_bmi_uid_date ON bmi_records(uid, calculated_at DESC);

-- ============================================================
--  8. STREAKS  (replaces localStorage nt_streak)
-- ============================================================

CREATE TABLE streaks (
    uid             TEXT    PRIMARY KEY REFERENCES profiles(uid) ON DELETE CASCADE,
    current_streak  INT     NOT NULL DEFAULT 0,
    longest_streak  INT     NOT NULL DEFAULT 0,
    last_log_date   DATE,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  9. MACRO CALCULATOR HISTORY  (optional audit trail)
-- ============================================================

CREATE TABLE macro_calculations (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    uid                 TEXT        NOT NULL REFERENCES profiles(uid) ON DELETE CASCADE,
    calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    age_years           SMALLINT    NOT NULL,
    sex                 biological_sex NOT NULL,
    height_cm           NUMERIC(5,1) NOT NULL,
    weight_kg           NUMERIC(5,2) NOT NULL,
    activity_level      activity_level NOT NULL,
    goal_type           goal_type   NOT NULL,
    calorie_adjustment  INT         NOT NULL DEFAULT 0,

    bmr_kcal            NUMERIC(7,1) NOT NULL,
    tdee_kcal           NUMERIC(7,1) NOT NULL,
    target_kcal         INT         NOT NULL,
    protein_g           NUMERIC(6,1) NOT NULL,
    carbs_g             NUMERIC(6,1) NOT NULL,
    fat_g               NUMERIC(6,1) NOT NULL,
    protein_pct         NUMERIC(5,2) NOT NULL,
    carbs_pct           NUMERIC(5,2) NOT NULL,
    fat_pct             NUMERIC(5,2) NOT NULL,

    saved_as_goal       BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_macro_calc_uid ON macro_calculations(uid, calculated_at DESC);

-- ============================================================
--  VIEWS
-- ============================================================

CREATE VIEW v_daily_nutrition AS
SELECT
    fld.uid,
    fld.log_date,
    fld.water_ml,
    COUNT(fle.id)                           AS meal_count,
    COALESCE(SUM(fle.calories_kcal), 0)     AS total_calories,
    COALESCE(SUM(fle.protein_g),     0)     AS total_protein_g,
    COALESCE(SUM(fle.carbs_g),       0)     AS total_carbs_g,
    COALESCE(SUM(fle.fat_g),         0)     AS total_fat_g,
    COALESCE(SUM(fle.fiber_g),       0)     AS total_fiber_g,
    COALESCE(SUM(fle.sugar_g),       0)     AS total_sugar_g,
    COALESCE(SUM(fle.sodium_mg),     0)     AS total_sodium_mg,
    COALESCE(SUM(fle.vitamin_c_mg),  0)     AS total_vitamin_c_mg,
    COALESCE(SUM(fle.calcium_mg),    0)     AS total_calcium_mg,
    COALESCE(SUM(fle.iron_mg),       0)     AS total_iron_mg
FROM food_log_days  fld
LEFT JOIN food_log_entries fle ON fle.log_day_id = fld.id
GROUP BY fld.uid, fld.log_date, fld.water_ml;

COMMENT ON VIEW v_daily_nutrition IS 'Pre-aggregated daily totals per user - used by dashboard and reports';

CREATE VIEW v_30day_summary AS
SELECT
    uid,
    COUNT(*)                                AS days_logged,
    ROUND(AVG(total_calories), 0)           AS avg_calories,
    ROUND(AVG(total_protein_g), 1)          AS avg_protein_g,
    ROUND(AVG(total_carbs_g),   1)          AS avg_carbs_g,
    ROUND(AVG(total_fat_g),     1)          AS avg_fat_g,
    ROUND(AVG(water_ml),        0)          AS avg_water_ml
FROM v_daily_nutrition
WHERE log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY uid;

CREATE VIEW v_latest_weight AS
SELECT DISTINCT ON (uid)
    uid, weight_kg, body_fat_pct, logged_at
FROM weight_logs
ORDER BY uid, logged_at DESC;

CREATE VIEW v_latest_bmi AS
SELECT DISTINCT ON (uid)
    uid, bmi, bmi_category, calculated_at
FROM bmi_records
ORDER BY uid, calculated_at DESC;

-- ============================================================
--  FUNCTIONS & TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_food_log_days_updated_at
    BEFORE UPDATE ON food_log_days
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_foods_updated_at
    BEFORE UPDATE ON foods
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Auto-upsert streak when a food log day is inserted
CREATE OR REPLACE FUNCTION fn_update_streak()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_last_date DATE;
    v_current   INT;
    v_longest   INT;
BEGIN
    SELECT last_log_date, current_streak, longest_streak
    INTO v_last_date, v_current, v_longest
    FROM streaks WHERE uid = NEW.uid;

    IF NOT FOUND THEN
        INSERT INTO streaks(uid, current_streak, longest_streak, last_log_date)
        VALUES (NEW.uid, 1, 1, NEW.log_date);
    ELSIF v_last_date = NEW.log_date THEN
        NULL;
    ELSIF v_last_date = NEW.log_date - 1 THEN
        v_current := v_current + 1;
        v_longest := GREATEST(v_longest, v_current);
        UPDATE streaks
        SET current_streak = v_current,
            longest_streak = v_longest,
            last_log_date  = NEW.log_date,
            updated_at     = NOW()
        WHERE uid = NEW.uid;
    ELSE
        UPDATE streaks
        SET current_streak = 1,
            last_log_date  = NEW.log_date,
            updated_at     = NOW()
        WHERE uid = NEW.uid;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_streak_on_log_day
    AFTER INSERT ON food_log_days
    FOR EACH ROW EXECUTE FUNCTION fn_update_streak();

-- ============================================================
--  SEED DATA - Built-in food database (mirrors FOOD_DB array)
-- ============================================================

INSERT INTO foods (name, calories_kcal, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, vitamin_c_mg, calcium_mg, iron_mg, is_verified) VALUES
('Chicken Breast (grilled)',  165,  31.0,  0.0,  3.6,  0.0,  0.0,  74,   0.0,  15,  0.9,  TRUE),
('Brown Rice (cooked)',       112,   2.6, 23.5,  0.9,  1.8,  0.0,   5,   0.0,  10,  0.5,  TRUE),
('Whole Egg',                 143,  13.0,  1.1,  9.5,  0.0,  1.1, 142,   0.0,  56,  1.8,  TRUE),
('Banana',                     89,   1.1, 23.0,  0.3,  2.6, 12.0,   1,   8.7,   5,  0.3,  TRUE),
('Greek Yogurt (plain)',       100,  10.0,  3.6,  5.0,  0.0,  3.2,  36,   0.0, 111,  0.0,  TRUE),
('Oats (dry)',                 389,  17.0, 66.0,  7.0, 10.6,  0.0,   2,   0.0,  54,  4.7,  TRUE),
('Broccoli (raw)',              34,   2.8,  7.0,  0.4,  2.6,  1.7,  33,  89.2,  47,  0.7,  TRUE),
('Almonds',                    579,  21.0, 22.0, 50.0, 12.5,  4.4,   1,   0.0, 264,  3.7,  TRUE),
('Salmon (cooked)',            208,  20.0,  0.0, 13.0,  0.0,  0.0,  59,   0.0,  12,  0.3,  TRUE),
('Apple',                       52,   0.3, 14.0,  0.2,  2.4, 10.0,   1,   4.6,   6,  0.1,  TRUE),
('White Rice (cooked)',        130,   2.7, 28.0,  0.3,  0.4,  0.0,   1,   0.0,  10,  0.2,  TRUE),
('Milk (whole)',                61,   3.2,  4.8,  3.3,  0.0,  5.1,  44,   0.0, 113,  0.0,  TRUE),
('Bread (whole wheat)',        247,  13.0, 41.0,  3.4,  6.0,  6.0, 400,   0.0, 107,  3.9,  TRUE),
('Peanut Butter',              588,  25.0, 20.0, 50.0,  6.0,  9.0, 426,   0.0,  43,  1.9,  TRUE),
('Sweet Potato (cooked)',       86,   1.6, 20.0,  0.1,  3.0,  4.2,  36,  19.6,  32,  0.7,  TRUE),
('Tuna (canned)',              109,  24.0,  0.0,  1.0,  0.0,  0.0, 318,   0.0,   8,  1.0,  TRUE),
('Cottage Cheese',              98,  11.0,  3.4,  4.3,  0.0,  2.7, 364,   0.0,  83,  0.2,  TRUE),
('Spinach (raw)',               23,   2.9,  3.6,  0.4,  2.2,  0.4,  79,  28.1,  99,  2.7,  TRUE);

-- ============================================================
--  NOTE ON ROW LEVEL SECURITY
-- ============================================================
-- RLS is intentionally NOT enabled here. The original draft used
-- RLS policies keyed on a Postgres-side
-- current_setting('app.current_user_id')::UUID - that assumed
-- Postgres-native auth issuing its own session per request.
--
-- This app instead verifies identity via Firebase ID tokens in
-- server.js (requireAuth middleware), and every query in db.js
-- is manually scoped with "WHERE uid = $1" using the verified
-- req.uid. That's the actual access boundary here. If you later
-- want defense-in-depth at the DB layer, you can enable RLS with
-- policies like:
--   USING (uid = current_setting('app.current_uid', TRUE))
-- and have the backend run SET LOCAL app.current_uid = $uid
-- at the start of each request, but it's optional, not required,
-- since the app never lets raw client input choose the uid.
