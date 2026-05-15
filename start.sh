#!/bin/bash
echo "╔═══════════════════════════════════════════╗"
echo "║     KlikTrade Shop — Rwanda Marketplace   ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Installing backend dependencies..."
cd "$(dirname "$0")/backend" && npm install --silent
echo "✓ Backend ready"

echo "Installing frontend dependencies..."
cd "$(dirname "$0")/frontend" && npm install --silent
echo "✓ Frontend ready"

echo ""
echo "Starting backend on :5000 ..."
cd "$(dirname "$0")/backend" && npm start &
BACK_PID=$!

sleep 2

echo "Starting frontend on :3000 ..."
cd "$(dirname "$0")/frontend" && npm run dev &
FRONT_PID=$!

echo ""
echo "════════════════════════════════════════════"
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:5000"
echo "  Admin:    http://localhost:3000/admin"
echo "════════════════════════════════════════════"
echo ""
wait
