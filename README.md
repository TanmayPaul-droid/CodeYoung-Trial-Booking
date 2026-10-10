CodeYoung Trial Class Booking System 🚀
A full-stack, enterprise-grade trial class booking platform inspired by CodeYoung.com. Built with React (Vite), Express.js, MongoDB (Mongoose), and precise IANA timezone and Daylight Saving Time (DST) synchronization using date-fns-tz.

🌟 Key Features
1. Brand-Authentic UI & Design System
Styled to match CodeYoung.com with warm cream surfaces (#FBF7EF), golden-yellow CTA pills (#E5A62B), dark teal typography, and STEM badges.
Micro-animations, responsive layouts, and celebratory confetti upon booking confirmation.
2. 1:1 Global Mentor Network
Seeded with 10 global STEM mentors across diverse IANA timezones: New York, London, Tokyo, Singapore, Sydney, Berlin, Kolkata, Dubai, Chicago, and Los Angeles.
Strict operating hours enforcement (09:00 to 17:00 in the mentor's local timezone).
Daily limit capped at 2 trial classes per mentor per local calendar day, giving the network a maximum theoretical capacity of 20 classes per day.
3. Timezone & Daylight Saving Time (DST) Intelligence
IANA timezone identifier validation using Intl and date-fns-tz.
Dynamically calculates UTC start and end times without assuming static UTC offsets.
Dual-timezone confirmation card displaying both parent local time and mentor local time with accurate timezone abbreviations (e.g., EDT, IST, BST).
4. Intelligent Concurrency & Mentor Assignment
Load-balancing assignment: Assigns the least-loaded eligible mentor for the day, prioritizing mentors with zero bookings before mentors with one booking.
Deterministic tie-breaking: Consistent sorting by mentor _id.
No double-booking: Uses the overlap condition existing.start < requested.end && existing.end > requested.start.
In-process mutex locking helps prevent race conditions within a single server process. Multi-instance deployments require suitable database-level concurrency controls or distributed locking.
5. Integrated Calendar & Classroom Tools
Instant demo meeting link generation using a URL such as https://meet.codeyoung.com/trial-....
One-click Add to Google Calendar link.
One-click download of .ics calendar invitations for Apple Calendar, Outlook, and mobile devices.
In-app Live Bookings Audit Modal with refresh and development database reseeding controls.
🛠️ Tech Stack
Frontend: React 18, Vite, Vanilla CSS (Design System), Lucide Icons, Canvas Confetti
Backend: Node.js (v20+ recommended), Express.js
Database: MongoDB, Mongoose 8+
Timezone Engine: date-fns and date-fns-tz
🚀 Quick Start Guide
1. Prerequisites
Install the following before starting:

Node.js (v18 or later recommended)
npm
MongoDB running locally or an accessible MongoDB instance
Example local MongoDB connection string:

mongodb://localhost:27017/codeyoung_booking
2. Installation
Install dependencies for both client and server from the project root:

npm --prefix server install
npm --prefix client install
If the root package.json defines its own dependencies, install those as well:

npm install
3. Environment Configuration
Create a .env file in the appropriate directory if required by your server configuration.

Example:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeyoung_booking
Use the environment variable names expected by your actual backend code. Never commit secrets or private database credentials.

4. Seed Database
Seed the database with the 10 global mentors:

npm run seed
Run this command from the project root if the seed script is defined in the root package.json.

5. Run Development Servers
Start the Express backend API on port 5000:

npm run dev:server
Open a second terminal and start the Vite frontend:

npm run dev:client
Open the frontend URL printed by Vite in your terminal. The configured port may be 3000 or 5173.

🧪 Comprehensive Automated Test Suite
The project specification defines 23 booking and timezone test scenarios.

Run the backend test suite:

npm run test:server
Test Scenarios
✔ Scenario 1: Valid slot booking creates a confirmed database record.
✔ Scenario 2: Mentor assignment respects operating hours in the mentor's local timezone.
✔ Scenario 3: Mentor is unavailable outside operating hours.
✔ Scenario 4: Overlapping bookings are prevented for the same mentor.
✔ Scenario 5: Non-overlapping consecutive bookings are allowed.
✔ Scenario 6: Daily limit of two classes per mentor is enforced.
✔ Scenario 7: A third booking is delegated to another eligible mentor.
✔ Scenario 8: Least-loaded eligible mentor is chosen first.
✔ Scenario 9: Deterministic tie-breaker selects a mentor by sorted ID.
✔ Scenario 10: Parent local time is converted to UTC correctly.
✔ Scenario 11: Mentor local time is computed from UTC correctly.
✔ Scenario 12: UTC timestamps are stored correctly in the database.
✔ Scenario 13: Meeting link is generated with a valid demo URL.
✔ Scenario 14: Booking contains both parent and mentor local times.
✔ Scenario 15: Valid IANA timezones are accepted.
✔ Scenario 16: Invalid timezones are rejected with HTTP 400.
✔ Scenario 17: Daylight saving transitions are handled without fixed offsets.
✔ Scenario 18: Slots crossing midnight in UTC are handled correctly.
✔ Scenario 19: Slots crossing midnight in mentor local time are rejected.
✔ Scenario 20: Concurrent booking requests are handled without double-booking.
✔ Scenario 21: Maximum of two classes per mentor per local calendar day is enforced.
✔ Scenario 22: Exactly 10 active mentors exist in the database.
✔ Scenario 23: Booking lookup by ID returns the populated mentor.
Note: These are the intended test scenarios. Run the test suite to verify which cases currently pass.

📡 REST API Documentation
1. Get Mentors
Endpoint: GET /api/mentors

Response: A list of active mentors, including their timezones, operating hours, subjects, ratings, and bios.

2. Get Available Slots
Endpoint: GET /api/slots?date=YYYY-MM-DD&timezone=Area/Location

Example:

GET /api/slots?date=2026-10-12&timezone=America/New_York
Response: Available 30-minute intervals, calculated availability, and eligible mentor count.

3. Create Booking
Endpoint: POST /api/bookings

Headers:

Content-Type: application/json
Example request body:

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
Expected response (201 Created): Booking details with the assigned mentor, startTimeUTC, endTimeUTC, parentLocalStartTime, mentorLocalStartTime, and meetingLink.

Possible response (409 Conflict): The requested booking cannot be accommodated because of availability or capacity restrictions.

4. Get Booking by ID
Endpoint: GET /api/bookings/:id

Response: Booking details and the assigned mentor profile.

5. Reset & Re-Seed (Development Helper)
Endpoint: POST /api/reset-seed

Response: Clears bookings and reseeds the 10 mentors, if implemented as described.

Warning: Restrict this endpoint to development environments. It should not be publicly accessible in production.

📂 Project Structure
CodeYoung/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Sticky header with brand logo and CTAs
│   │   │   ├── HeroSection.jsx         # Hero banner inspired by CodeYoung.com
│   │   │   ├── BookingWizard.jsx       # Four-step interactive trial scheduler
│   │   │   ├── ConfirmationView.jsx    # Dual-timezone confirmation view
│   │   │   ├── CoursesSection.jsx      # STEM curriculum catalog
│   │   │   ├── MentorsShowcase.jsx     # Global mentor roster
│   │   │   ├── WhyCodeyoung.jsx        # Parent reviews and STEM features
│   │   │   ├── BookingsListModal.jsx   # Booking audit modal
│   │   │   └── Footer.jsx              # Footer and accreditation marks
│   │   ├── utils/
│   │   │   ├── calendar.js             # Google Calendar and ICS generators
│   │   │   └── timezonesList.js        # IANA timezones grouped by region
│   │   ├── App.jsx                     # Application coordinator
│   │   └── index.css                   # Design system styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── models/
│   │   │   ├── Mentor.js               # Mentor Mongoose schema
│   │   │   └── Booking.js              # Booking Mongoose schema
│   │   ├── routes/
│   │   │   ├── mentorRoutes.js         # Mentor API endpoints
│   │   │   ├── slotRoutes.js           # Slot availability endpoints
│   │   │   └── bookingRoutes.js        # Booking creation and lookup
│   │   ├── services/
│   │   │   ├── slotService.js          # Availability and quota calculation
│   │   │   └── bookingService.js       # Mentor matching and persistence
│   │   ├── utils/
│   │   │   └── timezone.js             # Timezone conversion engine
│   │   ├── scripts/
│   │   │   └── seed.js                 # Mentor database seeder
│   │   └── server.js                   # Express app entry point
│   ├── test/
│   │   ├── prd_scenarios.test.js       # Booking scenario tests
│   │   └── timezone.test.js            # Timezone and DST tests
│   └── package.json
├── package.json                        # Root orchestration scripts
└── README.md
This structure describes the intended organization. Update it if your actual repository differs.

🔐 Security Considerations
Keep .env files, credentials, and API keys out of GitHub.
Validate and sanitize incoming API requests.
Add authentication and authorization where required.
Protect database reset and reseed endpoints.
Use database-level concurrency controls when deploying multiple server instances.
Configure production CORS, logging, and error handling.
📌 Project Overview
The CodeYoung Trial Class Booking System demonstrates a full-stack booking workflow with timezone-aware scheduling, global mentor allocation, booking conflict prevention, and calendar integration.
