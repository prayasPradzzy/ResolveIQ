# Complaint Intelligence Dashboard - Project Structure

## High-level layout

- frontend: React + Tailwind UI application
- backend: Express + SQLite API server

## Backend structure

- backend/src/server.js: Server entry point (start app, load env)
- backend/src/app.js: Express app setup (middleware, route mounting)
- backend/src/db.js: SQLite initialization and connection bootstrap
- backend/src/config/database.js: Database config helpers
- backend/src/routes/index.js: Central route registration
- backend/src/routes/complaintRoutes.js: Complaint-related API endpoints
- backend/src/routes/healthRoutes.js: Health/status endpoint routes
- backend/src/controllers/complaintController.js: HTTP handlers for complaint endpoints
- backend/src/controllers/healthController.js: HTTP handlers for health endpoints
- backend/src/services/complaintService.js: Complaint business logic
- backend/src/services/aiService.js: AI provider integration logic
- backend/src/models/complaintModel.js: Data access for complaints table
- backend/src/middleware/errorHandler.js: Centralized API error handling
- backend/data/complaints.db: SQLite database file

## Frontend structure

- frontend/src/main.jsx: React application bootstrap
- frontend/src/App.jsx: Top-level app composition point
- frontend/src/index.css: Global styles and Tailwind directives
- frontend/src/pages/DashboardPage.jsx: Main dashboard page
- frontend/src/pages/ComplaintsPage.jsx: Complaint list/details page
- frontend/src/components/layout/AppShell.jsx: Shared layout wrapper
- frontend/src/components/layout/TopBar.jsx: Header and top navigation
- frontend/src/components/common/StatCard.jsx: Reusable KPI card component
- frontend/src/components/common/LoadingState.jsx: Shared loading UI
- frontend/src/components/charts/TrendChart.jsx: Trend visualization component
- frontend/src/services/apiClient.js: API calls to backend
- frontend/src/hooks/useComplaints.js: Complaint data fetching state hook
- frontend/src/utils/formatters.js: Formatting helper utilities
- frontend/src/assets/: Static images and icons
