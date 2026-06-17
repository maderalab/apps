# 🛠️ Tools

A small, **phone-first** collection of utilities (designed for iPhone / phones in portrait, not iPad). English UI, no build step.

## Structure (modular — one folder per tool)

```
Tools/
├── index.html        # launcher: links to each tool
├── styles.css        # launcher styles
├── calculator/       # Tool 1 — self-contained
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── tennis/           # Tool 2 — React scorer
│   ├── tennis-scorer.jsx   # SOURCE (the core module)
│   ├── tennis-scorer.js    # compiled from the .jsx (loaded by the page)
│   ├── icons.js            # inline-SVG shims for the lucide icons used
│   ├── index.html          # entry point — mounts the React component
│   ├── styles.css
│   └── vendor/             # React + ReactDOM (UMD, bundled locally)
└── health/           # Tool 3 — morning check-in tracker
    ├── index.html
    ├── styles.css
    └── script.js
```

Each tool is a **standalone page** in its own sub-folder. The launcher (`Tools/index.html`) just links to `calculator/index.html`, `tennis/index.html`, etc. To add / replace a tool, drop a self-contained page into its folder — keep `index.html` as the entry, and a back link to `../index.html` so the launcher flow stays intact.

## Tools

- 🧮 **Calculator** — `+ − × ÷` and **`%`** (modulo / remainder); `AC`, `⌫`, `.`, `=`. Chained left-to-right like a phone calculator. Keyboard works on desktop (`digits . + - * / %`, `Enter`/`=`, `Backspace`, `Esc`).
- 🎾 **Tennis Scoreboard** — a React app (`tennis-scorer.jsx`). Choose who serves first, then score live with serve-side (Deuce/Ad court) and change-of-ends prompts. Runs with no build step — React/ReactDOM are bundled in `tennis/vendor/`, the icons are shimmed in `icons.js`, and the JSX is pre-compiled to `tennis-scorer.js`.
  - **Match**: 1 Set · Best of 3 · Best of 5
  - **Set format**: Regular 6 · Advantage Set (no tiebreak) · Pro Set (8) · Fast4 · Super Tiebreak (10)
  - **Game scoring**: AD · No-AD
  - **Deciding set**: Standard · 10-pt tiebreak at 6–6 (modern Grand Slam / pro) · Match Tiebreak (10) (junior "third-set TB10" / doubles)
- ❤️ **Health** — a morning check-in log (vanilla JS, no build). Record **blood pressure** (systolic/diastolic) and **weight** per day, enter your **height** (defaults to the last recorded value, so it carries forward day to day), and it computes **BMI** for every entry. Weight can be entered/shown in **kg or lb** (toggle next to the field — switching converts what you've typed and all stored values display in the chosen unit). BP and BMI are auto-classified (BP per ACC/AHA; BMI Underweight→Obese). **Multiple profiles** (e.g. family members) are supported via the header switcher — each profile keeps its own check-ins and unit preference, stored separately. **30-day trend charts** (inline SVG sparklines) plot blood pressure, weight and BMI. Data can be **exported / imported as CSV** (`date,systolic,diastolic,weight_<unit>,height_cm`) — import merges by date (same-date rows overwrite). Entries are keyed by date (one per day — re-saving a date edits it) and persisted in `localStorage`, so data stays on the device across reloads and restarts until cleared. Latest values show as a snapshot; full history below with per-day delete and a "Clear all".

#### Common formats it covers

| Format | Configure as |
|---|---|
| Red / Orange ball (1 set to 4, no-ad) | 1 Set + **Fast4** |
| Green ball (1 set to 6) | 1 Set + **Regular 6** |
| High-school 8-game pro set | 1 Set + **Pro Set** |
| UTR / USTA junior · adult league (3rd-set TB10) | Best of 3 + Regular 6 + Deciding = **Match Tiebreak (10)** |
| ATP / WTA (best of 3) | Best of 3 + **Regular 6** |
| Men's Grand Slam, modern deciding set | Best of 5 + Regular 6 + Deciding = **10-pt TB at 6–6** |

> Not covered: team events with multiple matches / doubles aggregation (e.g. JTT) — this scores a single singles match.

### Editing the tennis scorer

`tennis-scorer.jsx` is the source of truth. After editing it, recompile to `tennis-scorer.js` (JSX → plain JS), e.g. with Babel standalone:

```bash
cd Tools/tennis
curl -sL https://unpkg.com/@babel/standalone/babel.min.js -o /tmp/babel.min.js
node -e 'const fs=require("fs"),B=require("/tmp/babel.min.js");let s=fs.readFileSync("tennis-scorer.jsx","utf8").replace(/^\s*import\s.*?;?\s*$/gm,"").replace("export default function TennisScorer","function TennisScorer");s="const {useState}=React;\n"+s;fs.writeFileSync("tennis-scorer.js","/* AUTO-GENERATED from tennis-scorer.jsx */\n"+B.transform(s,{presets:["react"],compact:false}).code)'
```

(The 🎾 header font comes from Google Fonts; offline it falls back to the system sans-serif.)

## Run

Open `index.html` in a mobile browser (or any browser). No server needed — tool links point at explicit `index.html` files so they work from `file://` too.
