# Codeyoung Trial Class Booking System 🚀

A full-stack, enterprise-grade trial class booking platform inspired by [Codeyoung.com](https://www.codeyoung.com/). Built with React (Vite), Express.js, MongoDB (Mongoose), and precise IANA timezone & DST synchronization using `date-fns-tz`.

---

## 🌟 Key Features

1. **Brand-Authentic UI & Design System**
   - Styled to match **Codeyoung.com** with warm cream surfaces (`#FBF7EF`), golden-yellow CTA pills (`#E5A62B`), dark teal typography, and STEM badges.
   - Micro-animations, responsive layout, and celebratory confetti upon booking confirmation.

2. **1:1 Global Mentor Network**
   - Seeded with **10 certified global STEM mentors** across diverse IANA timezones (New York, London, Tokyo, Singapore, Sydney, Berlin, Kolkata, Dubai, Chicago, Los Angeles).
   - Strict operating hours enforcement (`09:00` to `17:00` in mentor's local timezone).
   - Daily limit strictly capped at **2 trial classes per mentor per local calendar day** (20 classes total capacity across the network).

3. **Timezone & Daylight Saving Time (DST) Intelligence**
   - IANA timezone identifier validation (`Intl` & `date-fns-tz`).
   - Dynamically calculates UTC start/end times without assumptions of static UTC offsets.
   - Dual-timezone confirmation card displaying both parent local time and mentor local time with accurate time zone abbreviations (e.g. `EDT`, `IST`, `BST`).

4. **Intelligent Concurrency & Mentor Assignment**
   - **Load-Balancing Assignment**: Assigns the least-loaded eligible mentor for the day (0 bookings first, then 1 booking).
   - **Deterministic Tie-Breaking**: Consistent sorting by mentor `_id`.
   - **No Double-Booking**: Atomic overlap check (`existing.start < requested.end && existing.end > requested.start`).
   - In-process mutex locking and MongoDB transaction-ready architecture prevents race conditions under high concurrency.

5. **Integrated Calendar & Classroom Tools**
   - Instant dummy meeting link generation (`https://meet.codeyoung.com/trial-...`).
   - One-click **Add to Google Calendar** link.
   - One-click **Download `.ics` Calendar Invite** file for Apple Calendar, Outlook, and mobile devices.
   - In-app **Live Bookings Audit Modal** with real-time refresh and database re-seed controls.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS (Design System), Lucide Icons, Canvas-Confetti
- **Backend**: Node.js (v20+ / v24), Express.js
- **Database**: MongoDB (Mongoose 8+)
- **Timezone Engine**: `date-fns` & `date-fns-tz`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on default port `27017` (e.g., `mongodb://localhost:27017/codeyoung_booking`)

### 2. Installation

Install dependencies for both client and server:
```bash
# In project root
npm --prefix server install
npm --prefix client install
```

### 3. Seed Database
Seeds the 10 global mentors:
```bash
npm run seed
```

### 4. Run Development Servers

Start the Express backend API (Port 5000):
```bash
npm run dev:server
```

In another terminal, start the Vite frontend (Port 3000):
```bash
npm run dev:client
```

Open your browser at **`http://localhost:3000`**.

---

## 🧪 Comprehensive Automated Test Suite (All 23 PRD Scenarios)

Run the test suite:
```bash
npm run test:server
```

### Verified Test Cases:
- ✔ **Scenario 1**: Valid slot booking creates confirmed record in DB
- ✔ **Scenario 2**: Mentor assignment respects operating hours in mentor local time
- ✔ **Scenario 3**: Mentor is unavailable outside operating hours
- ✔ **Scenario 4**: Overlapping booking prevented for same mentor
- ✔ **Scenario 5**: Non-overlapping consecutive bookings allowed
- ✔ **Scenario 6**: Daily limit of 2 classes per mentor enforced
- ✔ **Scenario 7**: 3rd booking on same day delegates to another eligible mentor
- ✔ **Scenario 8**: Least-loaded mentor chosen first for load balancing
- ✔ **Scenario 9**: Deterministic tie-breaker selects mentor by sorted ID
- ✔ **Scenario 10**: Parent local time converted to UTC correctly
- ✔ **Scenario 11**: Mentor local time computed from UTC correctly
- ✔ **Scenario 12**: UTC timestamps correctly stored in DB
- ✔ **Scenario 13**: Meeting link generated with valid demo URL
- ✔ **Scenario 14**: Booking contains both parent and mentor local times
- ✔ **Scenario 15**: Valid IANA timezones accepted
- ✔ **Scenario 16**: Invalid timezones rejected (HTTP 400)
- ✔ **Scenario 17**: Daylight saving transition handled accurately without fixed offset
- ✔ **Scenario 18**: Slots across midnight in UTC handled correctly
- ✔ **Scenario 19**: Slot spanning across midnight in mentor time is rejected
- ✔ **Scenario 20**: Concurrent booking requests serialize safely without double booking
- ✔ **Scenario 21**: Max 2 classes per mentor on a single calendar day enforced
- ✔ **Scenario 22**: Exactly 10 active mentors in database
- ✔ **Scenario 23**: Lookup booking by ID returns populated mentor

---

## 📡 REST API Documentation

### 1. Get Mentors
- **Endpoint**: `GET /api/mentors`
- **Response**: List of 10 active mentors with timezones, operating hours, subjects, ratings, and bios.

### 2. Get Available Slots
- **Endpoint**: `GET /api/slots?date=YYYY-MM-DD&timezone=Area/Location`
- **Example**: `GET /api/slots?date=2026-10-12&timezone=America/New_York`
- **Response**: 30-minute intervals with live calculated availability and eligible mentor count.

### 3. Create Booking
- **Endpoint**: `POST /api/bookings`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "parentName": "Sarah Miller",
    "parentEmail": "sarah.m@example.com",
    "parentPhone": "+1 555-019-2831",
    "childName": "Leo",
    "childAge": 9,
    "subject": "Scratch & Game Development",
    "date": "2026-10-12",
    "time": "09:00",
    "parentTimezone": "America/New_York",
    "notes": "Beginner coder"
  }
  ```
- **Response (201 Created)**: Booking object populated with assigned mentor, `startTimeUTC`, `endTimeUTC`, `parentLocalStartTime`, `mentorLocalStartTime`, and `meetingLink`.
- **Response (409 Conflict)**: If all mentors are at daily capacity, outside operating hours, or booked.

### 4. Get Booking By ID
- **Endpoint**: `GET /api/bookings/:id`
- **Response**: Full booking details and assigned mentor profile.

### 5. Reset & Re-Seed (Dev Helper)
- **Endpoint**: `POST /api/reset-seed`
- **Response**: Clears bookings and reseeds 10 mentors.

---

## 📂 Project Structure

```
CodeYoung/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Sticky header with brand logo & CTAs
│   │   │   ├── HeroSection.jsx         # Hero banner matching Codeyoung.com
│   │   │   ├── BookingWizard.jsx       # 4-step interactive trial scheduler
│   │   │   ├── ConfirmationView.jsx    # Dual-timezone celebration view
│   │   │   ├── CoursesSection.jsx      # STEM curriculum pathway catalog
│   │   │   ├── MentorsShowcase.jsx     # Global educator roster cards
│   │   │   ├── WhyCodeyoung.jsx        # Parent reviews & STEM features
│   │   │   ├── BookingsListModal.jsx   # Live booking auditor modal
│   │   │   └── Footer.jsx              # Accreditation marks & footer links
│   │   ├── utils/
│   │   │   ├── calendar.js             # Google Calendar & .ics generators
│   │   │   └── timezonesList.js        # IANA timezones grouped by region
│   │   ├── App.jsx                     # Application coordinator
│   │   └── index.css                   # Codeyoung design system tokens
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/db.js                # MongoDB connection
│   │   ├── models/
│   │   │   ├── Mentor.js               # Mentor Mongoose Schema
│   │   │   └── Booking.js              # Booking Mongoose Schema
│   │   ├── routes/
│   │   │   ├── mentorRoutes.js         # Mentor REST endpoints
│   │   │   ├── slotRoutes.js           # Slot availability endpoints
│   │   │   └── bookingRoutes.js        # Booking creation & lookup
│   │   ├── services/
│   │   │   ├── slotService.js          # Availability & quota calculation
│   │   │   └── bookingService.js       # Atomic matching & persistence
│   │   ├── utils/
│   │   │   └── timezone.js             # date-fns-tz conversion engine
│   │   ├── scripts/
│   │   │   └── seed.js                 # 10 mentor database seeder
│   │   └── server.js                   # Express app entry point
│   ├── test/
│   │   ├── prd_scenarios.test.js       # All 23 PRD test scenarios
│   │   └── timezone.test.js            # Timezone & DST unit tests
│   └── package.json
├── package.json                        # Root orchestration scripts
└── README.md
```
