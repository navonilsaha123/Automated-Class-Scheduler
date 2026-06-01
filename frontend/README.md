# Frontend

React frontend for institute onboarding and setup.

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

By default, the frontend calls `http://localhost:8080`.

If your backend runs elsewhere, create a `.env` file in `frontend` with:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_AI_API_BASE_URL=http://localhost:8000
```

## Current scope

- institute register and login
- department create, list, delete
- subject create, list, filter, edit, delete
- AI timetable generation
- timetable preview by department
- Excel download from the AI service
