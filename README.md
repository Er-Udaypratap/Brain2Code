# Brain2Code

Coding challenge platform for B.Voc (Software Development) Department, SRIMT.
No custom backend — Supabase for data, Judge0 (RapidAPI) for compiling/running
C, Java and Python code directly from the browser.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Supabase**
   - Open your existing TechBook4u Supabase project (same URL/anon key, reused
     here since TechBook4u isn't in active use).
   - Go to SQL Editor → run `supabase_schema.sql` from this repo. It only adds
     two new tables (`students`, `submissions`) and does not touch anything
     from TechBook4u.

3. **Judge0 (code execution)**
   - Sign up free at https://rapidapi.com/judge0-official/api/judge0-ce
   - Subscribe to the free tier (enough for a small internal event).
   - Copy your RapidAPI key.

4. **Environment variables**
   - Copy `.env.example` to `.env`
   - Fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_JUDGE0_KEY`.

5. **Run locally**
   ```
   npm run dev
   ```

6. **Deploy**
   - Push to GitHub, import into Vercel or Netlify, add the same env vars in
     the hosting dashboard's environment settings.

## How it works

- **Signup**: name, father's name, branch, mobile number, and a language
  choice (C / Java / Python) — the language is fixed for both rounds.
- **Login**: father's name + mobile number.
- **Round 1**: 3 questions, 20-minute timer, unlocks Round 2 once any 2 are
  solved (Judge0 checks actual code output against test cases).
- **Round 2**: 2 questions, 10-minute timer, requires solving any 1.
- **Security**: copy/paste, right-click and common shortcuts are blocked
  inside the exam; tab-switching is detected and logged as a violation.
  Note: browsers cannot fully prevent OS-level screenshots — this is a
  deterrent, not a guarantee.

## Question bank

Edit `src/data/questions.js` to change problems, test cases, or starter code
per language. Each question is judged purely by stdin → stdout matching, so
the same problem works across all three languages.
