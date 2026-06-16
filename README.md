# Naved's Developer Portfolio

Modern full-stack portfolio for Mohmad Naved, built to showcase projects, skills, resume, contact messages, and an admin-managed project CMS.

Live demo: https://dev-naved-portfolio-03.vercel.app/

## Features

- Responsive React portfolio with home, about, projects, project detail, contact, and auth pages.
- Admin dashboard for creating, updating, publishing, and deleting portfolio projects.
- Contact form with frontend and backend validation plus queued persistence.
- JWT-based public user and admin authentication.
- MongoDB/Mongoose models for projects, profiles, users, and contact messages.
- Cloudinary image uploads for project cover and gallery images.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, React Query, Framer Motion.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.
- UI: Radix UI primitives, lucide-react icons, custom layout components.
- Deployment: Vercel for frontend and Render for backend.

## Local Setup

Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

Install backend dependencies:

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Backend:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Use `CLIENT_URLS` as a comma-separated list if you need to allow more frontend origins in production.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run test
```

Backend:

```bash
npm run dev
npm start
npm run seed:admin
```
