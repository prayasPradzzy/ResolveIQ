# AI Complaint Intelligence Dashboard

A hackathon-ready full-stack MVP that turns raw customer complaints into structured insights, suggested responses, duplicate detection, and alert signals.

## What This Project Does

- Accepts complaint text from a web UI
- Runs AI analysis for:
  - classification (category, subcategory, severity, sentiment, priority)
  - entity extraction
  - summary generation
  - response draft generation
- Detects likely duplicate complaints using embeddings + cosine similarity
- Flags high-risk complaints via alert rules
- Displays everything in a modern dashboard with detail panel and filters

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite
- AI Providers: OpenAI or Gemini (configurable)

## Project Structure

- frontend: React application (dashboard + submit flows)
- backend: Express API (routes, controllers, services, SQLite model layer)
- backend/data/complaints.db: local SQLite database file

## Core Features

### 1. Complaint Pipeline

On complaint submission (`POST /complaints`), the backend:

1. cleans text
2. classifies complaint
3. extracts entities
4. generates summary
5. generates response draft
6. computes duplicate similarity and group assignment
7. stores complaint, entities, and response

Returns structured payload for UI rendering.

### 2. Dashboard APIs

- `GET /complaints`
  - optional filters: `severity`, `category`, `status`
- `GET /complaints/:id`
  - full complaint record + entities + response
- `GET /alerts`
  - rule-based flagged complaints with reason
- `GET /health`
  - basic API health check

### 3. Duplicate Detection

- Generates embedding for incoming complaint
- Compares against prior stored embeddings
- Uses cosine similarity
- If similarity is above threshold (default `0.85`), assigns same `duplicate_group_id`

### 4. Alert Rules

A complaint is flagged when:

- `severity = critical`, or
- `sentiment = angry` and `priority_score` is high

The API returns a human-readable alert reason for each flagged item.

## Frontend Experience

- Sidebar navigation with state-based page switching (no routing dependency)
- Submit page with loading state and result cards
- Dashboard table with server-driven filters
- Clickable rows with complaint detail panel
- Alert panel with red-highlighted cards and reasons
- Lightweight UX polish:
  - loading skeletons
  - smooth transitions
  - clean spacing and typography
  - inline SVG icons

## Getting Started

## Prerequisites

- Node.js 18+
- npm

## Install

From workspace root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment

Copy `backend/.env.example` to `backend/.env` and set keys.

Key variables:

- `PORT`
- `SQLITE_DB_FILE`
- `AI_PROVIDER` (`openai` or `gemini`)
- `OPENAI_API_KEY` (if using OpenAI)
- `GEMINI_API_KEY` (if using Gemini)

## Run

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Build

Frontend production build:

```bash
cd frontend
npm run build
```

## API Quick Examples

Create complaint:

```http
POST /complaints
Content-Type: application/json

{
  "text": "I was charged twice for my internet bill this month."
}
```

List complaints with filters:

```http
GET /complaints?severity=high&category=loan
```

Get detail:

```http
GET /complaints/1
```

Get alerts:

```http
GET /alerts
```

## Demo Script (Suggested)

1. Submit a complaint from the Submit page
2. Show AI outputs in the result card set
3. Open Dashboard and show new complaint in table
4. Click the row to open detail panel
5. Show duplicate grouping and alert behavior with a second similar/critical complaint

## Notes

- The Send action in detail panel is currently mocked for demo purposes.
- SQLite is used intentionally for speed and hackathon simplicity.
- Architecture is modular but intentionally minimal (no ORM, no vector database).
