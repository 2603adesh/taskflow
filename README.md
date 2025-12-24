# TaskFlow — Full-Stack Task Management App

TaskFlow is a  task manager built with a React + Express API and PostgreSQL.  
It supports secure authentication, protected routes, and user-scoped task CRUD.


## Features
- JWT authentication (register/login)
- Protected routes (frontend + backend)
- Task CRUD (create, view, update status, delete)
- User-scoped data (each user only sees their own tasks)
- Clean backend routing structure (`routes/auth`, `routes/tasks`)
- Responsive UI with Tailwind + reusable layout + navbar

## Tech Stack
**Frontend:** React, Vite, TailwindCSS, Axios, React Router  
**Backend:** Node.js, Express, PostgreSQL, bcryptjs, jsonwebtoken  
**Deployment:** Vercel (frontend), Render (API + PostgreSQL)

## API Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /tasks` (auth)
- `POST /tasks` (auth)
- `PUT /tasks/:id` (auth)
- `DELETE /tasks/:id` (auth)

## Local Setup

### 1) Clone + install
```
git clone https://github.com/2603adesh/taskflow
cd taskflow

Backend Setup
cd ../frontend
npm install


Create frontend/.env:

VITE_API_URL=http://localhost:4000


Run frontend:

npm run dev


Frontend runs at:
http://localhost:5173
```

🗄 Database Schema

**users:**

id

name

email

password_hash

created_at

**tasks:**

id

user_id

title

description

status

priority

due_date

created_at

## What I Learned

Implemented JWT-based authentication and authorization

Built user-scoped REST APIs with PostgreSQL

Managed CORS and environment variables for production

Deployed a full-stack application using Render and Vercel

Structured a scalable Express backend with modular routes

## Future Improvements

Task filters (status, priority)

Due date reminders

Drag-and-drop task ordering

UI animations and accessibility improvements
