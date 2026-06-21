  // ============================================================
  //  NutriTrack — Express API Server  (backend/server.js)
  //
  //  Start:  node server.js          (requires Node ≥ 18)
  //  Dev:    npx nodemon server.js
  //
  //  Base URL: http://localhost:3001/api
  //
  //  All routes (except /health) require:
  //    Authorization: Bearer <Firebase ID token>
  // ============================================================

  import "dotenv/config";
  import express        from "express";
  import cors           from "cors";
  import helmet         from "helmet";
  import rateLimit      from "express-rate-limit";
  import { auth }       from "./firebaseAdmin.js";
  import * as db        from "./db.js";

  const app  = express();
  const PORT = process.env.PORT || 3001;

  // ─── Middleware ───────────────────────────────────────────────
  app.use(helmet());
  const allowedOrigins = process.env.ALLOWED_ORIGINS
        ?.split(",")
        .map(o => o.trim().replace(/\/+$/, ""))
        .filter(Boolean);

      console.log("CORS allowed origins:", allowedOrigins?.length ? allowedOrigins : "* (all origins allowed)");

      app.use(cors({
        origin(origin, callback) {
          if (!origin) return callback(null, true);
          if (!allowedOrigins || allowedOrigins.length === 0) {
            return callback(null, true);
          }
          const normalized = origin.trim().replace(/\/+$/, "");
          if (allowedOrigins.includes(normalized)) {
            return callback(null, true);
          }
          console.warn(`CORS blocked origin: "${origin}" (not in allowlist: ${allowedOrigins.join(", ")})`);
          return callback(new Error(`Origin "${origin}" not allowed by CORS`));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }));
  app.use(express.json({ limit: "1mb" }));

  // Global rate-limiter — 120 req / min per IP
  app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests — please slow down." },
  }));

  // ─── Auth Middleware ──────────────────────────────────────────
  /**
   * Verifies the Firebase ID token in the Authorization header.
   * Attaches req.uid for downstream route handlers.
   */
  async function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Missing authorisation token." });
    }

    try {
      const decoded = await auth.verifyIdToken(token);
      req.uid = decoded.uid;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token.", detail: err.message });
    }
  }

  // ─── Error helper ────────────────────────────────────────────
  function handleError(res, err, context = "") {
    console.error(`[${context}]`, err);
    res.status(500).json({ error: "Internal server error.", detail: err.message });
  }

  // ════════════════════════════════════════════════════════════
  //  HEALTH CHECK
  // ════════════════════════════════════════════════════════════
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", ts: new Date().toISOString() });
  });

  // ════════════════════════════════════════════════════════════
  //  AUTH  —  /api/auth
  // ════════════════════════════════════════════════════════════

  /**
   * POST /api/auth/register
   * Called after Firebase client-side sign-up to persist profile.
   * Body: { fname, lname, email, height?, weight?, goal? }
   */
  app.post("/api/auth/register", requireAuth, async (req, res) => {
    try {
      const existing = await db.getProfile(req.uid);
      if (existing) return res.status(409).json({ error: "Profile already exists." });

      await db.createProfile(req.uid, {
        fname:  req.body.fname  || "",
        lname:  req.body.lname  || "",
        email:  req.body.email  || "",
        height: req.body.height || null,
        weight: req.body.weight || null,
        goal:   req.body.goal   || "maintain",
      });

      res.status(201).json({ message: "Profile created." });
    } catch (err) { handleError(res, err, "auth/register"); }
  });

  /**
   * GET /api/auth/me
   * Returns the authenticated user's profile.
   */
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const profile = await db.getProfile(req.uid);
      if (!profile) return res.status(404).json({ error: "Profile not found." });
      res.json(profile);
    } catch (err) { handleError(res, err, "auth/me"); }
  });

  // ════════════════════════════════════════════════════════════
  //  PROFILE  —  /api/profile
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/profile
   */
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const profile = await db.getProfile(req.uid);
      res.json(profile || {});
    } catch (err) { handleError(res, err, "profile/get"); }
  });

  /**
   * PATCH /api/profile
   * Partial update — only supplied fields are changed.
   * Body: any subset of profile fields
   */
  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      // Disallow overwriting immutable fields
      const { createdAt, uid, ...safe } = req.body;
      await db.updateProfile(req.uid, safe);
      res.json({ message: "Profile updated." });
    } catch (err) { handleError(res, err, "profile/patch"); }
  });

  /**
   * DELETE /api/profile
   * Deletes the user and all their data permanently.
   */
  app.delete("/api/profile", requireAuth, async (req, res) => {
    try {
      await db.deleteUser(req.uid);
      await auth.deleteUser(req.uid);
      res.json({ message: "Account deleted." });
    } catch (err) { handleError(res, err, "profile/delete"); }
  });

  // ════════════════════════════════════════════════════════════
  //  PREFERENCES  —  /api/prefs
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/prefs
   */
  app.get("/api/prefs", requireAuth, async (req, res) => {
    try {
      res.json(await db.getPrefs(req.uid));
    } catch (err) { handleError(res, err, "prefs/get"); }
  });

  /**
   * PUT /api/prefs
   * Full replace of preferences / goals.
   */
  app.put("/api/prefs", requireAuth, async (req, res) => {
    try {
      await db.savePrefs(req.uid, req.body);
      res.json({ message: "Preferences saved." });
    } catch (err) { handleError(res, err, "prefs/put"); }
  });

  // ════════════════════════════════════════════════════════════
  //  FOOD LOG  —  /api/log
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/log/:date
   * Returns all meals logged on a given date.
   * :date = "YYYY-MM-DD"  or  "today"
   */
  app.get("/api/log/:date", requireAuth, async (req, res) => {
    try {
      const key = req.params.date === "today"
        ? new Date().toISOString().split("T")[0]
        : req.params.date;
      res.json(await db.getDayLog(req.uid, key));
    } catch (err) { handleError(res, err, "log/get"); }
  });

  /**
   * GET /api/log
   * Query params: from=YYYY-MM-DD&to=YYYY-MM-DD
   * Returns logs for a date range (max 90 days enforced).
   */
  app.get("/api/log", requireAuth, async (req, res) => {
    try {
      let { from, to } = req.query;
      if (!from || !to) return res.status(400).json({ error: "Provide from and to query params." });

      // Safety cap — never return more than 90 days
      const fromDate = new Date(from);
      const toDate   = new Date(to);
      const diffDays = (toDate - fromDate) / 86400000;
      if (diffDays > 90) return res.status(400).json({ error: "Date range cannot exceed 90 days." });

      res.json(await db.getLogRange(req.uid, from, to));
    } catch (err) { handleError(res, err, "log/range"); }
  });

  /**
   * POST /api/log/:date/meals
   * Add a meal to a day's log.
   * Body: { name, type, calories, protein, carbs, fat, serving, time }
   */
  app.post("/api/log/:date/meals", requireAuth, async (req, res) => {
    try {
      const key  = req.params.date === "today"
        ? new Date().toISOString().split("T")[0]
        : req.params.date;
      const meal = req.body;

      if (!meal.name || meal.calories == null) {
        return res.status(400).json({ error: "name and calories are required." });
      }

      const saved  = await db.addMeal(req.uid, key, meal);
      const streak = await db.updateStreak(req.uid);

      res.status(201).json({ meal: saved, streak });
    } catch (err) { handleError(res, err, "log/add-meal"); }
  });

  /**
   * DELETE /api/log/:date/meals/:mealId
   * Remove a specific meal from a day's log.
   */
  app.delete("/api/log/:date/meals/:mealId", requireAuth, async (req, res) => {
    try {
      await db.deleteMeal(req.uid, req.params.date, req.params.mealId);
      res.json({ message: "Meal deleted." });
    } catch (err) { handleError(res, err, "log/delete-meal"); }
  });

  /**
   * PATCH /api/log/:date/water
   * Set water intake for a day.
   * Body: { ml: 1500 }
   */
  app.patch("/api/log/:date/water", requireAuth, async (req, res) => {
    try {
      const ml = parseInt(req.body.ml);
      if (isNaN(ml) || ml < 0) return res.status(400).json({ error: "ml must be a positive integer." });
      await db.updateWater(req.uid, req.params.date, ml);
      res.json({ message: "Water updated.", ml });
    } catch (err) { handleError(res, err, "log/water"); }
  });

  /**
   * DELETE /api/log/:date
   * Delete an entire day's food log.
   */
  app.delete("/api/log/:date", requireAuth, async (req, res) => {
    try {
      await db.deleteDayLog(req.uid, req.params.date);
      res.json({ message: "Day log deleted." });
    } catch (err) { handleError(res, err, "log/delete-day"); }
  });

  // ════════════════════════════════════════════════════════════
  //  WEIGHT HISTORY  —  /api/weights
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/weights?count=30
   */
  app.get("/api/weights", requireAuth, async (req, res) => {
    try {
      const count = Math.min(parseInt(req.query.count) || 30, 90);
      res.json(await db.getWeights(req.uid, count));
    } catch (err) { handleError(res, err, "weights/get"); }
  });

  /**
   * POST /api/weights
   * Body: { weight: 72.5, note: "after gym" }
   */
  app.post("/api/weights", requireAuth, async (req, res) => {
    try {
      const { weight, note } = req.body;
      if (!weight || isNaN(weight)) return res.status(400).json({ error: "weight must be a number." });
      const id = await db.addWeight(req.uid, { weight: parseFloat(weight), note });
      res.status(201).json({ id, weight: parseFloat(weight) });
    } catch (err) { handleError(res, err, "weights/post"); }
  });

  /**
   * DELETE /api/weights/:id
   */
  app.delete("/api/weights/:id", requireAuth, async (req, res) => {
    try {
      await db.deleteWeight(req.uid, req.params.id);
      res.json({ message: "Weight entry deleted." });
    } catch (err) { handleError(res, err, "weights/delete"); }
  });

  // ════════════════════════════════════════════════════════════
  //  STREAK  —  /api/streak
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/streak
   */
  app.get("/api/streak", requireAuth, async (req, res) => {
    try {
      res.json(await db.getStreak(req.uid));
    } catch (err) { handleError(res, err, "streak/get"); }
  });

  // ════════════════════════════════════════════════════════════
  //  DASHBOARD SUMMARY  —  /api/dashboard
  // ════════════════════════════════════════════════════════════

  /**
   * GET /api/dashboard
   * Single endpoint that returns everything the dashboard needs.
   * Runs all Firestore reads in parallel for speed.
   */
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      res.json(await db.getDashboardSummary(req.uid));
    } catch (err) { handleError(res, err, "dashboard"); }
  });

  // ─── 404 Catch-all ───────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found." });
  });

  // ─── Start ───────────────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`✅  NutriTrack API running on http://localhost:${PORT}`);
    console.log(`    Health:    GET  http://localhost:${PORT}/health`);
    console.log(`    Dashboard: GET  http://localhost:${PORT}/api/dashboard`);
  });

  export default app;