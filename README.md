# 🚀 CodeYoung Trial Class Booking Platform

A full-stack trial-class booking platform inspired by CodeYoung, built with React, Vite, Express.js, MongoDB, and timezone-aware scheduling. The application supports global mentor allocation, booking conflict prevention, Daylight Saving Time (DST) handling, and calendar integration.

## 🌐 Live Demo

- **Live Application:** [https://code-young-trial-booking.vercel.app/](https://code-young-trial-booking.vercel.app/)
- **GitHub Repository:** [https://github.com/TanmayPaul-droid/CodeYoung-Trial-Booking](https://github.com/TanmayPaul-droid/CodeYoung-Trial-Booking)

Explore the live application or follow the setup instructions below to run the project locally.

## ✨ Key Features

### 🎨 1. Responsive User Interface

- Responsive landing page and trial-class booking workflow.
- Consistent design system with interactive components.
- Booking confirmation experience with celebratory animations.
- Mentor profiles and course showcase.

### 🌍 2. Global Mentor Network

- Seed data designed for 10 mentors across different IANA timezones.
- Mentor operating hours enforced in the mentor's local timezone.
- Maximum of two trial classes per mentor per local calendar day, as implemented by the booking logic.

### 🕒 3. Timezone and DST Intelligence

- IANA timezone validation.
- Timezone conversion using `date-fns-tz`.
- UTC-based booking timestamps.
- Parent and mentor local times displayed in booking confirmations.
- Daylight-saving transitions handled without relying on fixed UTC offsets.

### ⚖️ 4. Mentor Assignment and Booking Conflict Prevention

- Assigns eligible mentors based on existing daily booking load.
- Deterministic tie-breaking for mentor selection.
- Prevents overlapping bookings for the same mentor.
- In-process mutex locking to help manage concurrent booking requests within a single server process.

> Multi-instance deployments require appropriate database-level concurrency controls or distributed locking.

### 📅 5. Calendar and Meeting Integration

- Meeting link generation.
- Google Calendar integration.
- Downloadable `.ics` calendar invitations.
- Booking lookup and confirmation details.

### 🧪 6. Testing

- Backend tests using Node.js's built-in test runner.
- Booking validation and availability scenarios.
- Timezone conversion and DST scenarios.

Run the test suite to determine which scenarios currently pass.

## 🛠️ Tech Stack

| Layer             | Technologies                               |
| ----------------- | ------------------------------------------ |
| Frontend          | React, Vite, CSS                           |
| UI and Icons      | Lucide React                               |
| Animations        | Motion, Canvas Confetti                    |
| Backend           | Node.js, Express.js                        |
| Database          | MongoDB, Mongoose                          |
| Date and Time     | date-fns, date-fns-tz                      |
| Email Integration | Nodemailer, Resend                         |
| Testing           | Node.js Test Runner, MongoDB Memory Server |
| Version Control   | Git, GitHub                                |

## 📋 Prerequisites

Install the following before running the project:

- **Node.js:** A version compatible with the project's dependencies. Node.js 20 or later is recommended, but verify compatibility with the installed packages.
- **npm:** Installed with Node.js.
- **MongoDB:** A local MongoDB instance or a MongoDB Atlas connection.
- **Git:** Required to clone the repository.

Verify your installations:

```bash
node --version
npm --version
git --version
```

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/TanmayPaul-droid/CodeYoung-Trial-Booking.git
cd CodeYoung-Trial-Booking
```

Run all subsequent commands from the repository root unless specified otherwise.

### 2. Install Dependencies

Install the frontend dependencies:

```bash
npm install --prefix client
```

Install the backend dependencies:

```bash
npm install --prefix server
```

The root `package.json` provides orchestration scripts and does not currently declare application dependencies.

### 3. Configure Environment Variables

Create the backend `.env` file in the location expected by the server's configuration.

For example, if the backend reads `server/.env`, create that file with the following settings:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeyoung_booking
NODE_ENV=development
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=your_verified_sender@example.com
```

These are example values. Check the backend source code to confirm the exact required environment variable names and defaults.

If using MongoDB Atlas, replace the example URI with your own connection string and configure database access appropriately.

If email notifications are enabled, configure any required email credentials or API keys using the variable names expected by the application.

**Security guidelines:**

- Never commit real credentials, API keys, or database passwords.
- Keep `.env` files excluded from Git.
- Maintain a `.env.example` containing variable names and safe placeholder values.
- Do not publish production credentials in the README or transcript.

### 4. Start the Backend

Open a terminal in the repository root:

```bash
npm run dev:server
```

This invokes the backend development script defined in `server/package.json` and starts `server/src/server.js`.

Keep the terminal running.

### 5. Start the Frontend

Open a second terminal in the repository root:

```bash
npm run dev:client
```

Alternatively, start the frontend directly:

```bash
cd client
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in your browser.

Keep both the frontend and backend running while testing the application.

### 6. Seed the Database

If the application requires sample mentor data, configure MongoDB and run the seed script from the repository root:

```bash
npm run seed
```

This invokes `server/src/scripts/seed.js`.

**Warning:** Inspect the seed script before running it against a database containing data you want to preserve.

### 7. Run Backend Tests

From the repository root:

```bash
npm run test:server
```

This invokes the test script configured in `server/package.json`.

Review the test output to confirm which tests pass and investigate any failures.

## 🔧 Troubleshooting

### Vite is not recognized

Install the frontend dependencies:

```bash
npm install --prefix client
```

Then retry:

```bash
npm run dev:client
```

### MongoDB connection fails

- Check the MongoDB service or Atlas availability.
- Verify the connection string in the backend `.env` file.
- Confirm the database user and network access permissions.
- Check the backend terminal for connection errors.

### Port is already in use

Stop the process occupying the required port or configure an available port using the project's supported environment variables.

### Dependency installation fails

- Check your Node.js and npm versions.
- Run the installation command from the correct project directory.
- Read the complete npm error output.
- Review package compatibility before changing dependency versions.

### Environment variables are missing

Verify the expected variable names in the backend configuration and ensure the `.env` file is located where the application loads it.

### Frontend cannot reach the backend

Check that the backend is running, the frontend uses the correct API base URL, and the backend CORS configuration permits the frontend origin.

## 🔐 Security and Production Considerations

- Keep credentials and environment files out of version control.
- Validate incoming API requests.
- Restrict development-only endpoints.
- Configure production CORS and error handling.
- Review npm audit findings and address applicable vulnerabilities.
- Use appropriate database-level concurrency controls for multi-instance deployments.
- Protect email services and database credentials.
- Verify production environment variables and deployment settings.

## 🧪 Test Scenarios

The test suite is intended to cover scenarios such as:

1. Successful booking creation.
2. Mentor operating-hours enforcement.
3. Rejection of unavailable time slots.
4. Prevention of overlapping bookings.
5. Allowance of valid consecutive bookings.
6. Daily booking-limit enforcement.
7. Assignment to another eligible mentor when necessary.
8. Least-loaded mentor selection.
9. Deterministic mentor tie-breaking.
10. Parent timezone conversion to UTC.
11. Mentor local-time calculation.
12. Correct UTC timestamp storage.
13. Meeting link generation.
14. Booking confirmation with both local times.
15. Acceptance of valid IANA timezones.
16. Rejection of invalid timezones.
17. Daylight-saving transition handling.
18. Handling of slots crossing UTC midnight.
19. Rejection of unsupported local-time intervals.
20. Concurrent booking conflict prevention.
21. Enforcement of mentor daily capacity.
22. Verification of seeded mentor count.
23. Booking retrieval with populated mentor details.

These scenarios describe intended coverage and are not a claim that every test currently passes.

## 📡 REST API Documentation

The following endpoints describe the intended API. Verify route paths, request fields, and response formats against the current backend implementation.

### 1. Get Mentors

**Method:** `GET`

```http
/api/mentors
```

Returns active mentor profiles, potentially including timezone, subjects, availability, ratings, and biography.

### 2. Get Available Slots

**Method:** `GET`

```http
/api/slots?date=2026-10-12&timezone=America/New_York
```

Query parameters:

- `date`: Requested date in `YYYY-MM-DD` format.
- `timezone`: Valid IANA timezone identifier.

Returns available booking intervals and related availability information, according to the implemented response schema.

### 3. Create a Booking

**Method:** `POST`

```http
/api/bookings
```

Header:

```http
Content-Type: application/json
```

Example request body:

```json
{
  "parentName": "Sarah Miller",
  "parentEmail": "sarah@example.com",
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

The field names above are illustrative; confirm that they match the actual API validation.

A successful response may include the assigned mentor, UTC start and end times, parent and mentor local times, and meeting link.

An HTTP `409 Conflict` may be returned when a booking cannot be accommodated, if implemented by the server.

### 4. Get Booking by ID

**Method:** `GET`

```http
/api/bookings/:id
```

Retrieves booking information by its identifier, potentially including the associated mentor profile.

### 5. Development Reset and Reseed

**Method:** `POST`

```http
/api/reset-seed
```

This is a development helper only if the route is implemented in the current codebase.

**Security warning:** A database-reset endpoint must not be publicly accessible in production without appropriate authorization and safeguards.

## 📂 Project Structure

```text
CodeYoung-Trial-Booking/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── scripts/
│   │   └── server.js
│   ├── test/
│   └── package.json
├── package.json
├── README.md
├── .gitignore
├── .env.example
└── TRANSCRIPT.md
```

This is a high-level overview. The actual repository may contain additional files or a slightly different structure.

## 🤖 AI Development Transcript

The repository includes `TRANSCRIPT.md`, which documents the AI-assisted development process, including prompts, responses, troubleshooting, and debugging discussions.

Refer to that file for the development transcript accompanying this project.

## 📌 Project Overview

The CodeYoung Trial Class Booking Platform demonstrates a full-stack scheduling workflow involving mentor assignment, timezone-aware availability, booking conflict prevention, database persistence, and calendar integration.

The project is intended to demonstrate practical full-stack development, API design, time and date handling, and testing of booking workflows.

---

**Developed as a full-stack booking platform project.**

