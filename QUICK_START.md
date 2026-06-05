# Yatrika Quick Start Guide

## 🚀 Get Running in 5 Minutes

### For Windows Users:
```powershell
# 1. Run the setup helper
START.bat

# Choose option 1 to setup (installs all dependencies)
# Then follow the instructions to run both servers
```

### For Mac/Linux Users:
```bash
# 1. Make setup script executable
chmod +x setup.sh

# 2. Run setup
./setup.sh

# 3. Follow the instructions to run both servers
```

---

## 📋 Manual Setup (if you prefer)

### Terminal 1 - Backend Setup & Start:
```bash
# Navigate to backend
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
# ✓ Backend running on http://localhost:5000
```

### Terminal 2 - Frontend Setup & Start:
```bash
# In project root directory
npm install    # First time only

npm run dev
# ✓ Frontend running on http://localhost:5173
```

### Terminal 3 - Open Application:
```bash
# Open in browser
http://localhost:5173
```

---

## ✅ Verify Everything is Working

### Check Backend:
```bash
curl http://localhost:5000/health
# Expected: {"status": "ok", "destinations_loaded": X}
```

### Check API:
```bash
curl "http://localhost:5000/api/destinations?limit=5"
# Should return JSON with destinations array
```

### Check Frontend:
- Open http://localhost:5173
- Open Developer Console (F12)
- Check Network tab to see API calls

---

## 🔗 How Frontend-Backend Communication Works

```
Browser Request
    ↓
Vite Dev Server (Port 5173)
    ↓
Proxy Rule (vite.config.ts)
    ↓
Backend Server (Port 5000)
    ↓
Database Query
    ↓
JSON Response
    ↓
React Component Updates
```

### Example Flow:
1. React component calls: `fetch('/api/destinations')`
2. Vite intercepts and redirects to: `http://localhost:5000/api/destinations`
3. Backend processes the request
4. Response returns as JSON
5. Component updates with data

---

## 📁 Files You Created

1. **LOCAL_SERVER_SETUP.md** - Detailed documentation
2. **START.bat** - Interactive startup menu (Windows)
3. **setup.bat** - Automated setup script (Windows)
4. **setup.sh** - Automated setup script (Mac/Linux)
5. **src/lib/api-service.ts** - API client module
6. **EXAMPLE_API_COMPONENT.tsx** - Example component using API

---

## 🛠️ Useful Commands

### Backend
```bash
# Start backend
cd backend && python app.py

# Run with debug mode
FLASK_DEBUG=1 python app.py

# Initialize database
python -c "from app_complete import init_db, ensure_database_seeded; init_db(); ensure_database_seeded()"

# Run tests
pytest tests/
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Docker (if you prefer containers)
```bash
# Start both services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

---

## 🔌 Available API Endpoints

### GET Endpoints
```
GET /health                           # Health check
GET /api/meta                         # Metadata (categories, seasons, budgets)
GET /api/destinations                 # List all destinations (with filters)
GET /api/destinations/<id>            # Get specific destination
GET /api/stats                        # Get statistics
GET /api/trending                     # Get trending destinations
```

**Example with filters:**
```bash
curl "http://localhost:5000/api/destinations?category=Trending&limit=10&offset=0"
```

### POST Endpoints
```
POST /api/recommend                   # Get recommendations
POST /api/search                      # Search destinations
POST /api/chat                        # Chat with AI
POST /api/export                      # Export destinations
POST /api/import                      # Import destinations
```

**Example POST request:**
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "mountain"}'
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Mac/Linux - Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Make sure you're in the right directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS Errors
- Check that your port is in `backend/.env` CORS_ORIGINS
- Default includes: `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:5000`

### Database Connection Failed
```bash
# Reset database
rm backend/data.db

# Reinitialize
python -c "from backend.app_complete import init_db, ensure_database_seeded; init_db(); ensure_database_seeded()"
```

### API Not Responding
1. Check backend is running: `curl http://localhost:5000/health`
2. Check proxy is configured: Look at `vite.config.ts`
3. Check browser console for errors (F12)
4. Check backend terminal for error messages

---

## 📚 Using the API Service Module

The `src/lib/api-service.ts` module provides convenient functions to call the backend API:

```typescript
import { getDestinations, getTrending, getMeta } from '@/lib/api-service'

// Get destinations with filters
const data = await getDestinations({ 
  category: 'Trending',
  limit: 10 
})

// Get trending destinations
const trending = await getTrending()

// Get metadata
const meta = await getMeta()
```

See `EXAMPLE_API_COMPONENT.tsx` for a complete working example.

---

## 🎯 Next Steps

1. ✅ Get both servers running
2. ✅ Verify connectivity
3. ✅ Check browser console for any errors
4. ✅ Update components to use API (use api-service.ts)
5. ✅ Test all endpoints
6. ✅ Deploy when ready

---

## 📞 Need Help?

- **Backend Docs**: See `backend/README.md`
- **Full Setup Guide**: See `LOCAL_SERVER_SETUP.md`
- **Example Component**: See `EXAMPLE_API_COMPONENT.tsx`
- **API Module**: See `src/lib/api-service.ts`
- **Backend Code**: See `backend/app_complete.py`

---

## 🎉 You're All Set!

Your Yatrika project is now ready to run with frontend and backend on a single local server!

Enjoy building! 🚀
