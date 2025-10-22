# DivineMind Backend (Minimal)

This is a minimal Express backend used for development and testing.

Endpoints:
- GET /api/health - health check
- POST /api/signup - create a user
- POST /api/login - login and receive a token
- POST /api/mood - submit mood (requires token)
- GET /api/moods - list mood submissions

Run locally:

```bash
cd backend
npm install
npm run dev
```

This backend uses in-memory storage and is not suitable for production.
