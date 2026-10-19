# CLAUDE.md

Guidance for Claude Code when working in this repository. The full product description lives in `README.MD`.

## Project

Property Management App is a platform for running short-term rentals. Guests use an Android app, property managers use a web dashboard, and both clients talk to one shared REST API backed by MySQL.

## Monorepo layout

| Path | App | Stack | Used by | Status |
|---|---|---|---|---|
| `Api/` | Backend REST API | Java + Spring Boot, MySQL, RabbitMQ, Stripe, email service | Both clients | Not scaffolded yet |
| `Mobile/` | Android app | Kotlin | Guests | Not scaffolded yet |
| `PM-Web/` | Admin dashboard | React 19 + TypeScript + Vite | Property admins | Landing, auth and properties pages, running on a mock API |

- This is a single git repository rooted here, with no nested repos or submodules.
- Each app has its own toolchain and dependencies, and there is no root-level workspace tool (no pnpm workspace, Gradle composite build, Nx or Turbo). Run commands from inside the app's folder.
- For now, app-specific sections such as the PM-Web conventions live in this file. If it grows too large, move them to a `CLAUDE.md` inside that app's folder (for example `PM-Web/CLAUDE.md`).
- Each app keeps its own `.gitignore`.

## Commands

### PM-Web (run from `PM-Web/`)

The package manager is **pnpm** (`pnpm-lock.yaml`). Don't use npm or yarn.

```bash
pnpm install
pnpm dev        # Vite dev server with HMR
pnpm build      # tsc -b (type check), then vite build
pnpm lint       # oxlint
pnpm preview    # serve the production build locally
```

No test runner is configured yet.

While `Api/` doesn't exist, `.env.development` sets `VITE_API_MOCKS=true`, so requests are answered by `src/lib/mock-api.ts`, which keeps its data in localStorage. The demo login is `admin@example.com` / `password`. Set the variable to `false` to send requests to the real API at `http://localhost:8080` through the Vite proxy.

### Api (run from `Api/`)

Not scaffolded yet. Once it exists, document the build, run and test commands here. On Windows, use the wrapper scripts (`gradlew.bat` or `mvnw.cmd`).

### Mobile (run from `Mobile/`)

Not scaffolded yet. Once it exists, document the build, run and test commands here.

## Architecture

```text
Mobile (Kotlin, guests) ──┐
                          ├── HTTPS / REST ──> Api (Spring Boot) ──> MySQL
PM-Web (React, admins) ───┘                         ├──> RabbitMQ (async messages and events)
                                                    └──> Stripe, email service
```

- Business logic, validation and authorization live in the API. The clients are presentation layers and only reach data through the API.
- The API is the contract between the apps. Changing an endpoint, DTO or error format affects both PM-Web and Mobile, so either update both clients in the same change or keep the change backward-compatible.
- The backend is a modular Spring Boot application. Payments, email verification and messaging are separate modules that may later be split into microservices that communicate through RabbitMQ. Keep module boundaries clean (a module doesn't reach into another module's internals) so that split stays possible.
- RabbitMQ handles asynchronous communication and event processing, such as email notifications and payment events.

### API contract used by the clients

The API serves everything under `/api`. The session is an HttpOnly cookie that the API sets at login, so clients never store tokens. Errors return JSON in the form `{ "message": "..." }`, and that message is shown to the user as is.

| Endpoint | Request body | Response |
|---|---|---|
| `POST /api/auth/login` | `{ email, password }` | `User`, or 401 |
| `POST /api/auth/register` | `{ name, email, password }` | `User` (the API then sends a verification email), or 409 if the email is taken |
| `POST /api/auth/logout` | none | 204 |
| `GET /api/auth/me` | none | `User`, or 401 |
| `GET /api/properties` | none | `Property[]`, limited to the properties the admin manages |
| `POST /api/properties` | `{ name, address, city, description }` | `Property`, created with status `available` |
| `GET /api/properties/{id}` | none | `Property`, or 404 |

`User` has the fields `{ id, name, email }`. `Property` has the fields `{ id, name, address, city, description, status }`, and `status` is one of `available`, `occupied`, `maintenance` or `inactive`. The TypeScript types live in `PM-Web/src/features/*/api.ts`. Changing this contract means updating those types, `mock-api.ts` and this table.

## Domain model (MySQL)

| Table | Holds |
|---|---|
| `users` | Guest accounts and personal information |
| `property_admins` | Administrative users and the properties they manage |
| `properties` | Property details, address and status |
| `rentals` | A guest's stay at a property, with dates and agreed price |
| `contracts` | Rental agreements for a rental |
| `payments` | Amount, currency and transaction status for a rental |
| `housekeeping` | Cleaning tasks, schedules, assignments and completion status |
| `maintenance_requests` | Reported issues, priority and repair status |
| `inventory_items` | Furniture, equipment and supplies belonging to a property |
| `rental_inventory` | Optional link between rentals and inventory, for tracking usage per stay |

How the tables relate:

- `rentals` is the central table. Each rental links one guest (`users`) to one property, with dates and agreed price.
- A guest can have many rentals, and a property can have many rentals over time.
- A rental can have one or more `contracts` and `payments`.
- A property can have many `housekeeping` tasks, `maintenance_requests` and `inventory_items`.
- Properties and admins are many-to-many: a property can have several admins, and an admin can manage several properties. `property_admins` records these assignments.
- Tables for messages, notifications, audit logs and roles or permissions may be added later.

## Roles

- **Guest** uses the mobile app for check-in and check-out, profile, payments, rental agreements, booking information, maintenance requests and messaging. A guest can only access their own data.
- **Property admin** uses the web dashboard for properties, rentals, contracts, inventory, housekeeping, maintenance, users and admins, and the payments overview. An admin can only access the properties assigned to them.

## Security rules

- Enforce authentication and role-based authorization in the API on every endpoint. Client-side checks are only for UX.
- Scope every admin query to the properties that admin manages. Never trust a property, rental or user ID sent by a client without checking ownership.
- Validate all input on the backend, and return errors in a consistent format.
- Never store raw card details. Stripe handles card data, and the API stores only references and statuses.
- Verify the Stripe webhook signature before processing any payment event.
- Read secrets (database credentials, Stripe keys, webhook secrets, RabbitMQ and email credentials) from environment variables or a secrets manager, and never commit them. In PM-Web, every `VITE_`-prefixed variable is bundled into public browser code, so no secrets go there.
- All API traffic uses HTTPS.

## PM-Web conventions

- All UI text and code are in English.
- Keep JavaScript to a minimum. Use semantic HTML, native form validation (`required`, `type="email"`, `minLength`) and CSS for layout and visual states. Add a dependency only when it clearly earns its place. React Router is the only runtime dependency besides React.
- Routing uses React Router in data mode, with the route table in `src/router.ts`. Pages read data through route `loader`s and submit through `<Form method="post">` and route `action`s, not `useState`, `useEffect` and `fetch`. Actions return `toFormError(error)` so the form can show the message, and redirect on success.
- Folder structure:
  - `src/features/<feature>/api.ts`: endpoint calls and DTO types.
  - `src/features/<feature>/handlers.ts`: route loaders and actions.
  - `src/features/<feature>/*Page.tsx`: pages.
  - `src/layouts/`: `PublicLayout` for the landing and auth pages, and `DashboardLayout` for everything behind login.
  - `src/components/`: shared UI.
  - `src/pages/`: the landing and error pages.
  - `src/lib/api.ts`: the only place that calls `fetch`.
- To add a page behind login, add it to the dashboard route's children in `src/router.ts`, where the `requireUser` loader guards it. Add any endpoint it uses to `mock-api.ts` as well, until `Api/` implements it.
- Styling is plain CSS in `src/index.css`, built on design tokens on `:root` with a dark-mode override. There is no CSS framework.
- The React Compiler is enabled (`babel-plugin-react-compiler`, configured in `vite.config.ts`) and memoizes automatically. Don't add `useMemo`, `useCallback` or `React.memo` just for performance. Components must follow the Rules of React for the compiler to work.
- Linting uses oxlint (`.oxlintrc.json`), not ESLint. No formatter is configured yet.
- `tsconfig.app.json` sets these flags, and `pnpm build` fails when they are violated:
  - `verbatimModuleSyntax`: type-only imports must use `import type`.
  - `erasableSyntaxOnly`: no `enum`, no `namespace`, and no constructor parameter properties. Use union types or `as const` objects instead.
  - `noUnusedLocals` and `noUnusedParameters`: unused variables and parameters are errors.
- The dashboard is meant to be minimalist.
- Don't call impure functions such as `new Date()` or `Math.random()` while rendering, because oxlint's `react(purity)` rule flags them. Compute those values at module scope or in a loader instead.

## Keeping docs current

- At the end of every prompt, check whether the work changed anything this file documents, such as the layout and status, commands, API contract, domain model, conventions or security rules. If it did, update this file in the same change, and remove anything that is no longer true. Skip the update when nothing documented here changed. A `UserPromptSubmit` hook in the user's `~/.claude/settings.json` repeats this reminder on every prompt in this repo.
- When you scaffold `Api/` or `Mobile/`, fill in its commands above and update the status in the layout table.
- When you add features, integrations or tables, update this file and `README.MD`.
