# 🐄 FindMyCow

> *Pokémon GO — for cows.* Identify, catalog, and track individual cattle using your smartphone camera.

FindMyCow is a **mobile-first React Native (Expo)** application that helps farmers, ranchers, and livestock enthusiasts identify cows from visual characteristics (coat patterns, markings, brands) and build a personal **Herd Book** catalog over time.

See [`PRF.md`](./PRF.md) for the full Product Requirements Framework.

---

## Features (v1.0 MVP)

| Feature | Status |
|---|---|
| 📷 Camera capture & identification (stubbed ML) | ✅ |
| 📖 Herd Book — searchable cow catalog | ✅ |
| 🐮 Cow Profile — edit nickname, breed, notes, view sighting timeline | ✅ |
| 🎮 CowDex — Pokédex-style progress tracker with achievements | ✅ |
| 💾 Offline-first — AsyncStorage persistence | ✅ |
| ⚙️ Settings — notifications toggle, data management | ✅ |
| 🤖 ML identification model | 🔜 v1.1 |
| 🌐 Cloud sync / shared herds | 🔜 v1.1 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) via [Expo SDK 54](https://expo.dev/) |
| Language | TypeScript |
| Navigation | [React Navigation v7](https://reactnavigation.org/) (native stack + bottom tabs) |
| Offline storage | [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) |
| Camera | [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) |
| Images | [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- **Expo Go** app on your iOS or Android device **or** an iOS/Android emulator

Install Expo CLI globally (optional but convenient):

```bash
npm install -g expo-cli
```

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/meverest/FindMyCow.git
cd FindMyCow
npm install
```

### 2. Start the development server

```bash
npm start
# or: npx expo start
```

This opens **Expo Dev Tools** in your browser and prints a QR code.

### 3. Run on device / simulator

| Platform | Command | Requirements |
|---|---|---|
| **Expo Go (iOS/Android)** | Scan the QR code with [Expo Go](https://expo.dev/go) | Physical device |
| **iOS Simulator** | Press `i` in the terminal | macOS + Xcode |
| **Android Emulator** | Press `a` in the terminal | Android Studio |
| **Web (preview only)** | Press `w` in the terminal | Any browser |

---

## Project Structure

```
FindMyCow/
├── App.tsx                  # Root component — seeds mock data, mounts navigator
├── app.json                 # Expo config (permissions, icons, splash)
├── index.ts                 # Entry point (registerRootComponent)
├── PRF.md                   # Product Requirements Framework
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Camera viewfinder + Identify button
│   │   ├── MatchResultsScreen.tsx  # Ranked identification candidates
│   │   ├── CowProfileScreen.tsx # Full cow profile with edit support
│   │   ├── HerdBookScreen.tsx   # Searchable cow catalog grid
│   │   ├── CowDexScreen.tsx     # Pokédex-style progress tracker
│   │   └── SettingsScreen.tsx   # Account, notifications, data management
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Bottom-tab + native-stack navigation
│   ├── data/
│   │   ├── models.ts            # TypeScript types (User, Cow, Sighting…)
│   │   ├── storage.ts           # AsyncStorage CRUD helpers
│   │   └── mockData.ts          # Sample cows/farms seeded on first launch
│   ├── services/
│   │   └── identificationService.ts  # Stub ML identification service
│   ├── theme.ts                 # Design tokens (colours, spacing, radii)
│   └── utils.ts                 # Shared helpers (generateId, formatDate…)
└── assets/                  # App icon, splash image
```

---

## Data Model

The core entities mirror the PRF.md §9 high-level model:

```
User  →  Farm  →  Field
                     ↕
              Cow  →  Sighting  →  Image
```

All data is persisted locally via **AsyncStorage**. When the cloud sync layer is added, sightings will be queued and synced on reconnect (offline-first).

---

## Identification Service (Stub)

`src/services/identificationService.ts` simulates the ML model:

- Loads cows from local storage
- Assigns random confidence scores (0.40–1.00)
- Returns a ranked list of `IdentificationResult[]`

To integrate a real model, replace `identifyCow()` with:
1. An **on-device call** to a TensorFlow Lite / Core ML model (MobileNet-style), or
2. A **cloud REST call** to the FindMyCow backend API.

---

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and run `npx tsc --noEmit` to verify types
3. Open a pull request against `main`

---

## Testing

FindMyCow uses **Jest** (with the `jest-expo` preset) for unit and integration tests, **React Native Testing Library** for component testing, and **Detox** for end-to-end (E2E) tests.

### Test commands

| Command | Description |
|---|---|
| `npm test` | Run all unit and integration tests |
| `npm run test:coverage` | Run tests and generate a coverage report in `coverage/` |
| `npm run test:e2e:build` | Build the iOS debug app for E2E tests (requires macOS + Xcode) |
| `npm run test:e2e` | Run Detox E2E tests against the built app |

### Test structure

```
FindMyCow/
├── __tests__/
│   ├── utils.test.ts      # Unit tests for src/utils.ts helpers
│   └── App.test.tsx       # Integration test for the App root component
└── e2e/
    ├── jest.config.js     # Jest config used by Detox's test runner
    └── app.e2e.js         # Dummy E2E test — app launch & home screen check
```

### Unit tests (`__tests__/utils.test.ts`)

Tests the pure utility functions in `src/utils.ts`:
- `generateId` — uniqueness, format
- `nowISO` — valid ISO 8601 output, timestamp accuracy
- `formatDate` — empty input, valid date, invalid date

### Integration tests (`__tests__/App.test.tsx`)

Tests the `App` root component end-to-end within the Jest environment:
- Renders without crashing
- Async mock-data seeding completes and the state update settles correctly

AsyncStorage is mocked with `@react-native-async-storage/async-storage/jest/async-storage-mock`; navigation is mocked to avoid native module dependencies.

### E2E tests (`e2e/`)

Detox-based end-to-end tests that run against a real simulator/emulator build:

```bash
# 1. Build the debug app (macOS + Xcode required)
npm run test:e2e:build

# 2. Run the E2E suite
npm run test:e2e
```

The default configuration targets an **iOS Simulator (iPhone 15)**. See `.detoxrc.js` to configure an Android emulator instead.

### CI / GitHub Actions

Every pull request and push to `main` automatically triggers the **Tests** workflow (`.github/workflows/test.yml`):

- **Unit & Integration** — runs on `ubuntu-latest`, executes `npm run test:coverage`, and uploads the coverage artifact.
- **E2E** — runs on `macos-latest` (skipped for forked PRs), builds the iOS app, and executes the Detox suite.

---

## Roadmap

| Phase | Scope |
|---|---|
| **v1.0** | Camera capture, stub identification, Herd Book, CowDex, offline storage |
| **v1.1** | Cloud sync, shared herds, team roles, web dashboard |
| **v1.2** | Real ML model, breed auto-detection, health pattern alerts |
| **v2.0** | ERP integrations, third-party API, advanced analytics |

---

## Licence

MIT © FindMyCow Contributors
