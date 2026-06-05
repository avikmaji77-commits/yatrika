#!/bin/bash
# Yatrika Local Server Startup Script (Linux/Mac)
# This script starts both backend and frontend on a local server

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "======================================"
echo "  Yatrika Local Server Startup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found${NC}"

echo ""
echo -e "${BLUE}Setting up backend...${NC}"

# Install backend dependencies if needed
if [ ! -d "backend/venv" ] && [ ! -d "backend/.venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv
    source backend/venv/bin/activate
    pip install -q --upgrade pip
    pip install -q -r backend/requirements.txt
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend environment already exists${NC}"
fi

echo ""
echo -e "${BLUE}Setting up frontend...${NC}"

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install -q
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "======================================"
echo ""
echo "To start the servers:"
echo ""
echo "1. Open two terminal windows"
echo ""
echo "2. In Terminal 1 - Start Backend:"
echo "   cd backend && python app.py"
echo ""
echo "3. In Terminal 2 - Start Frontend:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "API will be available at http://localhost:5000"
echo "API proxy is configured in vite.config.ts"
echo ""
