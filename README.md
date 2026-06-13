# 🌱 CleanUp Crew

A mobile-friendly web app for a sustainable community litter-cleanup ecosystem.
Volunteers find nearby cleanup hot spots, join admin-run events, log before/after
proof, earn rank + rewards, and accrue verified volunteer hours toward scholarships.

Built for a 3-day sustainability hackathon. Front-end first (React + Vite + Leaflet),
mock data persisted in `localStorage`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (opens automatically). For the best look, use your
browser's device toolbar / responsive mode and pick a phone (e.g. iPhone 12).

## Try the demo flow

1. **Sign in** — choose **Volunteer**, enable location, Get started.
2. **Home** — see your rank, points, progress bar, stats, and team leaderboard.
3. **Map** — tap a red/orange hot spot or a list card → slide-up modal → **Sign up**.
4. **Calendar** — your event appears; tap **Check in & log proof** → add Before/After
   photos → **Submit for review**. (Check-in is locked outside the event time window —
   anti-cheat.)
5. Log out, sign back in as **Admin**:
   - **Dashboard** — community impact + per-listing signups.
   - **Listings** — tap **+** to create a hot spot (photo, address, AI-estimated hours,
     date/time, capacity).
   - **Verify** — approve the volunteer's before/after photos → awards hours + points.
6. Back as the volunteer, **Profile → Download certificate** (PDF of verified hours).

## Features implemented

- Role-based volunteer + admin apps in one mobile shell with bottom tab nav
- Rank tiers → rewards, points, progress tracking dashboard
- Leaflet hot spot map (severity heat) + proximity-sorted listings (DoorDash-style)
- Slide-up listing modal → sign up
- Activities calendar with week strip
- Before/after photo capture, admin verification, hours/points awarding
- Time/date-boxed events + check-in window (anti-cheat) + admin-manned events
- AI-assisted hours estimate (heuristic)
- Volunteer hours certificate PDF download
- Team leaderboard

## Next (Day 2/3)

Swap `localStorage` for **Firebase Auth + Firestore + Storage** (see `IMPLEMENTATION_PLAN.md`).
