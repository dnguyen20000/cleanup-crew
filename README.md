# 🌱 Ripple

A dual-platform ecosystem for a sustainable community litter-cleanup initiative. Volunteers find nearby cleanup hot spots, join admin-run events, log before/after proof, earn rank + rewards, and accrue verified volunteer hours toward scholarships.

Built for a 3-day sustainability hackathon. Features both a **React + Vite Web App** and a fully native **React Native + Expo Mobile App**, sharing the same domain model and mock data flows.

## 📱 Mobile App (React Native + Expo)

We recently launched a full-featured native mobile app built with Expo Router and React Native. This is the recommended platform for volunteers in the field.

### Key Mobile Features
- **Native Navigation**: Fluid file-based routing with bottom tabs using Expo Router.
- **Interactive Maps**: Full native map integration via `react-native-maps` for finding local hot spots based on proximity.
- **Media & Proof**: Integrated native camera and media library (`expo-image-picker`) for seamless before/after cleanup photo uploads.
- **Time/Date Management**: Native UI pickers for admins to schedule cleanup windows.
- **Native PDF Certificates**: Generates, renders, and shares a highly readable, printable volunteer certificate natively using `expo-print` and `expo-sharing`.
- **Role-Based Workflows**: Contains both Volunteer (cleanup, proof, maps) and Admin (verification, listing creation) flows in one app shell.

### Run the Mobile App
```bash
cd mobile-app
npm install
npx expo start
```
*Use the Expo Go app on your physical device to scan the QR code, or press `i` to launch in an iOS Simulator, or `a` to launch in an Android Emulator.*

---

## 💻 Web App (React + Vite)

The original mobile-friendly web client built with React, Vite, and Leaflet maps. 

### Run the Web App
```bash
# In the root directory
npm install
npm run dev
```
*Then open http://localhost:5173. For the best look, use your browser's device toolbar / responsive mode and pick a phone (e.g., iPhone 12).*

---

## ♻️ Try the Demo Flow (Works on Both Platforms)

1. **Sign in** — choose **Volunteer**, enable location, Get started.
2. **Home** — see your rank, absolute points progress bar, stats, and team leaderboard.
3. **Map** — tap a red/orange hot spot or a list card → **Sign up**.
4. **Calendar** — your event appears; tap **Check in & log proof** → add Before/After photos → **Submit for review**. *(Note: Check-in is locked outside the event time window as an anti-cheat measure.)*
5. Log out, sign back in as **Admin**:
   - **Dashboard** — view community impact + per-listing signups.
   - **Listings** — tap **+** to create a hot spot (photo, address, AI-estimated hours, date/time, capacity).
   - **Verify** — approve the volunteer's before/after photos → instantly awards hours + points.
6. Back as the volunteer, go to **Profile → Download certificate** to generate and save your official PDF certificate of verified hours.
