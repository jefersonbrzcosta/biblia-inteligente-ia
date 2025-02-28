#!/bin/bash

set -e

echo "🚀 Starting Bible AI Service..."


if ! docker info > /dev/null 2>&1; then
    echo "🐳 Docker is not running. Opening Docker Desktop..."
    open -a "Docker"


    echo "⏳ Waiting for Docker to start..."
    while ! docker info > /dev/null 2>&1; do
        sleep 2
    done
    echo "✅ Docker is now running!"
else
    echo "✅ Docker is already running!"
fi


echo "🐘 Starting PostgreSQL database..."
docker-compose up -d db


echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec bible_ai_db pg_isready -U user -d bible_ai_db > /dev/null 2>&1; do
  sleep 2
done
echo "✅ Database is ready!"


echo "🔄 Running database migrations..."
docker exec -it bible_ai_db psql -U user -d bible_ai_db -c "
ALTER TABLE questions ADD COLUMN IF NOT EXISTS answer_embedding vector(384);
"


echo "📦 Installing backend dependencies..."
cd backend
npm install


echo "🖥 Opening a new terminal for the backend logs..."
osascript -e 'tell application "Terminal" to do script "cd '$PWD' && npm run dev"'


echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🌐 Starting frontend..."
npm run dev

echo "✅ Bible AI Service is running! Visit http://localhost:5173"
