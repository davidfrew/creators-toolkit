@echo off
echo Setting up Creator's Swiss Army Knife...

echo Installing backend dependencies...
cd backend
python -m pip install -r requirements.txt

echo Installing frontend dependencies...
cd ../frontend
npm install

echo Setup complete! To start the development servers:
echo 1. Backend: cd backend && uvicorn main:app --reload
echo 2. Frontend: cd frontend && npm run dev
