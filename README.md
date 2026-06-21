<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NutriTrack — README & Setup Guide</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0A0F1E; --card: #161D2E; --card2: #1C2438;
    --teal: #00D4AA; --amber: #F5A623; --purple: #7C3AED;
    --red: #FF4D6D; --blue: #4F8EF7; --green: #22C55E;
    --white: #F0F4FF; --slate: #8892A4;
    --border: rgba(255,255,255,0.07); --glass: rgba(255,255,255,0.04);
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: var(--navy); color: var(--white); line-height: 1.7; }

  /* NAV */
  .top-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(10,15,30,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
  }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo-ring { width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid var(--teal); display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 13px; color: var(--teal); }
  .brand-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 17px; color: var(--white); }
  .brand-name em { color: var(--teal); font-style: normal; }
  .nav-links { display: flex; gap: 6px; }
  .nav-link { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; text-decoration: none; color: var(--slate); transition: all 0.18s; }
  .nav-link:hover { color: var(--white); background: var(--glass); }
  .nav-link.cta { background: var(--teal); color: var(--navy); font-weight: 700; }
  .nav-link.cta:hover { background: #00B492; }

  /* LAYOUT */
  .wrapper { max-width: 860px; margin: 0 auto; padding: 60px 24px 100px; }

  /* HERO */
  .readme-hero {
    background: linear-gradient(130deg, #0D1627 0%, #0f1f3d 100%);
    border: 1px solid var(--border);
    border-radius: 24px; padding: 52px 48px; margin-bottom: 48px;
    position: relative; overflow: hidden;
  }
  .readme-hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,170,0.12), transparent 70%); pointer-events: none; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,212,170,0.1); border: 1px solid rgba(0,212,170,0.2); border-radius: 99px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: var(--teal); margin-bottom: 20px; }
  .hero-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 42px; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px; }
  .hero-title span { color: var(--teal); }
  .hero-sub { font-size: 15px; color: var(--slate); max-width: 520px; line-height: 1.8; margin-bottom: 28px; }
  .hero-pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; border: 1px solid; }
  .pill-green { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.25); color: var(--green); }
  .pill-blue { background: rgba(79,142,247,0.1); border-color: rgba(79,142,247,0.25); color: var(--blue); }
  .pill-amber { background: rgba(245,166,35,0.1); border-color: rgba(245,166,35,0.25); color: var(--amber); }
  .pill-purple { background: rgba(124,58,237,0.1); border-color: rgba(124,58,237,0.25); color: var(--purple); }

  /* SECTIONS */
  .section { margin-bottom: 52px; }
  .section-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
  .section-sub { font-size: 14px; color: var(--slate); margin-bottom: 24px; }
  .divider { height: 1px; background: var(--border); margin-bottom: 24px; }

  /* FILE TREE */
  .file-tree {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    padding: 24px 28px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
    line-height: 2;
  }
  .ft-folder { color: var(--amber); font-weight: 600; }
  .ft-file { color: var(--white); }
  .ft-file a { color: var(--teal); text-decoration: none; font-weight: 600; }
  .ft-file a:hover { text-decoration: underline; }
  .ft-comment { color: var(--slate); }
  .ft-indent { padding-left: 24px; }
  .ft-required { color: var(--red); font-size: 11px; vertical-align: middle; margin-left: 4px; }

  /* STEPS */
  .steps { display: flex; flex-direction: column; gap: 16px; }
  .step { display: flex; gap: 20px; align-items: flex-start; }
  .step-num { width: 36px; height: 36px; border-radius: 50%; background: rgba(0,212,170,0.12); border: 1px solid rgba(0,212,170,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 14px; color: var(--teal); flex-shrink: 0; margin-top: 2px; }
  .step-body { flex: 1; }
  .step-title { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 5px; }
  .step-desc { font-size: 13px; color: var(--slate); line-height: 1.7; }
  .step-desc code { background: rgba(255,255,255,0.06); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--teal); }

  /* CODE BLOCK */
  .code-block {
    background: #0D1117; border: 1px solid var(--border); border-radius: 12px;
    padding: 20px 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
    line-height: 1.9; overflow-x: auto; position: relative; margin-top: 12px;
  }
  .code-block .comment { color: #6e7681; }
  .code-block .keyword { color: #ff7b72; }
  .code-block .string { color: #a5d6ff; }
  .code-block .fn { color: var(--teal); }
  .copy-btn {
    position: absolute; top: 12px; right: 12px;
    background: var(--glass); border: 1px solid var(--border); border-radius: 7px;
    padding: 5px 12px; font-size: 11px; font-weight: 600; color: var(--slate);
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.18s;
  }
  .copy-btn:hover { color: var(--white); background: rgba(255,255,255,0.08); }

  /* PAGE CARDS */
  .page-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .page-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px;
    padding: 18px 20px; text-decoration: none; display: block; transition: all 0.2s;
  }
  .page-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.14); }
  .pc-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .pc-icon { font-size: 20px; }
  .pc-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px; }
  .pc-file { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--teal); margin-bottom: 6px; }
  .pc-desc { font-size: 12px; color: var(--slate); line-height: 1.6; }

  /* DATA FLOW */
  .flow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .flow-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .flow-key { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--teal); font-weight: 600; margin-bottom: 6px; }
  .flow-desc { font-size: 12px; color: var(--slate); line-height: 1.6; }

  /* FEATURE TABLE */
  .feature-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .feature-table th { text-align: left; padding: 10px 14px; background: rgba(255,255,255,0.04); color: var(--slate); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .feature-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); }
  .feature-table tr:last-child td { border-bottom: none; }
  .feature-table tr:hover td { background: rgba(255,255,255,0.02); }
  .badge { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge-green { background: rgba(34,197,94,0.12); color: var(--green); }
  .badge-amber { background: rgba(245,166,35,0.12); color: var(--amber); }
  .badge-blue { background: rgba(79,142,247,0.12); color: var(--blue); }

  /* ALERT */
  .alert { border-radius: 12px; padding: 16px 20px; font-size: 13px; line-height: 1.7; margin-top: 16px; display: flex; gap: 12px; }
  .alert-teal { background: rgba(0,212,170,0.07); border: 1px solid rgba(0,212,170,0.2); }
  .alert-amber { background: rgba(245,166,35,0.07); border: 1px solid rgba(245,166,35,0.2); }
  .alert-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .alert-body strong { color: var(--white); }
  .alert-body { color: var(--slate); }

  /* LAUNCH BUTTON */
  .launch-wrap { text-align: center; padding: 48px 0 24px; }
  .launch-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--teal); color: var(--navy); border: none;
    border-radius: 14px; padding: 18px 40px;
    font-family: 'Sora', sans-serif; font-weight: 800; font-size: 17px;
    text-decoration: none; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 8px 32px rgba(0,212,170,0.3);
  }
  .launch-btn:hover { background: #00B492; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,212,170,0.4); }
  .launch-sub { font-size: 13px; color: var(--slate); margin-top: 14px; }

  @media(max-width:640px) {
    .hero-title { font-size: 28px; }
    .page-grid, .flow-grid { grid-template-columns: 1fr; }
    .readme-hero { padding: 32px 24px; }
    .wrapper { padding: 32px 16px 80px; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav class="top-nav">
  <a href="login.html" class="nav-brand">
    <div class="logo-ring">N</div>
    <div class="brand-name"><em>Nutri</em>Track</div>
  </a>
  <div class="nav-links">
    <a href="#setup" class="nav-link">Setup</a>
    <a href="#pages" class="nav-link">Pages</a>
    <a href="#data" class="nav-link">Data</a>
    <a href="#features" class="nav-link">Features</a>
    <a href="login.html" class="nav-link cta">Launch App →</a>
  </div>
</nav>

<div class="wrapper">

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
