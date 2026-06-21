// auth.js — shared Firebase Auth helper for all NutriTrack pages
import { initializeApp }             from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAJFHvvH7InFQIYy4uU6wAPl1qNxAeLnJE",
  authDomain:        "nutritrack-905c4.firebaseapp.com",
  projectId:         "nutritrack-905c4",
  storageBucket:     "nutritrack-905c4.firebasestorage.app",
  messagingSenderId: "709613439860",
  appId:             "1:709613439860:web:544f7dda688138a2fc7a21"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

let _refreshInterval = null;

/**
 * Call this on every page.
 * - Redirects to login.html if not signed in
 * - Gives you a fresh token immediately via onReady(token, user)
 * - Auto-refreshes the token every 50 minutes silently
 */
export function requireAuth(onReady) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Get a fresh token immediately
    const token = await user.getIdToken(true);
    localStorage.setItem("nt_token", token);

    // Call the page's init function with the fresh token
    onReady(token, user);

    // Clear any existing interval (e.g. hot reload)
    if (_refreshInterval) clearInterval(_refreshInterval);

    // Refresh token every 50 minutes (tokens expire after 60 min)
    _refreshInterval = setInterval(async () => {
      try {
        const newToken = await user.getIdToken(true);
        localStorage.setItem("nt_token", newToken);
        console.log("🔄 Token refreshed silently");
      } catch (err) {
        console.warn("Token refresh failed — redirecting to login", err);
        clearInterval(_refreshInterval);
        window.location.href = "login.html";
      }
    }, 50 * 60 * 1000); // 50 minutes
  });
}

/**
 * Sign out and clear everything
 */
export async function logoutUser() {
  if (_refreshInterval) clearInterval(_refreshInterval);
  await signOut(auth);
  localStorage.clear();
  window.location.href = "login.html";
}

export { auth };