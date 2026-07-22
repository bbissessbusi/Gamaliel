# Gamaliel — Mobile (Expo / React Native)

A from-scratch React Native rebuild of the Gamaliel web app, sharing the same
Supabase backend (auth + `evaluations` table + `sermon-uploads` storage
bucket — see `../supabase/schema.sql`) and the same Deepgram/Claude
Vercel Edge Functions (`../api/analyze.js`, `../api/transcribe.js`,
`../api/health.js`).

## Features ported

- Email/password auth (login, sign up, resend confirmation email, remember me)
- Sermon scorecard: Sacred Foundation checkboxes, Structural Weight & Vocal
  Cadence sliders, Critical Post-Analysis notes, evaluator signature
- Digital Capture: pick an audio/video file → upload to Supabase Storage
  with progress → Deepgram transcription → Claude (Gamaliel) analysis →
  auto-fills the scorecard
- Evaluation Summary, Evaluation History (grouped by weakest metric),
  Refined Lexicon (glossary with tap-to-jump from any scorecard label),
  and the 6-step Guided Tour

## Not yet wired up

- **Google / Apple OAuth** — the buttons are built but hidden behind
  `OAUTH_ENABLED = false` in `src/screens/LoginScreen.js` and
  `src/screens/SignUpScreen.js`. Native OAuth needs:
  - `expo-auth-session` + a Google OAuth client ID for Google sign-in
  - `expo-apple-authentication` (Sign in with Apple capability) for Apple
  - Both providers configured in your Supabase Auth settings
  Once you have those, flip the flag and wire `signInWithOAuth` in
  `src/services/supabaseService.js`.

## Setup

1. `cd mobile && npm install`
2. `cp .env.example .env` and fill in:
   - `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — same
     Supabase project as the web app.
   - `EXPO_PUBLIC_API_BASE_URL` — the deployed backend origin. A mobile app
     has no "same origin" the way the web app does when relative `/api/`
     routes resolve automatically, so this must be an absolute URL. Two
     candidate deployments were shared during setup:
     - `https://gamaliel-git-claude-fix-scor-caf2cf-brittneys-projects-3d4bf32b.vercel.app`
       (branch preview — used as the default in `.env.example`, redeploys on
       every push to that branch)
     - `https://gamaliel-hvwpnx9d9-brittneys-projects-3d4bf32b.vercel.app`
       (one specific deployment, won't pick up future changes)

     **Confirm which one is actually the stable/production URL** and update
     `.env` (and `.env.example`, for whoever sets this up next) if needed.
3. `npx expo start -c` (the `-c` clears Metro's cache so the new `.env`
   values get picked up)

## Running on your iPhone (Expo Go — no Chrome/browser involved)

This is a real React Native app, not a website — it does not run through a
browser at all once installed.

1. Install **Expo Go** from the App Store on your iPhone.
2. Run `npx expo start` in this folder.
3. Scan the QR code printed in the terminal with your iPhone's Camera app
   (or the Expo Go app's scanner).
4. The app opens directly inside Expo Go, running as native code on your
   phone — Metro just serves the JS bundle over your local network. Your
   phone and computer need to be on the same Wi-Fi network. If that doesn't
   work, run `npx expo start --tunnel` instead (slower, but works across
   different networks/VPNs).

For a fully standalone app icon on your home screen (no Expo Go wrapper),
you'd build a development or production client with
[EAS Build](https://docs.expo.dev/build/introduction/) — not required for
day-to-day development.

## Project layout

```
mobile/
├── App.js                     # font loading, providers, NavigationContainer
├── app.json                   # Expo config (name, bundle id, icons, splash)
├── src/
│   ├── screens/                # one file per app screen
│   ├── components/             # GlassCard, GradientButton, sliders, etc.
│   ├── services/
│   │   ├── supabaseService.js  # auth + evaluations table (AsyncStorage session)
│   │   └── claudeService.js    # upload → Deepgram → Claude pipeline
│   ├── context/AppContext.js   # shared scorecard/auth/evaluations state
│   ├── navigation/RootNavigator.js
│   └── theme.js                 # colors, gradients, fonts, slider color ramp
```

## Design notes / known deviations from the web app

- **Glass-morphism**: web `backdrop-filter: blur()` + CSS `mask-composite`
  gradient borders have no direct RN equivalent. `GlassCard` approximates
  it with `expo-blur`'s `BlurView` inside a `LinearGradient`-bordered
  wrapper.
- **Radial gradients**: RN's `expo-linear-gradient` is linear-only, so the
  web app's `radial-gradient` mesh backgrounds are approximated with
  layered diagonal gradients in `MeshBackground.js`.
- **Animated wave canvas backgrounds** (History/Glossary pages on web) were
  not ported 1:1 — an RN `<canvas>` equivalent would need `react-native-svg`
  + a manual animation loop; the current build uses the same dark
  background without the interactive sine-wave lines. Worth a follow-up if
  you want full parity.
- **Fonts**: JetBrains Mono, Space Grotesk, and League Script are loaded via
  `@expo-google-fonts/*` packages (same typefaces as the web app's Google
  Fonts imports).
- **Sermon recording**: like the original web app, the record button is a
  UI affordance only — the working analysis path is picking an existing
  audio/video file. Real in-app recording (`expo-av`/`expo-audio`) would be
  a good native-specific follow-up.
