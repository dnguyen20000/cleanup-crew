# CleanUp Crew — Implementation Plan

A community-driven litter cleanup platform that turns one-time volunteers into a
consistent, rewarded, measurable movement. Volunteers find nearby cleanup
"hot spots," join admin-run events, log before/after proof, earn rank/rewards,
and accrue verified volunteer hours toward scholarships.

> **3-day hackathon scope. Front-end first. Keep it simple, prefer working over perfect.**

---

## 1. Tech Stack (locked)

| Concern | Choice | Why |
|---|---|---|
| Framework | **React + Vite** | Fastest dev loop, mobile-friendly web app, no app store |
| Styling | **CSS modules / plain CSS** (mobile-first) | A centered "phone frame" + bottom tab bar mimics the DoorDash UI |
| Routing | **react-router-dom** | Tab + stack navigation |
| Map | **Leaflet + OpenStreetMap** (`react-leaflet`) | Free, no API key, hot spots + listing pins |
| Auth | **Firebase Auth** (email + Google) | Drop-in sign-in |
| Data | **Firebase Firestore** | Real-time listings, events, sign-ups |
| Images | **Firebase Storage** (before/after pics) | Or mock with object URLs on Day 1 |
| State | React Context + hooks | No Redux needed for hackathon |
| Cert/PDF | `jspdf` | Client-side certificate download |
| Icons | `lucide-react` | Clean icon set like the screenshots |

**Mobile-friendly web app difficulty: LOW.** A `max-width: 480px` centered container
with a fixed bottom nav gives the native phone look. Works on desktop + phone browsers.

---

## 2. App Architecture

```
Two roles, one codebase:
  - Volunteer app  (default)
  - Admin app      (role flag on user profile)

Shell:
  [ Top header ]      (title + context action)
  [ Screen content ]  (scrollable)
  [ Bottom tab bar ]  (Home · Map · Calendar · Profile)   <- volunteer
                       (Dashboard · Listings · Profile)    <- admin
```

Role is read from the Firestore user doc (`role: "volunteer" | "admin"`) and
selects which tab bar + routes render.

---

## 3. Data Model (Firestore)

```
users/{uid}
  name, hometown, email, role,
  photoURL, rank, points, totalHours,
  homeLocation: { lat, lng }

listings/{listingId}        // a cleanup hot spot / event opportunity
  title, address,
  location: { lat, lng },
  photoURL,                 // hot spot photo (admin upload)
  estimatedHours,           // admin-set or AI-estimated
  severity: "low|med|high", // drives hot spot heat color
  eventDate, startTime, endTime,
  adminId,                  // event MUST be manned by an admin
  capacity, signupCount,
  status: "open|full|completed"

signups/{signupId}
  listingId, uid, status: "registered|checked_in|completed",
  checkInTime,
  beforePhotoURL, afterPhotoURL,
  hoursAwarded, pointsAwarded

teams/{teamId}              // stretch goal
  name, memberUids[], totalPoints
```

**Anti-cheat / integrity rules baked into the model:**
- Events are time/date-boxed (`startTime`–`endTime`) → no after-hours check-ins.
- Every listing has an `adminId` → events are admin-manned.
- Hours/points only awarded after `afterPhotoURL` exists and admin marks complete.

---

## 4. Screens & Components

### Volunteer side
| Screen | Contents | Source feature |
|---|---|---|
| **Home / Dashboard** | Rank badge, points, progress bar (e.g. `40/50 hrs`), this-week stats, upcoming events | Progress tracking |
| **Map** | Leaflet map with hot spot heat pins + listing pins; tap pin → slide-up modal | Hot spots, listings |
| **Listing modal** | Photo, address, estimated hours, severity, date/time, **Sign Up** button | List of listings |
| **Calendar** | Activities calendar (week strip like the screenshots) of signed-up events | Activities calendar |
| **Profile** | Name, hometown, total hours, rank, **Download Certificate** button, sign out | Profile, cert download |
| **Auth** | Sign in / sign up (email + Google), GPS permission prompt | Auth, GPS |

### Admin side
| Screen | Contents |
|---|---|
| **Admin Dashboard** | Event stats, total volunteer hours logged, sign-up counts, pending completions to verify |
| **Listings manager** | Create/edit listing: upload photo, set address+pin, estimated hours, date/time, capacity |
| **Verify** | Review before/after pics → approve → award hours/points |
| **Admin Profile** | Name, role, sign out |

### Shared components
`PhoneFrame`, `BottomTabBar`, `Header`, `ProgressBar`, `RankBadge`,
`ListingCard`, `SlideUpModal`, `MapView`, `PhotoUpload`, `EventTimeGuard`.

---

## 5. Folder Structure

```
src/
  main.jsx
  App.jsx                  // router + role-based shell
  firebase.js              // Firebase init
  context/
    AuthContext.jsx        // user, role, sign in/out
  data/
    mockData.js            // Day-1 seed data (listings, user)
  components/
    PhoneFrame.jsx
    BottomTabBar.jsx
    Header.jsx
    ProgressBar.jsx
    RankBadge.jsx
    ListingCard.jsx
    SlideUpModal.jsx
    MapView.jsx
    PhotoUpload.jsx
  screens/
    auth/SignIn.jsx
    volunteer/Home.jsx
    volunteer/MapScreen.jsx
    volunteer/Calendar.jsx
    volunteer/Profile.jsx
    admin/AdminDashboard.jsx
    admin/Listings.jsx
    admin/Verify.jsx
  styles/
    theme.css              // dark theme matching the screenshots
  utils/
    cert.js                // jsPDF certificate
    estimateHours.js       // simple "AI" hours estimate helper
```

---

## 6. 3-Day Build Schedule

### Day 1 — Front-end shell + screens with MOCK data
- [ ] Scaffold Vite React app, install deps, dark theme matching screenshots.
- [ ] Build `PhoneFrame` + `BottomTabBar` + router (volunteer + admin shells).
- [ ] Volunteer **Home/Dashboard** with rank, points, progress bar (mock).
- [ ] **Map** screen with Leaflet + pins + slide-up listing modal (mock listings).
- [ ] **Calendar** + **Profile** screens (mock).
- [ ] Admin **Dashboard** + **Listings** form (UI only).
- **Goal: full clickable demo with fake data.**

### Day 2 — Firebase wiring
- [ ] Firebase project: Auth (email + Google), Firestore, Storage.
- [ ] `AuthContext`, sign-in/up, role-based routing.
- [ ] Replace mock listings with Firestore reads/writes.
- [ ] Sign-up flow (volunteer joins event → `signups` doc).
- [ ] Admin create listing → writes to Firestore (with `adminId`, date/time).
- [ ] GPS: `navigator.geolocation` to center map + sort listings by proximity.

### Day 3 — Impact, integrity, polish
- [ ] Before/after photo upload → Firebase Storage.
- [ ] `EventTimeGuard`: only allow check-in within event window (anti-cheat).
- [ ] Admin **Verify** → approve → award hours/points → bump rank.
- [ ] Certificate download (`jspdf`) on Profile.
- [ ] Proximity-based listing sort ("DoorDash-style" availability).
- [ ] Polish, seed demo data, rehearse the demo flow.
- **Stretch:** teams, leaderboard, AI hour estimate from photo.

---

## 7. Feature → Implementation Map

| Idea | How |
|---|---|
| Higher ranking = more rewards | `points` → `rank` tiers; reward list gated by rank (UI like the Dasher Rewards screen) |
| Building teams | `teams` collection, team points sum (stretch) |
| Hot spot tracking | Listing `severity` → colored Leaflet markers / heat |
| DoorDash-style proximity & availability | Sort `listings` by distance from GPS, filter `status==open` & within date |
| Before & after pics | Storage upload on `signups`, shown in admin Verify |
| Volunteer hours / scholarships | `totalHours` accrual + certificate PDF download |
| Events manned by admin | `adminId` required on every listing |
| Time/date-planned events | `eventDate`/`startTime`/`endTime` + `EventTimeGuard` |
| Prevent after-hours / cheating | Check-in only inside window; hours only after admin verify |

---

## 8. Demo Script (what to show judges)
1. Sign in as volunteer → Home dashboard (rank + progress).
2. Open Map → tap a red hot spot → slide-up modal → **Sign Up**.
3. Show it on the Calendar.
4. "Arrive" → upload before pic → upload after pic.
5. Switch to admin → Verify → approve → volunteer hours + rank go up.
6. Volunteer downloads certificate.
7. One line on impact: total lbs of litter / hours logged across community.
```
```
```

---

## 9. Risks & Simplifications
- **Firebase taking too long?** Day 1 mock data already gives a full demo; Firebase is additive.
- **Maps fiddly?** `react-leaflet` works out of the box; fall back to static pin list if needed.
- **"AI" hours estimate** = simple heuristic (severity × area) labeled as AI-assisted. Don't build ML.
- Keep auth to email + Google only. No password reset flows, no profile editing beyond basics.
