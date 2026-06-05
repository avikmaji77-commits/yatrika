# travel-place-recommendation

AI-powered Travel Place Recommendation System with beautiful UI, smart destination categories, trending locations, hidden gems, and personalized travel exploration features.
## Quick start (Docker)
This repository includes a Docker setup to run the frontend and backend together.

Build and start the services:

```bash
# from repo root
docker-compose up -d --build
```

- Frontend will be available on http://localhost:5173 (served via nginx)
- Backend will be available on http://localhost:5000

Stop services:

```bash
docker-compose down
```

## Local dev (frontend + backend)
- Backend:

```powershell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r backend\\requirements.txt
python backend\\app.py
```

- Frontend:

```bash
npm install
npm run dev
```

For further details see [backend/README.md](backend/README.md).
