# Memory Card Game
Game of thrones characters inspired full-stack memory game with user accounts, persistent score history and a dynamic XP/rank system.

🎮 **Live demo:** [card-game.ianadev.com](https://card-game.ianadev.com)

(src/assets/game-prewatch.gif)
---

## The game

The game essentially is a hybrid between "Memory Loop" and "Shuffle table" where the challenge isn't remembering where the cards were, but more about keeping track of which card you've already interacted with while the board constantly shifts.

You can test your memory with 3 different levels of difficulty.

Three difficulty levels, each with its own board size and scoring multiplier.

The card set is inspired by Game of Thrones characters.

---

## Features

- **Accounts** — sign up, email verification, login, profile with custom avatar
- **Score history** — every game played is stored: score, difficulty, date
- **XP and ranks** — computed from the full game history rather than stored as a running total
- **Achievements** — unlocked based on gameplay stats
- **Animated UI** — card flip animations, loading screens

---

## Tech stack

**Frontend** — React, TypeScript, Vite, Framer Motion (animations), Lottie (loading), multi-context state management

**Backend** — Node.js, Express, REST API, JWT authentication, Resend (transactional email)

**Data** — PostgreSQL (Supabase), Supabase Storage for user avatars

**Infrastructure** — Netlify (frontend), Render (backend), custom domain via OVH

---

## Technical decisions

**XP is computed, not stored.** Ranks and XP totals are derived from the game history table on each request rather than kept as a counter on the user row. This costs a little more per query, but it guarantees consistency: if the scoring formula changes, the entire history stays correct without a data migration, and there's no way for a user's XP to drift out of sync with their actual games.

**Stateless authentication.** The frontend and API are deployed separately, so authentication uses JWTs sent in the `Authorization` header rather than server-side sessions — no shared session store needed between services. Email verification is handled with a separate short-lived token.

**Database migration mid-project.** The project started on Neon and moved to Supabase to consolidate the database and file storage for avatars in one place. Migrating a live schema turned out to be an education in itself.

---

## Running locally

```bash
# clone the repo
git clone https://github.com/<username>/<repo>.git
cd <repo>

# frontend
cd client
npm install
npm run dev

# backend (in a second terminal)
cd server
npm install
npm run dev
```

**Environment variables** — copy `.env.example` to `.env` in the `server` directory:

```
DATABASE_URL=          # PostgreSQL connection string
JWT_SECRET=            # secret used to sign tokens
RESEND_API_KEY=        # transactional email
SUPABASE_URL=          # avatar storage
SUPABASE_KEY=
CLIENT_URL=            # frontend origin, for CORS and email links
```

---

## Roadmap

- [ ] AI-generated card themes — pick any theme, an LLM generates the card set, results cached in PostgreSQL
- [ ] Global leaderboard
- [ ] Automated tests on the authentication routes

---

## Notes

Character images are used for a non-commercial personal portfolio project.

---

Built by [Iana Averianova](https://www.linkedin.com/in/iana-averianova/) — full-stack developer (TypeScript, React, Node.js, PostgreSQL).