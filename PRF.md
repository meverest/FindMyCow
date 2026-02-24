# FindMyCow — Product Requirements Framework (PRF)

## 1. Overview

**FindMyCow** is a mobile-first application that helps farmers, ranchers, and livestock enthusiasts identify, log, and track individual cows within a herd using visual characteristics such as coat patterns, markings, and brandings. Think of it as *Pokémon GO for cows* — users can build a personal catalog of every cow they encounter, track each one over time, and never lose sight of their favourite bovine again.

---

## 2. Problem Statement

Managing individual animals within a large herd is challenging. Traditional identification methods (ear tags, RFID chips) require physical proximity and specialist equipment. FindMyCow solves this by enabling visual identification from a distance using a smartphone camera, making it accessible to anyone working with or caring for cattle.

---

## 3. Goals & Success Metrics

| Goal | Success Metric |
|---|---|
| Enable non-expert cow identification | Users successfully identify a cow within 3 attempts |
| Build a personal "herd catalog" | Average user catalogs ≥ 5 unique cows in first session |
| Improve herd tracking over time | 70% of catalogued cows re-identified on a return visit |
| Engage recreational users | Average session length ≥ 5 minutes for hobbyist users |

---

## 4. Target Users

### 4.1 Primary — Farmers & Ranchers
- Manage herds of 20–500+ cattle
- Need daily health and location tracking
- May already use ear tags or RFID but want a phone-based complement

### 4.2 Secondary — Hobby Farmers & Smallholders
- Manage small herds (2–20 cows)
- Want a simple, low-cost way to tell animals apart
- Less technical expertise

### 4.3 Tertiary — Enthusiasts & Visitors
- Visiting farms, agri-tourism sites, or rural events
- Motivated by gamification ("collect" cows like Pokémon cards)
- No prior livestock experience

---

## 5. Core Features

### 5.1 Cow Capture & Identification
- **Camera integration** — user points their phone camera at a cow and taps to capture an image.
- **Visual feature extraction** — the app analyses the image for:
  - Coat colour and pattern (e.g., Friesian spots, Hereford face markings)
  - Visible brandings (location on body, shape)
  - Ear tag colour/number if visible
  - Body size/shape as secondary signal
- **Match & suggest** — compare captured image against the user's existing catalog and return a ranked list of likely matches.
- **New or known?** — prompt the user to confirm a match or register the cow as new.

### 5.2 Cow Catalog ("The Herd Book")
- Each catalogued cow has a **profile card** containing:
  - Nickname / farm name
  - Breed (auto-suggested or manually entered)
  - Date first seen
  - Location (farm / field name, GPS coordinates optional)
  - Photo gallery (multiple images)
  - Identifying features summary (auto-generated and user-editable)
  - Health & observation notes
  - Sighting history
- Profiles are searchable and filterable by breed, field, date last seen, and custom tags.

### 5.3 Field & Location Management
- Users can define **fields** (named locations with optional GPS boundary).
- Each sighting is associated with a field.
- A **field view** shows all cows last spotted in that location.
- Support for multiple farms / properties under one account.

### 5.4 Sighting Log
- Every time a cow is identified (new or existing), a **sighting event** is recorded automatically with:
  - Timestamp
  - Location / field
  - Photo(s)
  - Notes
- Sighting history is displayed on the cow's profile as a timeline.

### 5.5 Gamification ("CowDex")
- A **CowDex** — inspired by the Pokédex — tracks every unique cow a user has catalogued.
- Progress indicators: "X of Y cows in this herd catalogued."
- Achievements / badges (e.g., "First Friesian Found", "Herd Completed", "50-cow Club").
- Optional sharing: share a cow's profile card or a "new discovery" notification to social media.

### 5.6 Notifications & Reminders
- **Health check reminders** — prompt user to check on a cow not sighted within a configurable period.
- **New sighting push notifications** — if another user in a shared herd logs a cow.

### 5.7 Collaboration & Shared Herds
- Multiple users can be invited to manage the same herd/farm.
- Role-based access: **Owner**, **Manager** (can add/edit cows), **Viewer** (read-only).
- Activity feed showing team members' recent sightings.

---

## 6. User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| US-01 | Farmer | take a photo of a cow and have the app identify it | I can quickly confirm which animal I am looking at without checking an ear tag |
| US-02 | Farmer | add a new cow to my catalog | I can track all animals in my herd |
| US-03 | Farmer | view the sighting history of a specific cow | I can monitor how often and where each animal is seen |
| US-04 | Rancher | define multiple fields on my property | I can see which animals are in which paddock |
| US-05 | Rancher | invite a farmhand to share my herd | We can both log sightings and the records stay in sync |
| US-06 | Smallholder | give each cow a nickname | I can refer to them in a friendly, memorable way |
| US-07 | Enthusiast | see a CowDex showing all the cows I have catalogued | I can track my "collection" like a game |
| US-08 | Enthusiast | share a cow's profile card | I can show friends the interesting cows I have found |
| US-09 | Any user | receive a reminder when a cow has not been sighted in 7 days | I am alerted to potential welfare issues early |
| US-10 | Any user | search and filter my herd book | I can quickly find a specific cow or group of cows |

---

## 7. Out of Scope (v1.0)

- Automated disease / health diagnosis from images
- Integration with livestock management ERP systems (v2 roadmap)
- Drone / aerial image capture
- Real-time GPS tracking via collar devices
- Marketplace or trading features

---

## 8. Technical Requirements

### 8.1 Platform
- **Mobile**: iOS 16+ and Android 12+ (primary)
- **Web**: read-only dashboard for desktop (secondary, v1.1)

### 8.2 Image Recognition
- On-device ML model for quick offline matching (lightweight MobileNet-style model)
- Cloud-based model for higher-accuracy matching when online (REST API)
- Image pre-processing: auto-crop, contrast normalisation, background removal

### 8.3 Data Storage
- **Local (on-device)**: SQLite database for offline-first operation
- **Cloud sync**: REST API backed by a relational database (PostgreSQL)
- Images stored in object storage (e.g., S3-compatible) with CDN delivery
- End-to-end encryption for all user data in transit (TLS 1.3) and at rest

### 8.4 Authentication & Security
- Email/password and social login (Google, Apple)
- JWT-based session management with refresh token rotation
- Role-based access control (see §5.7)
- GDPR / Privacy compliance — users control and can delete all their data

### 8.5 Offline Support
- Core identification against locally cached catalog works without connectivity
- Sightings queued locally and synced when back online

### 8.6 Performance
- Image capture to identification result: < 3 seconds on-device, < 5 seconds cloud
- App cold-start time: < 2 seconds on mid-range hardware

---

## 9. Data Model (High Level)

```
User
  ├─ id, email, display_name, role
  └─ owns / belongs_to → Farm (many-to-many via Membership)

Farm
  ├─ id, name, location_description
  └─ contains → Field[]

Field
  ├─ id, name, farm_id, gps_boundary (GeoJSON, optional)
  └─ associated_with → Sighting[]

Cow
  ├─ id, nickname, breed, date_first_seen, farm_id
  ├─ feature_vector (ML embedding for matching)
  ├─ photos → Image[]
  └─ sightings → Sighting[]

Sighting
  ├─ id, cow_id, field_id, user_id
  ├─ timestamp, notes
  └─ photos → Image[]

Image
  ├─ id, url, thumbnail_url
  └─ captured_at, width, height
```

---

## 10. UI/UX Principles

1. **Camera-first** — the primary action is always one tap away from the home screen.
2. **Offline-capable** — the app must be fully usable without connectivity.
3. **Simple onboarding** — a new user should be able to capture and catalog their first cow within 2 minutes.
4. **Accessible** — WCAG 2.1 AA compliance; large tap targets; high-contrast mode.
5. **Delightful** — use light gamification (achievements, animated CowDex entries) to reward continued engagement without overwhelming professional users.

---

## 11. Key Screens (Wireframe Descriptions)

| Screen | Description |
|---|---|
| **Home / Camera** | Full-screen camera viewfinder with a single "Identify" button. Recent sightings shown as a bottom drawer. |
| **Match Results** | List of candidate cows with confidence scores and thumbnail photos. "This is [Cow]" / "New Cow" actions. |
| **Cow Profile** | Hero photo, nickname, breed badge, feature tags, sighting timeline, notes. Edit button for authorised users. |
| **Herd Book** | Grid/list of all catalogued cows. Search bar and filter chips (breed, field, date). |
| **Field Map** | Map view of a farm with field boundaries overlaid. Tap a field to see cows last spotted there. |
| **CowDex** | Scrollable grid of cow cards — greyed out until catalogued. Progress bar and badge display. |
| **Settings** | Account, farm/field management, notification preferences, data export, delete account. |

---

## 12. Roadmap

| Phase | Scope |
|---|---|
| **v1.0 — MVP** | Camera capture, on-device matching, cow catalog, sighting log, basic CowDex |
| **v1.1 — Collaboration** | Shared herds, team roles, activity feed, web dashboard |
| **v1.2 — Intelligence** | Cloud ML model upgrade, breed auto-detection, health pattern alerts |
| **v2.0 — Ecosystem** | ERP integrations, API for third-party apps, advanced analytics |

---

## 13. Open Questions

1. **Breed coverage** — which cattle breeds should the v1 ML model prioritise?
2. **Regulatory requirements** — are there livestock identification regulations in target markets that the app must align with?
3. **Monetisation model** — freemium (limited catalog size), subscription (unlimited + collaboration), or one-time purchase?
4. **Data ownership** — who owns the ML training data derived from user-submitted photos?
5. **Connectivity in rural areas** — should the app support peer-to-peer sync (e.g., Bluetooth/WiFi Direct) between devices on the same farm?
