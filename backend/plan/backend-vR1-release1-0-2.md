# Backend Plan — R1 / Release 1.0.2

**Execution mode:** Cloud with server (AWS CloudFormation With Server)  
**Frontend version:** R1  
**Release:** 1.0.2

## Summary

Meridian Todo is a React SPA that manages **tasks** and **projects** with client-side filtering (Today, Inbox, Upcoming, Projects). Data is currently persisted in `localStorage` via `todoStore.ts`. This plan replaces local persistence with a PostgreSQL-backed Express API on ECS Fargate behind an ALB. **No auth surfaces exist in the UI** — Cognito is omitted.

## Data source inventory

| Source | Entity | Fields | Used by | Mutations |
|--------|--------|--------|---------|-----------|
| `todoStore.ts` SEED + localStorage | Task | id, title, notes?, completed, completedAt?, createdAt, dueDate?, scheduledDate?, projectId?, committedToToday, priority | All app pages via `useTodos` | add, toggle complete, toggle today commit, update, delete |
| `todoStore.ts` SEED + localStorage | Project | id, name, color, createdAt | ProjectsPage, ProjectDetailPage, TaskItem | add, delete (orphans tasks) |

## UI surface → API map

| Screen | Reads | Writes |
|--------|-------|--------|
| `/app/today` | tasks (filter: committedToToday or scheduledDate=today) | addTask (committed), toggleComplete, toggleTodayCommit, deleteTask |
| `/app/inbox` | tasks (no project, not committed, no scheduledDate) | addTask, toggle*, delete |
| `/app/upcoming` | tasks (future scheduled/due) | toggle*, delete |
| `/app/projects` | projects list | addProject |
| `/app/projects/:id` | project + scoped tasks | addTask, deleteProject, toggle*, delete |

## APIs

Base path: `/api`

### Tasks

| Method | Path | Purpose | Request | Response |
|--------|------|---------|---------|----------|
| GET | `/api/tasks` | List all tasks | — | `Task[]` |
| POST | `/api/tasks` | Create task | `{ title, projectId?, dueDate?, scheduledDate?, committedToToday?, priority? }` | `Task` |
| PATCH | `/api/tasks/:id` | Update task (partial) | `Partial<Task>` | `Task` |
| DELETE | `/api/tasks/:id` | Delete task | — | `204` |

### Projects

| Method | Path | Purpose | Request | Response |
|--------|------|---------|---------|----------|
| GET | `/api/projects` | List projects | — | `Project[]` |
| POST | `/api/projects` | Create project | `{ name, color }` | `Project` |
| DELETE | `/api/projects/:id` | Delete project (orphan tasks) | — | `204` |

### Health

| Method | Path | Purpose | Response |
|--------|------|---------|----------|
| GET | `/health` | ALB health check | `{ status: "ok" }` |

### Error format

```json
{ "error": { "message": "Human-readable message", "code": "OPTIONAL_CODE" } }
```

Status codes: `400` validation, `404` not found, `500` server error.

## Data contracts

JSON keys use **camelCase** matching `src/types/todo.ts`:

- `TaskPriority`: `'none' | 'high' | 'medium' | 'low'`
- Dates: ISO-8601 strings (`createdAt`, `completedAt`) or `YYYY-MM-DD` (`dueDate`, `scheduledDate`)

## Auth

None. UI has no login/signup/protected routes. Assumption documented — no Cognito.

## Database (RDS PostgreSQL)

### Tables

**projects**
- `id` VARCHAR PRIMARY KEY
- `name` VARCHAR NOT NULL
- `color` VARCHAR NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL

**tasks**
- `id` VARCHAR PRIMARY KEY
- `title` VARCHAR NOT NULL
- `notes` TEXT
- `completed` BOOLEAN NOT NULL DEFAULT false
- `completed_at` TIMESTAMPTZ
- `created_at` TIMESTAMPTZ NOT NULL
- `due_date` DATE
- `scheduled_date` DATE
- `project_id` VARCHAR REFERENCES projects(id) ON DELETE SET NULL
- `committed_to_today` BOOLEAN NOT NULL DEFAULT false
- `priority` VARCHAR NOT NULL DEFAULT 'none'

### Seed

Port `SEED_TASKS` and `SEED_PROJECTS` from `todoStore.ts` into `backend/src/db/seed.ts`.

## Deployment considerations

- **Stack:** ECS Fargate + ALB + RDS PostgreSQL in `backend/cloudformation-template.yaml`
- **Frontend hosting:** S3 + CloudFront in `Frontend/cloudformation-template.yaml` (Step 3)
- **Env vars (names only):**
  - Backend runtime: `DATABASE_URL`, `PORT`, `CORS_ORIGINS`
  - Frontend build: `VITE_API_BASE_URL` (from ALB output after deploy)
- **CORS:** Backend must allow CloudFront origin (set via `CorsOrigins` parameter)

## Unified deploy script

Root `deploy.sh` contract (Launchpad runs after materializing env files):

| Phase | Action |
|-------|--------|
| A | `docker build` + `docker push` to ECR; patch `EcrImageUri` in `backend/parameters.json` |
| B | Backend CFN create/update with `recover_failed_stack` |
| C | Frontend CFN create/update (parallel with B) |
| D | Post-deploy: capture `ApiUrl`, set `VITE_API_BASE_URL`, `npm run build`, `s3 sync`, CloudFront invalidation |

**Control env vars:** `INFRA_STACK`, `DEPLOY_ENVIRONMENT`, `BACKEND_STACK_NAME`, `FRONTEND_STACK_NAME`  
**Materialized files:** `backend/parameters.json`, `Frontend/parameters.json`, `backend/.env`, `Frontend/.env`  
**Recovery:** Delete `ROLLBACK_COMPLETE` stacks before recreate; log `describe-stack-events` on failure.

## Frontend wire-up

1. Add `src/lib/todoApi.ts` — fetch wrappers when `VITE_API_BASE_URL` is set.
2. Update `useTodos.tsx` — load from API on mount; mutations call API with optimistic local state.
3. Fallback to `localStorage` when `VITE_API_BASE_URL` is unset (local dev).
4. Add `Frontend/.env.example` with `VITE_API_BASE_URL=<redacted>`.

## Integration steps

1. Deploy backend stack; run migrations + seed against RDS.
2. Deploy frontend stack; note CloudFront URL.
3. Set `VITE_API_BASE_URL` to ALB `ApiUrl`; rebuild and sync SPA to S3.
4. Update `CorsOrigins` on backend to include CloudFront domain.
5. Smoke-test each screen against live API.
