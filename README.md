<<<<<<< HEAD
# Recipe Finder

A web application that helps you find recipes based on the ingredients you have available.

## Features

- Search and select ingredients from a comprehensive list
- View recipes that can be made with your available ingredients
- Beautiful and responsive UI built with React and Chakra UI
- Recipe matching algorithm that suggests recipes even with partial ingredient matches

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Use the search bar to find ingredients or browse the available ingredients list
2. Click on ingredients to add them to your selected ingredients
3. View matching recipes that you can make with your selected ingredients
4. Click on a recipe to view its details

## Technologies Used

- React
- TypeScript
- Vite
- Chakra UI
- Unsplash (for recipe images)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
=======
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
Visit http://127.0.0.1:8000

## Frontend
```
npm install --legacy-peer-deps
```
```
npm run dev
```
Visit http://localhost:5173/
>>>>>>> 47755f4c86f872d47568151c351642b9f9456202
