# TaskForge - Project Management System

A full-stack project management application with a Node.js/Express backend and a Vite/React frontend.

## Features

- User authentication
- Project, task, and subtask management
- Notes on projects and tasks
- File uploads (multer)
- Healthcheck endpoint

## Tech Stack

**Backend**

- Node.js
- Express
- MongoDB with Mongoose

**Frontend**

- React
- Vite

## Project Structure

```
backend/     # Express API
frontend/    # React app
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB instance

## Getting Started

1. Install dependencies

```
npm install
```

2. Configure environment variables

Create a `.env` file in the project root and add the required values used by the backend (database URL, JWT secret, mail settings, etc.).

3. Run the backend

```
cd backend
npm run dev
```

4. Run the frontend

```
cd frontend
npm run dev
```

## Scripts

See `package.json` in the root, `backend/`, and `frontend/` for available scripts.

## API Endpoints

- `/api/v1/auth`
- `/api/v1/projects`
- `/api/v1/tasks`
- `/api/v1/notes`
- `/api/v1/healthcheck`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

MIT
