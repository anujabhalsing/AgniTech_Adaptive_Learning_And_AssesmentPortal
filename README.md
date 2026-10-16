# ⚡ SkillTrace AI

**Adaptive Learning & Gamified Coding Assessment Platform**

> Learn at your pace. Grow with every attempt.

---

## What is SkillTrace AI?

SkillTrace AI is a fully functional, browser-based adaptive learning platform for programming. It works with no installation and no server — just open `index.html` in any modern browser.

### Key Features

- **8 languages / topic areas** — Python, Java, C++, C, JavaScript, HTML & CSS, SQL, DSA
- **35+ structured topics** with difficulty levels and prerequisites
- **Guided lessons** with code examples, syntax highlighting, and "Try It Yourself" exercises (Python, Java, C++ — full lesson content)
- **Quiz engine** — Multiple choice, output prediction, find-the-bug, and fill-in-the-blank
- **Progressive hint ladder** — 4 levels: Nudge → Concept → Pseudocode → Solution
- **Adaptive mastery tracking** — adjusts quiz recommendations based on performance
- **Voice feedback** — browser's built-in Web Speech API (no paid API required)
- **Gamification** — XP, streaks, daily goals, badges, achievements
- **Revision mode** — spaced-repetition scheduling for weak concepts
- **Concept map** — visual progress path per language
- **Dark mode + reduced motion**
- **Fully responsive** — desktop, tablet, mobile

---

## Quick Start — No Installation Required

### Option 1: Open directly (works for viewing, fonts load from CDN)
1. Download or clone this folder.
2. Double-click **`index.html`**.
3. The app opens immediately in your browser.

> **Note:** Clipboard copy (`📋 Copy` button on code blocks) requires a secure context (HTTPS or localhost). If opening as a file directly, clipboard may be blocked by the browser — this is a browser security restriction, not an app bug. Everything else works.

### Option 2: Local web server (recommended — enables clipboard and full feature access)

**If you have Python installed:**
```bash
cd "SkillTrace AI"

# Python 3
python -m http.server 5500
# then open: http://localhost:5500
```

**If you have Node.js:**
```bash
npx serve "SkillTrace AI"
```

**If you have VS Code:** Install the "Live Server" extension and click "Go Live".

---

## Data Storage — Important

> ⚠️ **All progress is stored in your browser's localStorage only.**
>
> - Data key: `skilltrace_v1`
> - No data is sent to any server.
> - Progress does **not** automatically sync across different browsers, devices, or incognito windows.
> - Students can reset all data from **Settings → Reset All Progress**.

---

## Code Execution — Demo Mode

> ⚠️ **The "Try It Yourself" code editor is in Demo Mode.**
>
> Code is NOT executed on any server. The editor lets students write and edit code with syntax highlighting, and view the pre-written solution. To enable live code execution, connect a trusted sandboxed execution service such as [Judge0](https://judge0.com/) — see `.env.example` for configuration variables.

---

## Project Structure

```
SkillTrace AI/
├── index.html              ← Entry point — open this to run the app
├── src/
│   ├── styles.css          ← All styles (responsive, light/dark mode)
│   ├── app.js              ← Main SPA logic (navigation, quiz, mastery, UI)
│   ├── store.js            ← localStorage state management + mastery engine
│   └── voice.js            ← Web Speech API voice feedback module
├── data/
│   ├── languages.js        ← 8 language definitions
│   ├── topics.js           ← 35+ topic definitions (all languages)
│   ├── lessons.js          ← Full lesson content (Python 5, Java 3, C++ 2)
│   ├── questions.js        ← 45+ quiz questions with verified answer keys
│   └── hints.js            ← Progressive hint ladders for selected questions
├── assets/                 ← Place any custom images/icons here
├── .env.example            ← Environment variable template for optional APIs
└── README.md               ← This file
```

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Navigation (all pages) | ✅ Working | All links functional |
| Language + topic selection | ✅ Working | 8 languages, 35+ topics |
| Lesson pages (Python, Java, C++) | ✅ Full content | 10 complete lessons |
| Lesson pages (other languages) | ⚠️ Partial | Quiz available, full lesson "coming soon" |
| Quiz engine | ✅ Working | MCQ, output, bug, fill-in |
| Correct/incorrect feedback | ✅ Working | Colour, explanation, XP award |
| Voice feedback | ✅ Working | Web Speech API; toggle in quiz + settings |
| Progressive hint ladder | ✅ Working | Up to 4 levels per question |
| XP tracking | ✅ Working | Per-question, saved to localStorage |
| Mastery score | ✅ Working | Updates on each answer; adaptive |
| Streaks + daily goal | ✅ Working | Resets daily |
| Achievements / badges | ✅ Working | 11 badges, popup + confetti |
| Revision mode | ✅ Working | Due topics, mistakes, weak concepts |
| Progress page + concept map | ✅ Working | Mastery bars, quiz history |
| Search | ✅ Working | Searches all topics live |
| Explore filters | ✅ Working | By level and name |
| Dark mode | ✅ Working | Persisted in settings |
| Responsive layout | ✅ Working | Desktop, tablet, mobile |
| Code editor (Try It) | ⚠️ Demo only | No execution — labelled clearly |
| AI features (OpenAI) | 🔧 Optional | Needs API key in .env |
| Multi-device sync | 🔧 Optional | Needs Supabase in .env |
| Live code execution | 🔧 Optional | Needs Judge0 in .env |

---

## Adding Content

All content is separated from the UI in `/data/` — no code changes needed to add topics.

### Add a new topic
Edit `data/topics.js` — add an object to the `TOPICS` array.

### Add lesson content
Edit `data/lessons.js` — add an entry keyed by the topic ID.

### Add quiz questions
Edit `data/questions.js` — add to the `QUESTIONS` array.

### Add hints
Edit `data/hints.js` — add an entry keyed by the question ID.

---

## Deployment (Getting a Public URL)

### Netlify — Free, fastest (recommended)

1. Go to [netlify.com](https://netlify.com) → sign up for free.
2. Click **"Add new site"** → **"Deploy manually"**.
3. Drag and drop the entire `SkillTrace AI` **folder** onto the deploy area.
4. Netlify gives you a live HTTPS URL instantly (e.g. `https://random-name.netlify.app`).
5. (Optional) Click **"Site settings" → "Change site name"** to pick a custom subdomain.
6. Share the URL — it works on any device with a modern browser.

**To verify deployment:**
- Open the URL on a different device (phone or another computer).
- Navigate through Home → Explore → Python → Variables → Take Quiz.
- Answer a question — confirm feedback and XP appear.
- Check the URL starts with `https://`.

### Vercel — Alternative free option

1. Go to [vercel.com](https://vercel.com) → sign up.
2. Click **"Add New Project"** → upload the folder or connect a GitHub repo.
3. No build configuration needed — it's static HTML.
4. Click Deploy.

### GitHub Pages — Free with a GitHub account

1. Create a GitHub account and a new repository.
2. Upload all project files to the repository.
3. Go to **Settings → Pages → Source** → select `main` branch → `/root`.
4. Your site is live at `https://yourusername.github.io/repo-name`.

### Any static host
Since the app is plain HTML/CSS/JS, it deploys to any static host:
Cloudflare Pages, Firebase Hosting, Render, Surge, GitHub Pages, etc.

---

## Optional Integrations (Not Required to Run)

Copy `.env.example` to `.env` and fill in your values. These are only needed for advanced features:

| Variable | Feature |
|----------|---------|
| `VITE_OPENAI_API_KEY` | AI-powered hints, explanations, viva questions |
| `VITE_JUDGE0_API_KEY` | Live code execution in the editor |
| `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | Multi-device account sync |

**Security note:** Never put real API keys directly in frontend JavaScript files. For a production deployment with these features, use a backend proxy or serverless function.

---

## Answer Key Verification

All 45+ quiz questions have been reviewed. The following answer keys have been specifically verified:

| Question | Description | Correct Answer | Verified |
|----------|-------------|----------------|---------|
| q_pv_2 | Python: print(5 + 2) | 7 | ✅ |
| q_pc_1 | Python: if 10 > 5 → "Big" | "Big" | ✅ |
| q_pl_1 | Python: range(3) iterations | 3 times | ✅ |
| q_pl_2 | Python: range(1,4) total | 6 | ✅ |
| q_jv_3 | Java: int→double widening | 10.0 | ✅ |
| q_cv_1 | C++: integer division 7/2 | 3 | ✅ |
| q_jsv_2 | JS: == vs === coercion | true then false | ✅ |

---

## Content Notice

> All lessons and quiz questions are **[AI-Generated]** educational content, labelled as such in the application. They have been reviewed for accuracy but may contain errors. Do not rely on them as a sole source for critical examinations.

---

## Known Limitations

1. **Code editor is demo-only** — code is not executed. Clearly labelled in the UI.
2. **localStorage only** — progress does not sync across devices without Supabase.
3. **Lessons for JavaScript, HTML/CSS, SQL, C, DSA** — quiz questions are available; full structured lesson content is marked "coming soon". Topics are ready to be expanded in `data/lessons.js`.
4. **Clipboard copy** requires HTTPS or localhost — may not work when opening `index.html` as a local file in some browsers.
5. **Voice synthesis quality** depends on the browser and OS — some browsers have limited English voices.

---

*Built for the Adaptive Learning & Assessment Portal hackathon challenge.*
