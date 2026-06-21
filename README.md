# 📄 README — Setup Guide v1.0

# Get NutriTrack running in 60 seconds

A fully client-side nutrition & body tracking app — no server, no database, no install. Just drop 7 HTML files in one folder and open your browser.

✅ No server needed
✅ Works offline
✅ Data stays on your device
✅ 6 fully connected pages

---

# 📁 File Structure

All files must live in the **same folder**. The names below must match exactly — they are hardcoded in the navigation links.

```text
📁 nutritrack/  <-- your folder name (anything works)
├── login.html                ← Start here
├── dashboard.html            ← Main hero / home
├── food-log.html             ← Log meals & nutrients
├── bmi-calculator.html       ← BMI calculator
├── macro-calculator.html     ← TDEE & macros
├── download-report.html      ← Export data
└── README.md                 ← This file
```

> ⚠️ **File names are case-sensitive.**
> Do not rename the files — all sidebar navigation links reference these exact filenames.
> If you rename one, update every `<a href="...">` that points to it.

---

# 🚀 How to Run

Three ways to open the app — pick whatever's easiest for you.

---

## 1️⃣ Double-click method (simplest)

Download all 7 files into one folder.

Double-click:

```text
login.html
```

It opens in your default browser. Done.
All pages and navigation will work immediately.

---

## 2️⃣ VS Code Live Server (recommended for development)

Install the **Live Server** extension in VS Code.

Right-click `login.html` → **Open with Live Server**

Auto-reloads on save. Great for customizing the app.

### Install extension

```bash
ext install ritwickdey.LiveServer
```

### Or install via command line

```bash
code --install-extension ritwickdey.LiveServer
```

---

## 3️⃣ Python / Node local server

Open your terminal, `cd` into the folder, and run one of these:

### Python 3 (built-in — no install needed)

```bash
python3 -m http.server 8080
```

### Node.js (if you have Node installed)

```bash
npx serve .
```

Then open:

```text
http://localhost:8080/login.html
```

---

## 4️⃣ Deploy to the web (optional)

Drop the folder into:

* GitHub Pages
* Netlify
* Vercel

for free hosting.

No build step needed — just upload the HTML files as-is.

Data stays in each user's browser `localStorage` (not shared).

---

# 📄 Pages Overview

Every page shares the same sidebar navigation and color system.

---

## 🔐 Login & Register

**File:** `login.html`

* Sign in / create account
* Stores credentials in localStorage
* "Remember me" auto-fills email
* Social login buttons simulate auth

---

## 🏠 Dashboard

**File:** `dashboard.html`

* Today's calorie ring
* Macro progress bars
* Recent meals
* Weight history chart
* Quick navigation cards
* Day streak tracker

---

## 🥗 Food Log

**File:** `food-log.html`

* Log meals by meal type
* Search 18 built-in foods
* Auto-fills macros
* Manual nutrition entry
* Edit/delete entries
* Water tracker
* Date navigation

---

## ⚖️ BMI Calculator

**File:** `bmi-calculator.html`

* Metric & imperial units
* Animated gauge needle
* Healthy weight range
* Ideal weight (Devine formula)
* Body fat estimate
* Saves BMI history

---

## 📊 Macro Calculator

**File:** `macro-calculator.html`

* Mifflin-St Jeor TDEE formula
* 3 goals × 5 activity levels
* Animated donut chart
* Custom macro sliders
* Per-meal breakdown
* Save goals feature

---

## 📥 Download Report

**File:** `download-report.html`

* CSV export (Excel-ready)
* JSON export
* Printable HTML report
* Date range picker
* Live preview table
* Calorie trend chart

---

# 💾 Data Storage

Everything is saved in your browser's `localStorage`.

No server. No backend account system.

| Key              | Purpose               |
| ---------------- | --------------------- |
| `nt_session`     | Active login session  |
| `nt_users`       | Registered accounts   |
| `nt_food_log`    | Daily food entries    |
| `nt_weights`     | Weight history        |
| `nt_bmi_history` | BMI records           |
| `nt_goals`       | Daily nutrition goals |

---

## 💡 Data Persistence

`localStorage` survives browser restarts.

To reset data:

* Use **Download Report → Clear All Data**
* OR open DevTools → Application → Local Storage

---

# ✅ Features Checklist

Everything included out of the box.

| Feature                     | Page                    | Status               |
| --------------------------- | ----------------------- | -------------------- |
| User registration & login   | `login.html`            | ✅ Done               |
| Session persistence         | `login.html`            | ✅ Done               |
| Daily calorie ring          | `dashboard.html`        | ✅ Done               |
| Macro progress bars         | `dashboard.html`        | ✅ Done               |
| Weight history chart        | `dashboard.html`        | ✅ Done               |
| Day streak tracker          | `dashboard.html`        | ✅ Done               |
| 18-food searchable database | `food-log.html`         | ✅ Done               |
| Auto-scale macros           | `food-log.html`         | ✅ Done               |
| 4 meal types                | `food-log.html`         | ✅ Done               |
| 12-field nutrition entry    | `food-log.html`         | ✅ Done               |
| Edit/delete entries         | `food-log.html`         | ✅ Done               |
| Water intake tracker        | `food-log.html`         | ✅ Done               |
| Date navigation             | `food-log.html`         | ✅ Done               |
| BMI calculator              | `bmi-calculator.html`   | ✅ Done               |
| Animated BMI gauge          | `bmi-calculator.html`   | ✅ Done               |
| Body fat estimate           | `bmi-calculator.html`   | ✅ Done               |
| BMI history tracking        | `bmi-calculator.html`   | ✅ Done               |
| TDEE calculator             | `macro-calculator.html` | ✅ Done               |
| 5 activity levels           | `macro-calculator.html` | ✅ Done               |
| Animated donut chart        | `macro-calculator.html` | ✅ Done               |
| Custom macro sliders        | `macro-calculator.html` | ✅ Done               |
| Per-meal breakdown          | `macro-calculator.html` | ✅ Done               |
| Save goals                  | `macro-calculator.html` | ✅ Done               |
| CSV export                  | `download-report.html`  | ✅ Done               |
| JSON export                 | `download-report.html`  | ✅ Done               |
| Printable HTML report       | `download-report.html`  | ✅ Done               |
| Date range filter           | `download-report.html`  | ✅ Done               |
| Calorie trend chart         | `download-report.html`  | ✅ Done               |
| Clear all data              | `download-report.html`  | ✅ Done               |
| Responsive layout           | All pages               | ✅ Done               |
| Google Fonts (Sora + Inter) | All pages               | 🌐 Requires internet |
| Expand food database        | `food-log.html`         | ⚙️ Customizable      |

---

# 🎨 Customization Tips

Quick ways to make NutriTrack your own.

---

## → Change the color theme

Every page uses CSS custom properties.

Edit:

```css
:root{
  --teal:#14b8a6;
  --amber:#f59e0b;
  --purple:#8b5cf6;
}
```

to instantly retheme the app.

---

## → Add more foods to the database

Inside `food-log.html`, find:

```js
const FOOD_DB = [...]
```

Each entry follows:

```js
{
  name,
  per100:{
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    sodium,
    vitc,
    calcium,
    iron
  }
}
```

---

## → Change default calorie goal

Default goal:

```text
2000 kcal
```

Find:

```js
localStorage.getItem('nt_goals') || '{"calories":2000,...}'
```

and update the defaults.

You can also set goals directly from the Macro Calculator UI.

---

## → Offline fonts (no internet dependency)

Replace Google Fonts `<link>` tags with locally downloaded fonts.

Recommended fonts:

* Sora
* Inter

Use `@font-face` in a shared CSS file.

---

# 🚀 Launch NutriTrack

Open:

```text
login.html
```

Your starting point for the application.
