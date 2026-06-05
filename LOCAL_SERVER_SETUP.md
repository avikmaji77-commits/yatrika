# Yatrika - Local Server Setup Guide

## Project Overview
This is a full-stack travel recommendation web application with:
- **Frontend**: React with TanStack Start, TypeScript, Tailwind CSS
- **Backend**: Python Flask REST API with SQLAlchemy ORM
- **Database**: SQLite (development)

## Backend API Endpoints
```
GET    /health                    - Health check
GET    /api/meta                  - Get metadata
GET    /api/destinations          - Get destinations with filters
GET    /api/destinations/<id>     - Get specific destination
GET    /api/stats                 - Get statistics
GET    /api/trending              - Get trending destinations
POST   /api/recommend             - Get recommendations based on preferences
POST   /api/search                - Search destinations
POST   /api/chat                  - Chat/AI interaction endpoint
POST   /api/export                - Export destinations
POST   /api/import                - Import destinations
```

## Quick Start - Option A: Run Both on Same Local Server

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn (frontend package manager)

### Step 1: Install Frontend Dependencies
```bash
cd c:\Users\avikm\OneDrive\Desktop\yatrika
npm install
# or
yarn install
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Initialize Backend Database
```bash
cd backend
python -c "from app_complete import app, init_db, ensure_database_seeded; init_db(); ensure_database_seeded(); print('Database initialized')"
```

### Step 4: Start Backend Server (Terminal 1)
```bash
cd backend
python app.py
# Backend will run on http://localhost:5000
```

### Step 5: Start Frontend Development Server (Terminal 2)
```bash
npm run dev
# Frontend will run on http://localhost:5173
# API requests will be proxied to http://localhost:5000
```

### Step 6: Access Your Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/meta (metadata endpoint)

---

## Quick Start - Option B: Docker Setup (One Container for Both)

### Prerequisites
- Docker and Docker Compose installed

### Step 1: Build and Run with Docker Compose
```bash
cd c:\Users\avikm\OneDrive\Desktop\yatrika
docker-compose up -d --build
```

### Step 2: Access Your Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Step 3: View Logs
```bash
docker-compose logs -f
```

### Step 4: Stop Services
```bash
docker-compose down
```

---

## Verifying Frontend-Backend Connection

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Backend is running"
}
```

### Check Meta Endpoint
```bash
curl http://localhost:5000/api/meta
```

### Get Destinations
```bash
curl "http://localhost:5000/api/destinations?limit=5"
```

---

## Environment Configuration

### Backend (.env in backend/ folder)
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///./data.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5000
API_MAX_RESULTS=50
API_DEFAULT_PAGE_SIZE=20
```

### Frontend Proxy (vite.config.ts)
- Configured to proxy `/api/*` to `http://localhost:5000`
- Automatic during `npm run dev`

---

## Frontend-Backend Integration

### How Requests Work

1. **Frontend makes request**: 
   ```javascript
   fetch('/api/destinations?limit=5')
   ```

2. **Vite proxy intercepts** (dev mode):
   ```
   /api/destinations → http://localhost:5000/api/destinations
   ```

3. **Backend processes** and returns response

### Connecting UI Components to API

Example of connecting a React component to the backend API:

```typescript
import { useEffect, useState } from 'react';

export function MyComponent() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/destinations?limit=10')
      .then(res => res.json())
      .then(data => {
        setDestinations(data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {destinations.map(dest => (
        <div key={dest.id}>{dest.name}</div>
      ))}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: CORS Error
- **Solution**: Backend has CORS enabled for localhost ports 3000, 5173, and 8080. If using different port, update `CORS_ORIGINS` in backend/.env

### Issue: Database not found
- **Solution**: Run the initialization command:
  ```bash
  python -c "from backend.app_complete import init_db, ensure_database_seeded; init_db(); ensure_database_seeded()"
  ```

### Issue: Port 5000 already in use
- **Solution**: Kill existing process:
  ```bash
  # Windows (PowerShell)
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  # Or change port in backend/app.py
  ```

### Issue: Port 5173 already in use
- **Solution**: Vite will automatically use next available port (5174, 5175, etc.)

### Issue: Module not found errors in backend
- **Solution**: Ensure you're in the correct directory and requirements are installed:
  ```bash
  cd backend
  pip install -r requirements.txt
  python app.py
  ```

---

## Development Workflow

1. **Backend Development**:
   - Edit files in `backend/` directory
   - Backend will auto-reload (if FLASK_DEBUG=True)
   - Test endpoints with curl or API client

2. **Frontend Development**:
   - Edit files in `src/` directory
   - Frontend will hot-reload automatically
   - Open DevTools console to check for API errors

3. **Database Changes**:
   - Models defined in `backend/models.py`
   - Migrations in `backend/database.py`
   - Reinitialize with init commands if needed

---

## Project Structure

```
yatrika/
├── backend/                  # Python Flask Backend
│   ├── app.py               # Entry point
│   ├── app_complete.py      # Full application with all endpoints
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Request/response schemas
│   ├── requirements.txt      # Python dependencies
│   └── tests/               # Backend tests
│
├── src/                     # React/TanStack Frontend
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI component library
│   │   └── yatrika/        # App-specific components
│   ├── routes/             # Route definitions
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   └── server.ts           # SSR configuration
│
├── vite.config.ts          # Vite configuration with API proxy
├── package.json            # Frontend dependencies
└── docker-compose.yml      # Docker services configuration
```

---

## Next Steps

1. ✅ Run backend: `python backend/app.py`
2. ✅ Run frontend: `npm run dev`
3. ✅ Open http://localhost:5173
4. ✅ Start integrating components with API endpoints
5. ✅ Deploy when ready

For detailed API documentation, check `/api/meta` endpoint or `backend/app_complete.py`
