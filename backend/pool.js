// ============================================================
//  NutriTrack — Postgres Connection Pool  (backend/pool.js)
//  Single shared pool used by db.js for all queries.
// ============================================================

import pg from "pg";
const { Pool, types } = pg;

// DATE columns (OID 1082) come back from pg as JS Date objects by
// default, parsed at local midnight. Converting those back to a
// "YYYY-MM-DD" string with toISOString() can shift the date by a
// day depending on the server's timezone vs UTC. Every date in this
// app is just a plain calendar key, so keep it a raw string instead.
types.setTypeParser(1082, (val) => val);

// DATABASE_URL is provided by Railway automatically when you
// attach a Postgres plugin to your project. Locally, put it in
// backend/.env, e.g.:
//   DATABASE_URL=postgresql://user:pass@host:5432/dbname
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL is not set — Postgres connections will fail. " +
    "Set it in backend/.env (local) or your hosting provider's env vars."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Railway (and most managed Postgres hosts) require SSL but use
  // self-signed certs, so we disable strict verification.
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error:", err);
});
