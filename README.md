# FlikChat

A Q&A platform where every answer has its own real-time discussion room.

## Project Overview

FlikChat combines traditional Q&A with live discussion. Users post questions, receive answers, and each answer gets a dedicated chat room for real-time conversation between the author and community members.

This repository is a monorepo containing the frontend React application and backend Express API, structured for scalable feature development.

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- TanStack Query
- Zustand

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.io
- Zod Validation
- bcrypt
- CORS
- Helmet
- Morgan

### Dev Tools
- ESLint
- Prettier
- Husky
- lint-staged
- dotenv
- nodemon
- tsx

## Folder Structure

```
flikchat/
├── frontend/                 # React + Vite frontend
│   └── src/
│       ├── app/              # App root component
│       ├── components/       # Shared UI and layout components
│       ├── features/         # Feature-based modules
│       ├── pages/            # Route page components
│       ├── services/         # API and socket clients
│       ├── hooks/            # Custom React hooks
│       ├── context/          # React context providers
│       ├── store/            # Zustand stores
│       ├── types/            # TypeScript type definitions
│       ├── utils/            # Utility functions
│       ├── routes/           # React Router configuration
│       ├── assets/           # Static assets
│       └── styles/           # Global styles
├── backend/                  # Express API server
│   ├── prisma/               # Prisma schema and migrations
│   └── src/
│       ├── config/           # Environment and database config
│       ├── controllers/      # Shared controllers
│       ├── services/         # Shared services
│       ├── repositories/     # Data access layer
│       ├── routes/           # Route aggregation
│       ├── middleware/       # Express middleware
│       ├── sockets/          # Socket.io setup
│       ├── validators/       # Shared validators
│       ├── utils/            # Utility functions
│       ├── types/            # TypeScript type definitions
│       └── modules/          # Feature modules
│           ├── auth/
│           ├── users/
│           ├── questions/
│           ├── answers/
│           ├── discussions/
│           └── votes/
└── docs/                     # Project documentation
```

## Installation Steps

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (for database connection later)

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd FlikChat
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Update `backend/.env` with your PostgreSQL connection string and JWT secret.

5. Generate Prisma client (when database is ready):

```bash
npm run prisma:generate --workspace=backend
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend and backend concurrently |
| `npm run dev:frontend` | Start frontend dev server (port 5173) |
| `npm run dev:backend` | Start backend dev server (port 3001) |
| `npm run build` | Build both frontend and backend |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### Backend-specific

| Command | Description |
|---------|-------------|
| `npm run prisma:generate --workspace=backend` | Generate Prisma client |
| `npm run prisma:studio --workspace=backend` | Open Prisma Studio |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | Socket.io server URL |

## API Health Check

Once the backend is running, verify it with:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "FlikChat API is running"
}
```

## Next Steps

- Run Prisma migrations when PostgreSQL is configured
- Implement authentication module
- Build question and answer CRUD
- Wire up real-time discussion rooms per answer
- Add voting system

## License

Private — All rights reserved.
