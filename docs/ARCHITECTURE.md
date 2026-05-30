# FlikChat Architecture

## Overview

FlikChat follows a feature-based monorepo architecture with clear separation between frontend and backend concerns.

## Backend Architecture

### Layered Structure

```
Request → Routes → Controllers → Services → Repositories → Database
                ↓
           Validators (Zod)
                ↓
           Middleware (Auth, Error Handling)
```

### Module Pattern

Each domain module (`auth`, `users`, `questions`, etc.) contains:

- `*.controller.ts` — HTTP request handlers
- `*.service.ts` — Business logic
- `*.routes.ts` — Route definitions
- `*.validator.ts` — Zod validation schemas
- `*.types.ts` — TypeScript interfaces

### Real-time Layer

Socket.io handles real-time communication:

- `initializeSocket()` — Sets up the Socket.io server
- `registerSocketEvents()` — Registers connection, room, and message events

Each answer maps to a `ChatRoom` for live discussion.

## Frontend Architecture

### Feature-based Organization

```
pages/          → Route-level components
features/       → Domain-specific UI and logic
components/     → Shared reusable components
services/       → API and socket clients
store/          → Global state (Zustand)
context/        → React context providers
hooks/          → Custom hooks
```

### State Management

- **Zustand** — Auth state and user session
- **TanStack Query** — Server state, caching, and data fetching

### Routing

React Router v7 with browser router configuration in `routes/router.tsx`.

## Database Schema

Core entities:

- **User** — Platform users
- **Question** — User-submitted questions
- **Answer** — Responses to questions (each gets a chat room)
- **ChatRoom** — One-to-one with Answer
- **ChatMessage** — Messages within a chat room
- **Vote** — Upvote/downvote on answers

All models use UUID primary keys with `createdAt` and `updatedAt` timestamps.

## Authentication Flow (Planned)

1. User registers/logs in via `/api/auth`
2. Server returns JWT access token
3. Frontend stores token in Zustand + localStorage
4. Axios interceptor attaches token to requests
5. Socket.io connects with credentials

## Deployment Considerations

- Frontend: Static build served via CDN or reverse proxy
- Backend: Node.js process behind load balancer
- Database: Managed PostgreSQL
- WebSockets: Sticky sessions or Redis adapter for horizontal scaling
