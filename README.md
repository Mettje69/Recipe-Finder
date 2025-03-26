# Recipe-Finder app

This project consists of a FastAPI backend server and a React + TypeScript frontend application.

## Gotchas

The backend server runs on port 8000 and the frontend development server runs on port 5173. The frontend Vite server proxies API requests to the backend on port 8000.

Visit <http://localhost:5173> to view the application.

## Manual start

## Backend
```
pip install fastapi uvicorn
```
```
python -m uvicorn main:app --reload
```
http://127.0.0.1:8000

## Frontend
```
npm install --legacy-peer-deps
```
```
npm run dev
```
http://localhost:5173/
