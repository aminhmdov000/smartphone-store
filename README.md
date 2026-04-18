# Smartphone Store

Smartphone Store is a full-stack e-commerce project for browsing smartphones, managing a cart, placing orders, and handling basic admin operations.

The project uses a Vue 3 frontend and an Express + MySQL backend.

## Tech Stack

- Frontend: Vue 3, Vite, Pinia, Vue Router
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT access and refresh tokens
- File upload: Multer

## Features

- User registration and login
- Product listing and product detail pages
- Product search, filters, and sorting
- Cart management
- Checkout and order history
- Profile management
- Admin dashboard for products, users, and orders
- Image upload support for products

## Project Structure

```text
smartphone-store/
├── be/                                # Express backend
├── frontend/smartphone-frontend/      # Vue frontend
├── .env.example
└── README.md
```

## Environment Variables

### Backend

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartphone_store
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Frontend

Create a `.env` file inside `frontend/smartphone-frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Installation

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend/smartphone-frontend
npm install
```

## Running the Project

### Start the backend

From the project root:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### Start the frontend

From `frontend/smartphone-frontend`:

```bash
npm run dev
```

The frontend will run on the local Vite development server.

## Build

To build the frontend for production:

```bash
cd frontend/smartphone-frontend
npm run build
```

## API Base URL

The frontend reads the API URL from `VITE_API_URL`.

For local development:

```env
VITE_API_URL=http://localhost:3000/api
```

For production:

```env
VITE_API_URL=https://your-domain.com/api
```

## Notes

- Make sure your MySQL database exists before starting the backend.
- Keep `.env` files private and do not commit them.
- Update JWT secrets before deploying to production.

## Deployment

This project can be deployed with:

- Frontend: Vercel or Netlify
- Backend: Railway, Render, or VPS
- Database: MySQL on Railway, VPS, or another hosted provider
