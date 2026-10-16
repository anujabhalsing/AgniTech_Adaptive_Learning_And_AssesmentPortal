# SkillTrace AI v2.0 🚀

**Adaptive Learning & Gamified Coding Assessment Platform**

> _Learn at your pace. Grow with every attempt._

A professional, full-featured edtech web application. Built for the Kurukshetra Hackathon.

---

## ✨ What's Included

| Feature | Status | Notes |
|---|---|---|
| Student Auth (register / login / verify email) | ✅ Full | Requires Supabase config |
| Guest demo mode | ✅ Full | Works without any config |
| Forgot password + email reset | ✅ Full | Requires Supabase |
| Protected routes | ✅ Full | Redirects to /auth if not logged in |
| Initial diagnostic assessment | ✅ Full | Answers hidden until after submit |
| 7 languages, 35 topics | ✅ Full | Python, Java, C++, JS, HTML/CSS, SQL, DSA |
| Guided lessons with code examples | ✅ Full | 7 detailed lessons with Hinglish variants |
| Adaptive quiz engine | ✅ Full | Difficulty adjusts based on streaks and mistakes |
| Progressive hint ladder (4 levels) | ✅ Full | Tracks hint usage in mastery score |
| Coding editor (Monaco) | ✅ Full | Beautiful syntax highlighting |
| Code execution via Judge0 | ✅ Demo → Real | Set `VITE_JUDGE0_API_KEY` to enable |
| Partial credit scoring | ✅ Full | Public + hidden test breakdown |
| Logic analysis section | ✅ Full | Labelled as estimate |
| Revision cards (sticky-note style) | ✅ Full | Hinglish variants, bookmarks, filter |
| English / Hinglish mode | ✅ Full | Toggle in homepage and settings |
| Daily goals with animated journey | ✅ Full | Emoji learner on progress path |
| Leaderboard | ✅ Demo → Real | Demo data when Supabase not configured |
| XP, streaks, levels, 15 badges | ✅ Full | Persisted in localStorage / Supabase |
| Progress dashboard + mastery map | ✅ Full | Per-topic, per-language breakdown |
| Voice feedback (Web Speech API) | ✅ Full | Toggle in settings and header |
| Dark mode | ✅ Full | CSS variables, persisted |
| Responsive layout | ✅ Full | Mobile, tablet, desktop |
| Keyboard accessibility | ✅ Full | Focus indicators, ARIA labels |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+

```bash
npm install
npm run dev
# → http://localhost:5173
```

Click **Continue as Guest (Demo)** on the login screen to explore the full app without any setup.

---

## 🔐 Enable Full Authentication (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. In your Supabase project → SQL Editor → paste and run `supabase-schema.sql`
4. In Supabase → Auth → Email → enable "Confirm email"
5. Restart the dev server

---

## ⚙️ Enable Real Code Execution (Judge0)

1. Sign up at [RapidAPI — Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce) (free tier available)
2. Subscribe and copy your RapidAPI key
3. Add to `.env`:
   ```
   VITE_JUDGE0_API_KEY=your_rapidapi_key
   ```
4. Supported languages: Python, Java, C++, JavaScript, C

> **Security note:** The Judge0 key is used client-side (standard for RapidAPI public APIs). For production with high traffic, proxy through a Netlify/Vercel edge function to keep the key server-only.

---

## 🌐 Deployment

### Vercel (recommended — free)
```bash
# Push to GitHub, then:
vercel deploy
# Set environment variables in Vercel dashboard under Project → Settings → Environment Variables
```

### Netlify (drag-and-drop)
```bash
npm run build
# Drag the dist/ folder to https://app.netlify.com/drop
```

Both platforms handle the SPA routing via `vercel.json` / `netlify.toml` already included.

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.ts        # Supabase client (graceful no-op when unconfigured)
│   └── judge0.ts          # Judge0 API + demo mode fallback
├── context/
│   ├── AppContext.tsx      # Global app state (XP, progress, mastery, adaptive difficulty)
│   └── AuthContext.tsx     # Auth state (Supabase + guest mode)
├── data/
│   ├── languages.ts        # 7 language definitions
│   ├── topics.ts           # 35 topics with prerequisites
│   ├── lessons.ts          # 7 detailed lessons (English + Hinglish)
│   ├── questions.ts        # ~25 quiz questions with hints
│   ├── achievements.ts     # 15 badges
│   ├── diagnostic.ts       # Diagnostic assessment questions
│   ├── revisionCards.ts    # 18 sticky-note revision cards
│   └── codingChallenges.ts # 4 coding challenges with test cases
├── pages/
│   ├── auth/AuthPage.tsx   # Login / register / forgot / verify
│   ├── HomePage.tsx        # Dashboard with animated daily goals journey
│   ├── ExplorePage.tsx     # Searchable language/topic browser
│   ├── LearnPage.tsx       # Lesson + quiz + results flow
│   ├── PracticePage.tsx    # Freeform quiz with filters
│   ├── RevisionCardsPage.tsx # Sticky-note flashcards with Hinglish
│   ├── CodingPage.tsx      # Monaco editor + Judge0 execution
│   ├── DiagnosticPage.tsx  # Onboarding diagnostic (answers hidden)
│   ├── ProgressPage.tsx    # Mastery dashboard
│   ├── AchievementsPage.tsx # Badge gallery
│   ├── LeaderboardPage.tsx # XP ranking with privacy controls
│   └── SettingsPage.tsx    # Profile, theme, voice, goals
└── components/
    ├── Sidebar.tsx          # Nav with sign out
    ├── Header.tsx           # Search, voice, dark mode
    ├── QuizEngine.tsx       # Adaptive quiz with hints
    ├── QuizResults.tsx      # Score circle + XP + recommendations
    ├── LessonViewer.tsx     # Rendered lesson with Hinglish support
    └── CodeBlock.tsx        # Syntax-highlighted code display
```

---

## 🧪 Testing Checklist

| Test | Expected Result |
|---|---|
| Open app without .env config | Auth page shows "Demo Mode" warning; Guest button works |
| Click Continue as Guest | Lands on home dashboard with sample data |
| Navigate all 10 sidebar links | All pages load without errors |
| Select language → Start Lesson | Lesson content appears |
| Submit quiz answer (correct) | Green feedback + XP, voice speaks if enabled |
| Submit quiz answer (wrong) | Red feedback + explanation, hint button appears |
| Use all 4 hint levels | Each hint reveals progressively more |
| Complete a topic | +XP, topic marked complete, badge fires if first |
| Start diagnostic | Questions shown without difficulty badge, no answer feedback mid-test |
| Finish diagnostic | Recommended level and weak concepts shown (no answer key) |
| Open coding challenge | Monaco editor loads, starter code shown |
| Click Run (no Judge0 key) | Demo mode banner, simulated output |
| Submit coding (no Judge0 key) | Demo mode label on results, partial credit breakdown |
| Toggle Hinglish mode | Revision cards and lesson hint show Hinglish text |
| Toggle dark mode | Theme switches; persists on reload |
| Toggle voice | Spoken feedback fires/stops |
| Open leaderboard (no Supabase) | Demo placeholder data shown with "demo" label |
| Open Settings, change name | Saved on click; leaderboard name field visible |
| Responsive test (≤768px) | Sidebar hides; hamburger menu appears; no overflow |

---

## ⚠️ Known Limitations

1. **Leaderboard** shows demo data without Supabase. A real live leaderboard needs the database.
2. **Code execution** is demo-only without a Judge0 API key. The demo result is clearly labelled.
3. **Lessons** — only 7 of 35 topics have full lesson content. The rest show a "coming soon" fallback.
4. **Questions** — ~25 questions cover the first few topics. Remaining topics show an empty quiz fallback.
5. **Email verification** requires Supabase. Guest mode bypasses it.
6. **AI features** (re-explanation, AI viva) require an OpenAI key — not implemented in this version.
7. **Cross-device sync** requires Supabase. Without it, progress lives in `localStorage` only.
8. **Monaco editor** adds ~620 KB to the JS bundle. Lazy-loaded to avoid blocking initial render.

---

## 🏆 Hackathon

Built for **Kurukshetra Hackathon** — Problem Statement: Adaptive Learning and Assessment Portal.

_Made with ❤️ and a lot of learning._
