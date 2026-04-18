# Smartphone Store

Full-stack smartphone store project built with Vue 3, Vite, Express, and MySQL.

## Stack

- Frontend: Vue 3, Vite, Pinia, Vue Router
- Backend: Express, MySQL, JWT auth
- Features: auth, products, cart, checkout, profile, admin dashboard

## Local setup

### Backend

1. Copy `.env.example` to `.env`
2. Fill in your MySQL credentials and JWT secrets
3. Install dependencies:

```bash
npm install
```

4. Start the backend:

```bash
npm run dev
```

### Frontend

1. Copy `frontend/smartphone-frontend/.env.example` to `frontend/smartphone-frontend/.env`
2. Set:

```env
VITE_API_URL=http://localhost:3000/api
```

3. Install and run:

```bash
cd frontend/smartphone-frontend
npm install
npm run dev
```

## Deployment

Use environment variables instead of hardcoded URLs.

### Frontend env

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend env

Set the same values as `.env.example`, but with your production DB credentials and strong JWT secrets.

## CV-ready deployment recommendation

- Frontend: Vercel
- Backend: Railway, Render, or VPS
- Database: Railway MySQL or VPS MySQL

## What to show on your CV

- Live demo link
- GitHub repository
- Short feature list
- Admin and user flows
- Tech stack
