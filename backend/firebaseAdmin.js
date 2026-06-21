// ============================================================
//  NutriTrack — Firebase Admin SDK  (backend/firebaseAdmin.js)
//  Required by both db.js and server.js.
//  Uses a service-account key for privileged server access.
// ============================================================

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore }                 from "firebase-admin/firestore";
import { getAuth }                      from "firebase-admin/auth";

// ─── 🔧 SETUP STEPS ─────────────────────────────────────────
//  1. Firebase Console → Project Settings → Service Accounts
//  2. Click "Generate new private key" → save as
//     backend/serviceAccountKey.json   (NEVER commit this file!)
//  3. Add  backend/serviceAccountKey.json  to .gitignore
//
//  Alternatively, set the env var and remove the cert() call:
//    GOOGLE_APPLICATION_CREDENTIALS=./backend/serviceAccountKey.json
// ────────────────────────────────────────────────────────────

import { createRequire } from "module";
const require = createRequire(import.meta.url);

let serviceAccount;
try {
  serviceAccount = require("./serviceAccountKey.json");
} catch {
  console.warn(
    "⚠️  serviceAccountKey.json not found — " +
    "falling back to GOOGLE_APPLICATION_CREDENTIALS env var."
  );
}

// Guard against re-initialising during hot-reload
if (!getApps().length) {
  initializeApp(
    serviceAccount
      ? { credential: cert(serviceAccount) }
      : undefined   // uses GOOGLE_APPLICATION_CREDENTIALS
  );
}

export const db   = getFirestore();
export const auth = getAuth();

// Enable offline-friendly timestamps
db.settings({ ignoreUndefinedProperties: true });