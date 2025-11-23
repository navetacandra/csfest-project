# Backend Development TODO

## Phase 1: Core Infrastructure Setup

- [-] Initialize and configure environment variables from `.env`.
- [-] Create a database connection module for SQLite.
- [-] Run the initial database migration from `database/migration.sql`.
- [-] Set up the main Express application in `index.ts`.
- [-] Add standard middleware: `express.json()`, CORS.
- [-] Create a utility for standardized API responses (success and error).
- [-] Implement a global error handling middleware.
- [-] Configure file storage directory and related constants.

## Phase 2: Models & Types

- [x] Define TypeScript types/interfaces for all database tables in `models/`.
  - [x] Create `models/major.model.ts`.
  - [x] Create `models/studyProgram.model.ts`.
  - [x] Create `models/file.model.ts`.
  - [x] Create `models/admin.model.ts`.
  - [x] Create `models/mahasiswa.model.ts`.
  - [x] Create `models/dosen.model.ts`.
  - [x] Create `models/news.model.ts`.
  - [x] Create `models/class.model.ts`.
  - [x] Create `models/classEnrollment.model.ts`.
  - [x] Create `models/post.model.ts`.
  - [x] Create `models/task.model.ts`.
  - [x] Create `models/presence.model.ts`.

## Phase 3: Authentication & Authorization

- [ ] Create a password hashing service.
- [ ] Create a JWT generation and verification service.
- [x] Implement the repository for user authentication (finding users by username).
- [ ] Implement the authentication service for the login logic.
- [ ] Implement the authentication controller for the `/api/login` endpoint.
- [ ] Create a route file for authentication (`/api/login`, `/api/logout`).
- [ ] Create an authentication middleware to verify JWTs and attach user data to requests.
- [ ] Create an authorization middleware to check for specific user roles (admin, dosen, mahasiswa).
- [ ] Implement the `/me` profile endpoint (repository, service, controller, route).

## Phase 4: Jurusan (Major) Management

- [x] Create `repositories/major.repository.ts` with CRUD functions.
- [ ] Create `services/major.service.ts` to handle business logic.
- [x] Create Zod schemas for validation in `models/major.model.ts`.
- [ ] Create `controllers/major.controller.ts` to handle HTTP requests.
- [ ] Create `routes/major.route.ts` for `/api/admin/major` endpoints.
- [ ] Integrate the major routes into the main application router.

## Phase 5: Program Studi (Study Program) Management

- [x] Create `repositories/studyProgram.repository.ts` with CRUD functions.
- [ ] Create `services/studyProgram.service.ts` to handle business logic.
- [x] Create Zod schemas for validation in `models/studyProgram.model.ts`.
- [ ] Create `controllers/studyProgram.controller.ts` to handle HTTP requests.
- [ ] Create `routes/studyProgram.route.ts` for `/api/admin/major/{major_id}/study_program` endpoints.
- [ ] Integrate the study program routes.

## Phase 6: Dosen Management

- [x] Create `repositories/dosen.repository.ts` with CRUD functions.
- [ ] Create `services/dosen.service.ts` for business logic.
- [x] Create Zod schemas for validation in `models/dosen.model.ts`.
- [ ] Create `controllers/dosen.controller.ts` for request handling.
- [ ] Create `routes/dosen.route.ts` for `/api/admin/dosen` endpoints.
- [ ] Integrate the dosen routes.

## Phase 7: Mahasiswa Management

- [x] Create `repositories/mahasiswa.repository.ts` with CRUD functions.
- [ ] Create `services/mahasiswa.service.ts` for business logic.
- [x] Create Zod schemas for validation in `models/mahasiswa.model.ts`.
- [ ] Create `controllers/mahasiswa.controller.ts` for request handling.
- [ ] Create `routes/mahasiswa.route.ts` for `/api/admin/mahasiswa` endpoints.
- [ ] Integrate the mahasiswa routes.

## Phase 8: News Management

- [ ] Configure `multer` for file uploads (for news thumbnails).
- [x] Create `repositories/news.repository.ts` with CRUD functions.
- [ ] Create `services/news.service.ts` to handle logic including file uploads.
- [x] Create Zod schemas for validation in `models/news.model.ts`.
- [ ] Create `controllers/news.controller.ts` for request handling.
- [ ] Create `routes/news.route.ts` for `/api/admin/news` endpoints.
- [ ] Integrate the news routes.