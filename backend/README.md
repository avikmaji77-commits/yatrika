# Backend — Yatrika

This document explains how to run the backend locally, the API endpoints, Docker support, and recommended next steps.

## Prerequisites
- Python 3.10+ (this project used Python 3.14)
- Git (optional)
- Docker (optional for containerized runs)

## Create / activate the virtual environment (Windows PowerShell)
```powershell
# from project root
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## Install dependencies
```powershell
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

## Run the backend locally
```powershell
# from project root with venv activated
python backend\app.py
```

The Flask server listens on port `5000` by default and exposes the endpoints below.

## Docker
Build and run the backend container from the `backend` folder:
```powershell
cd backend
docker build -t yatrika-backend .

docker run --rm -p 5000:5000 yatrika-backend
```

The container starts the same Flask service on `http://127.0.0.1:5000`.

## API Endpoints
- `GET /health` — returns backend health and destination count.
- `GET /api/meta` — lists available `categories`, `seasons`, and `budgets`.
- `GET /api/destinations` — returns destinations. Optional query params: `category`, `budget`, `season`, `min_rating`, `max_rating`, `search`, `limit`, `offset`.
- `GET /api/destinations/<id>` — returns a single destination by `_id`.
- `GET /api/stats` — returns aggregated statistics for destination data.
- `GET /api/trending` — returns top destinations by season and category.
- `POST /api/recommend` — accepts JSON `{ "interests": [], "budget": "", "season": "" }` and returns ranked recommendations.
- `POST /api/search` — accepts JSON `{ "query": "..." }` and returns search results.
- `POST /api/chat` — accepts JSON `{ "message": "..." }` and returns an assistant `response`.
- `POST /api/export` — accepts JSON `{ "format": "json" | "csv", "fields": [...], "category": "...", "budget": "...", "season": "...", "min_rating": 4.0 }` and returns filtered export data.
- `POST /api/import` — imports records from `destinations.csv` into the SQLite database.

Example curl (native `curl.exe` on Windows):
```powershell
curl.exe http://127.0.0.1:5000/api/meta
curl.exe "http://127.0.0.1:5000/api/destinations?category=Beach&min_rating=4"
```

## Data source
The backend reads `backend/destinations.csv` and persists rows into SQLite via SQLAlchemy.

## Recommended next steps
- Add additional pytest coverage for `POST /api/search`, `POST /api/chat`, and `POST /api/export`.
- Add a production database migration workflow.
- Add environment-specific Docker compose if you need frontend/backend orchestration.

## Troubleshooting
- If `python` isn't found, confirm Python is installed and on PATH, or use the full interpreter path in `.venv\Scripts\python.exe`.
- If ports conflict (5000), stop the process using the port or set `port=` in `app.run(...)`.
- If Docker build fails, ensure the Docker daemon is running and the `backend` folder is selected as the build context.
