<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">


  <!-- HERO -->
  <div class="readme-hero">
    <div class="hero-badge">📄 README — Setup Guide v1.0</div>
    <h1 class="hero-title">Get <span>NutriTrack</span><br>running in 60 seconds</h1>
    <p class="hero-sub">A fully client-side nutrition & body tracking app — no server, no database, no install. Just drop 7 HTML files in one folder and open your browser.</p>
    <div class="hero-pills">
      <span class="pill pill-green">✓ No server needed</span>
      <span class="pill pill-blue">✓ Works offline</span>
      <span class="pill pill-amber">✓ Data stays on your device</span>
      <span class="pill pill-purple">✓ 6 fully connected pages</span>
    </div>
  </div>

  <!-- FILE STRUCTURE -->
  <div class="section" id="setup">
    <div class="section-title">📁 File Structure</div>
    <div class="section-sub">All files must live in the <strong>same folder</strong>. The names below must match exactly — they are hardcoded in the navigation links.</div>
    <div class="file-tree">
      <div class="ft-folder">📁 nutritrack/  <span class="ft-comment">&lt;-- your folder name (anything works)</span></div>
      <div class="ft-indent">
        <div class="ft-file">├── <a href="login.html">login.html</a>  <span class="ft-comment">← Start here</span></div>
        <div class="ft-file">├── <a href="dashboard.html">dashboard.html</a>  <span class="ft-comment">← Main hero / home</span></div>
        <div class="ft-file">├── <a href="food-log.html">food-log.html</a>  <span class="ft-comment">← Log meals & nutrients</span></div>
        <div class="ft-file">├── <a href="bmi-calculator.html">bmi-calculator.html</a>  <span class="ft-comment">← BMI calculator</span></div>
        <div class="ft-file">├── <a href="macro-calculator.html">macro-calculator.html</a>  <span class="ft-comment">← TDEE & macros</span></div>
        <div class="ft-file">├── <a href="download-report.html">download-report.html</a>  <span class="ft-comment">← Export data</span></div>
        <div class="ft-file">└── <a href="README.html" style="color:var(--amber)">README.html</a>  <span class="ft-comment">← This file</span></div>
      </div>
    </div>
    <div class="alert alert-amber" style="margin-top:16px">
      <span class="alert-icon">⚠️</span>
      <div class="alert-body"><strong>File names are case-sensitive.</strong> Do not rename the files — all sidebar navigation links reference these exact filenames. If you rename one, update every <code>&lt;a href="..."&gt;</code> that points to it.</div>
    </div>
  </div>

  <!-- HOW TO RUN -->
  <div class="section">
    <div class="section-title">🚀 How to Run</div>
    <div class="section-sub">Three ways to open the app — pick whatever's easiest for you.</div>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <div class="step-title">Double-click method (simplest)</div>
          <div class="step-desc">Download all 7 files into one folder. Double-click <code>login.html</code>. It opens in your default browser. Done. All pages and navigation will work immediately.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <div class="step-title">VS Code Live Server (recommended for development)</div>
          <div class="step-desc">Install the <strong>Live Server</strong> extension in VS Code. Right-click <code>login.html</code> → <em>Open with Live Server</em>. Auto-reloads on save. Great for customizing the app.</div>
          <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)">Copy</button>
            <span class="comment"># Install VS Code extension:</span><br>
            <span class="keyword">ext install</span> <span class="string">ritwickdey.LiveServer</span><br><br>
            <span class="comment"># Or install via command line:</span><br>
            <span class="keyword">code</span> --install-extension ritwickdey.LiveServer
          </div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <div class="step-title">Python / Node local server</div>
          <div class="step-desc">Open your terminal, <code>cd</code> into the folder, and run one of these:</div>
          <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)">Copy</button>
            <span class="comment"># Python 3 (built-in — no install needed)</span><br>
            <span class="fn">python3</span> -m http.server <span class="string">8080</span><br><br>
            <span class="comment"># Node.js (if you have Node installed)</span><br>
            <span class="fn">npx</span> serve .<br><br>
            <span class="comment"># Then open in browser:</span><br>
            <span class="string">http://localhost:8080/login.html</span>
          </div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-body">
          <div class="step-title">Deploy to the web (optional)</div>
          <div class="step-desc">Drop the folder into <strong>GitHub Pages</strong>, <strong>Netlify</strong>, or <strong>Vercel</strong> for free hosting. No build step needed — just upload the HTML files as-is. Data stays in each user's browser localStorage (not shared).</div>
        </div>
      </div>
    </div>
  </div>

  <!-- PAGES -->
  <div class="section" id="pages">
    <div class="section-title">📄 Pages Overview</div>
    <div class="section-sub">Every page shares the same sidebar navigation and color system.</div>
    <div class="page-grid">
      <a href="login.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">🔐</span><span class="pc-name">Login & Register</span></div>
        <div class="pc-file">login.html</div>
        <div class="pc-desc">Sign in / create account. Stores credentials in localStorage. "Remember me" auto-fills email. Social login buttons simulate auth.</div>
      </a>
      <a href="dashboard.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">🏠</span><span class="pc-name">Dashboard</span></div>
        <div class="pc-file">dashboard.html</div>
        <div class="pc-desc">Hero page. Shows today's calorie ring, macro bars, recent meals, weight history chart, quick nav cards, and day streak.</div>
      </a>
      <a href="food-log.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">🥗</span><span class="pc-name">Food Log</span></div>
        <div class="pc-file">food-log.html</div>
        <div class="pc-desc">Log meals by meal type. Search 18 built-in foods (auto-fills macros). Manual entry for all macros + 6 micronutrients. Edit/delete entries. Water tracker. Date navigation.</div>
      </a>
      <a href="bmi-calculator.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">⚖️</span><span class="pc-name">BMI Calculator</span></div>
        <div class="pc-file">bmi-calculator.html</div>
        <div class="pc-desc">Metric & imperial units. Animated gauge needle. Healthy weight range, ideal weight (Devine formula), body fat estimate. Saves history.</div>
      </a>
      <a href="macro-calculator.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">📊</span><span class="pc-name">Macro Calculator</span></div>
        <div class="pc-file">macro-calculator.html</div>
        <div class="pc-desc">Mifflin-St Jeor TDEE formula. 3 goals × 5 activity levels. Animated donut chart. Custom macro split sliders. Per-meal breakdown. Save as goals.</div>
      </a>
      <a href="download-report.html" class="page-card">
        <div class="pc-top"><span class="pc-icon">📥</span><span class="pc-name">Download Report</span></div>
        <div class="pc-file">download-report.html</div>
        <div class="pc-desc">Export as CSV (Excel-ready), JSON (raw data), or Printable HTML report. Date range picker. Live data preview table. Calorie trend chart.</div>
      </a>
    </div>
  </div>

  <!-- DATA STORAGE -->
  <div class="section" id="data">
    <div class="section-title">💾 Data Storage</div>
    <div class="section-sub">Everything is saved in your browser's <code>localStorage</code> — no server, no account required on the backend.</div>
    <div class="flow-grid">
      <div class="flow-card">
        <div class="flow-key">nt_session</div>
        <div class="flow-desc">Active login session: name, email. Cleared on logout.</div>
      </div>
      <div class="flow-card">
        <div class="flow-key">nt_users</div>
        <div class="flow-desc">Registered accounts object. Key = email, value = hashed profile.</div>
      </div>
      <div class="flow-card">
        <div class="flow-key">nt_food_log</div>
        <div class="flow-desc">Daily food entries keyed by date (YYYY-MM-DD). Contains meals array + water intake.</div>
      </div>
      <div class="flow-card">
        <div class="flow-key">nt_weights</div>
        <div class="flow-desc">Array of weight log entries: <code>{date, weight}</code>. Used on dashboard and download page.</div>
      </div>
      <div class="flow-card">
        <div class="flow-key">nt_bmi_history</div>
        <div class="flow-desc">Array of BMI records: <code>{date, bmi, weight, cat}</code>. Saved each time you calculate.</div>
      </div>
      <div class="flow-card">
        <div class="flow-key">nt_goals</div>
        <div class="flow-desc">Daily targets: calories, protein, carbs, fat. Set from Macro Calculator → Save Goals.</div>
      </div>
    </div>
    <div class="alert alert-teal" style="margin-top:16px">
      <span class="alert-icon">💡</span>
      <div class="alert-body"><strong>Data persists until cleared.</strong> localStorage survives browser restarts. Use <em>Download Report → Clear All Data</em> to reset, or open DevTools → Application → Local Storage to inspect manually.</div>
    </div>
  </div>

  <!-- FEATURES TABLE -->
  <div class="section" id="features">
    <div class="section-title">✅ Features Checklist</div>
    <div class="section-sub">Everything included out of the box.</div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden">
      <table class="feature-table">
        <thead><tr><th>Feature</th><th>Page</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>User registration & login (localStorage auth)</td><td>login.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Session persistence & "remember me"</td><td>login.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Daily calorie ring (animated)</td><td>dashboard.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Macro progress bars</td><td>dashboard.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Weight history chart</td><td>dashboard.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Day streak tracker</td><td>dashboard.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>18-food searchable database</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Auto-scale macros by serving size</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>4 meal types (breakfast/lunch/dinner/snack)</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>12-field nutrition entry (macros + 6 micros)</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Edit & delete food entries</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Water intake tracker</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Date navigation (log past days)</td><td>food-log.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>BMI calculator (metric + imperial)</td><td>bmi-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Animated BMI gauge</td><td>bmi-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Body fat % estimate</td><td>bmi-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>BMI history tracking</td><td>bmi-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>TDEE calculator (Mifflin-St Jeor)</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>5 activity levels</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Animated donut macro chart</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Custom macro split sliders</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Per-meal breakdown</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Save goals (used by food log + dashboard)</td><td>macro-calculator.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>CSV export (Excel-ready)</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>JSON export (raw data)</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Printable HTML report (save as PDF)</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Date range filter (7 / 30 / 60 / 90 / custom)</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Calorie trend bar chart</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Clear all data (danger zone)</td><td>download-report.html</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Responsive layout (mobile-friendly)</td><td>All pages</td><td><span class="badge badge-green">✓ Done</span></td></tr>
          <tr><td>Google Fonts (Sora + Inter)</td><td>All pages</td><td><span class="badge badge-blue">Requires internet</span></td></tr>
          <tr><td>Expand food database</td><td>food-log.html</td><td><span class="badge badge-amber">Customizable</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- CUSTOMIZATION -->
  <div class="section">
    <div class="section-title">🎨 Customization Tips</div>
    <div class="section-sub">Quick ways to make NutriTrack your own.</div>
    <div class="steps">
      <div class="step">
        <div class="step-num">→</div>
        <div class="step-body">
          <div class="step-title">Change the color theme</div>
          <div class="step-desc">Every page uses CSS custom properties at the top. Change <code>--teal</code>, <code>--amber</code>, <code>--purple</code> in the <code>:root</code> block of any file to instantly retheme the whole app.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">→</div>
        <div class="step-body">
          <div class="step-title">Add more foods to the database</div>
          <div class="step-desc">In <code>food-log.html</code>, find the <code>const FOOD_DB = [...]</code> array. Each entry follows the pattern <code>{name, per100: {calories, protein, carbs, fat, fiber, sugar, sodium, vitc, calcium, iron}}</code>.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">→</div>
        <div class="step-body">
          <div class="step-title">Change default calorie goal</div>
          <div class="step-desc">The default goal is <code>2000 kcal</code>. To change it permanently, find <code>localStorage.getItem('nt_goals') || '{"calories":2000,...}'</code> in each file and update the defaults, or just use the Macro Calculator to set goals from the UI.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">→</div>
        <div class="step-body">
          <div class="step-title">Offline fonts (no internet dependency)</div>
          <div class="step-desc">Replace the Google Fonts <code>&lt;link&gt;</code> tags with locally downloaded fonts. Download <strong>Sora</strong> and <strong>Inter</strong> from Google Fonts, add them to your folder, and use <code>@font-face</code> in a <code>shared.css</code> file.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- LAUNCH -->
  <div class="launch-wrap">
    <a href="login.html" class="launch-btn">
      🚀 Launch NutriTrack
    </a>
    <p class="launch-sub">Opens <code>login.html</code> — your starting point</p>
  </div>

</div>

<script>
function copyCode(btn) {
  const block = btn.parentElement;
  const text = block.innerText.replace('Copy\n','').trim();
  navigator.clipboard.writeText(text).then(()=>{
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--teal)';
    setTimeout(()=>{ btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
  }).catch(()=>{ btn.textContent = 'Failed'; });
}
</script>
</body>
</html>
