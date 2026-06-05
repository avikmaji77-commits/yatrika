# Yatrika Frontend-Backend Integration Summary

## ✅ What's Been Set Up

Your Yatrika project is now fully configured to run with frontend and backend properly connected on a single local server.

### System Status
- Python 3.14.5 ✅ Verified
- Node.js v24.16.0 ✅ Verified  
- npm ✅ Available
- Project Structure ✅ Complete

---

## 📁 New Files Created

### Documentation
1. **LOCAL_SERVER_SETUP.md** - Complete setup guide with all details
2. **QUICK_START.md** - Quick reference for commands
3. **SETUP_COMPLETE.md** - This setup status document

### Startup Scripts
1. **START.bat** - Interactive menu to run everything (Windows)
2. **setup.bat** - Automated setup script (Windows)
3. **setup.sh** - Automated setup script (Mac/Linux)

### Code Files
1. **src/lib/api-service.ts** - Complete API client module with all endpoints
2. **EXAMPLE_API_COMPONENT.tsx** - Example React component showing API integration

---

## 🔗 Frontend-Backend Connection - How It Works

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR BROWSER                            │
│                  http://localhost:5173                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  React App (Frontend)                                        │
│  ├── Components (UI)                                         │
│  ├── Routes                                                  │
│  └── API Calls: fetch('/api/destinations')                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Vite Dev Server Proxy                                       │
│  /api/* → http://localhost:5000/api/*                       │
│  (Configured in vite.config.ts)                              │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Flask Backend (Port 5000)                                   │
│  ├── Route Handlers                                          │
│  ├── Database Queries                                        │
│  ├── CORS Enabled                                            │
│  └── JSON Responses                                          │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    SQLite Database                           │
│                  backend/data.db                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow
```
1. User clicks button in React component
   ↓
2. Component calls: fetch('/api/destinations')
   ↓
3. Vite proxy intercepts request
   ↓
4. Request forwarded to: http://localhost:5000/api/destinations
   ↓
5. Flask receives request and processes
   ↓
6. Database query executed
   ↓
7. JSON response sent back
   ↓
8. Browser receives response (same-origin, no CORS issues)
   ↓
9. React component updates with data
```

---

## 🚀 To Run Your Project

### One-Click Setup (Windows)
```powershell
START.bat
# Choose option 1 to setup
# Then choose option 4 to start both servers
```

### Manual Setup
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows or source venv/bin/activate on Mac/Linux
pip install -r requirements.txt
python app.py
# Backend runs on http://localhost:5000

# Terminal 2 - Frontend  
cd [project root]
npm install  # First time only
npm run dev
# Frontend runs on http://localhost:5173

# Open browser to http://localhost:5173
```

---

## 📡 API Endpoints Available

All endpoints are pre-configured in the backend:

### Read Endpoints (GET)
```
GET /health
  → Returns: {"status": "ok", "destinations_loaded": X}

GET /api/meta
  → Returns: {"categories": [...], "seasons": [...], "budgets": [...]}

GET /api/destinations
  → Query params: category, budget, season, search, min_rating, max_rating, limit, offset
  → Returns: {"data": [...], "total": X, "limit": X, "offset": X}

GET /api/destinations/<id>
  → Returns: Single destination object

GET /api/stats
  → Returns: Statistics data

GET /api/trending
  → Returns: {"data": [...]}
```

### Write Endpoints (POST)
```
POST /api/recommend
  → Body: {"preferences": {...}}
  → Returns: {"data": [...]}

POST /api/search
  → Body: {"query": "..."}
  → Returns: {"data": [...]}

POST /api/chat
  → Body: {"message": "..."}
  → Returns: {"response": "..."}

POST /api/export
  → Exports destination data

POST /api/import
  → Imports destination data
```

---

## 💻 Using the API in React Components

### Method 1: Using the API Service Module (Recommended)

Create the api-service.ts file (already done for you):
```typescript
// src/lib/api-service.ts - Already created!

// In your component:
import { getDestinations, getTrending, getMeta } from '@/lib/api-service'

export function MyComponent() {
  const [destinations, setDestinations] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getDestinations({ 
        limit: 10,
        category: 'Trending'
      })
      setDestinations(response.data)
    }
    fetchData()
  }, [])
  
  return (
    <div>
      {destinations.map(dest => (
        <div key={dest.id}>{dest.name}</div>
      ))}
    </div>
  )
}
```

### Method 2: Direct Fetch
```typescript
// Simple alternative without the service module
useEffect(() => {
  fetch('/api/destinations?limit=10')
    .then(res => res.json())
    .then(data => setDestinations(data.data))
}, [])
```

---

## ✅ Configuration Already Done for You

### vite.config.ts
```typescript
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',  // ✅ Configured
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
```

### backend/.env
```
FLASK_ENV=development
FLASK_DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5000  # ✅ Includes localhost:5173
DATABASE_URL=sqlite:///./data.db
```

No additional configuration needed!

---

## 🧪 Testing Your Setup

### 1. Check Backend
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{"status": "ok", "destinations_loaded": 150}
```

### 2. Check API
```bash
curl "http://localhost:5000/api/destinations?limit=5"
```
Expected response: JSON array with 5 destinations

### 3. Check Frontend
- Open http://localhost:5173
- Press F12 to open DevTools
- Network tab should show calls to `/api/destinations`
- Console should have no errors

---

## 🎯 What to Do Next

### Step 1: Start Your Servers
Use START.bat or follow manual setup in QUICK_START.md

### Step 2: Verify Connection
- Backend: http://localhost:5000 (should respond to /health)
- Frontend: http://localhost:5173 (should load your React app)
- Check browser console (F12) for any errors

### Step 3: Integrate Components
1. Look at your existing components (e.g., Destination.tsx)
2. See example in EXAMPLE_API_COMPONENT.tsx
3. Replace hardcoded data with API calls using api-service.ts
4. Test in browser

### Step 4: Build Features
Now that frontend and backend are connected, you can:
- Build real features using live data
- Create filters and searches
- Implement user interactions
- Add more API endpoints as needed

---

## 📊 Example: Converting a Component

### Before (Hardcoded Data)
```typescript
const places: Place[] = [
  {
    name: "Tawang",
    region: "Arunachal Pradesh",
    rating: 4.7,
    category: "Hidden Gems",
  },
  // ... more hardcoded data
]

export function Destination() {
  return (
    <div>
      {places.map(place => (
        <div key={place.name}>{place.name}</div>
      ))}
    </div>
  )
}
```

### After (Using API)
```typescript
import { getDestinations } from '@/lib/api-service'

export function Destination() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    getDestinations({ limit: 20 })
      .then(res => setDestinations(res.data))
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {destinations.map(dest => (
        <div key={dest.id}>{dest.name}</div>
      ))}
    </div>
  )
}
```

---

## 🔧 Maintenance Commands

### Backend
```bash
cd backend
python app.py                              # Start backend
FLASK_DEBUG=1 python app.py               # Start with debug
python -m pytest tests/                   # Run tests
pip install -r requirements.txt           # Update dependencies
```

### Frontend
```bash
npm run dev                               # Development server
npm run build                             # Production build
npm run lint                              # Check code quality
npm run format                            # Format code
```

### Database
```bash
# Reset database
rm backend/data.db

# Reinitialize
python -c "from backend.app_complete import init_db, ensure_database_seeded; init_db(); ensure_database_seeded()"
```

---

## 🚀 Deployment

When ready to deploy:

### Frontend Build
```bash
npm run build
# Creates optimized build in dist/
```

### Backend Production
```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
python backend/app.py
```

Or use Docker:
```bash
docker-compose up -d --build
```

---

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Kill process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess \| Stop-Process -Force` |
| CORS error | Check CORS_ORIGINS in backend/.env includes your port |
| API not responding | Check backend is running and no errors in terminal |
| Module not found | Reinstall: `pip install -r requirements.txt` (backend) or `npm install` (frontend) |
| Database error | Reset: `rm backend/data.db` then reinitialize |
| Hot reload not working | Restart frontend with `npm run dev` |

---

## ✨ Summary

Your Yatrika project now has:

✅ **Frontend & Backend Running Together** - Single localhost with proxy
✅ **Complete API Configuration** - vite.config.ts proxy already set
✅ **API Client Module** - src/lib/api-service.ts with all endpoints
✅ **Example Component** - Shows how to integrate with API
✅ **Startup Scripts** - START.bat for easy setup
✅ **Complete Documentation** - LOCAL_SERVER_SETUP.md, QUICK_START.md
✅ **All Endpoints Ready** - 11 endpoints available in backend
✅ **Database Initialized** - SQLite with sample data

You're ready to build! 🎉

---

## 📖 Files to Read

1. **QUICK_START.md** - Start here for 5-minute setup
2. **LOCAL_SERVER_SETUP.md** - Detailed guide with all info
3. **src/lib/api-service.ts** - API client functions
4. **EXAMPLE_API_COMPONENT.tsx** - Complete example
5. **backend/app_complete.py** - Backend source code

---

**Happy coding! Your Yatrika app is ready to run.** 🚀
