# Security Business Suite UI

Secure, modern authentication UI built with Next.js for a Java (Spring Security + JWT/OAuth2) backend.

## Features

- **Authentication**
  - Email/password login and register (`/auth/login`, `/auth/register`)
  - OAuth (Google) flow kickoff to backend OAuth endpoints
  - Silent session restore via refresh token (`/auth/refresh`)
  - Auth context provider with loading/error states (`src/auth/providers/auth-provider.tsx`)
- **UI/UX**
  - Tailwind CSS v4 theme and design tokens (`src/app/globals.css`)
  - Reusable UI components (buttons, inputs, table, etc.) in `src/components/ui/`
  - Example view: `src/components/views/CustomerView.tsx`
- **DX**
  - TypeScript, Next.js App Router
  - Infisical integration for secrets management (dev scripts use `infisical run`)

## Stack

- Next.js 15, React 19
- TypeScript
- Tailwind CSS v4
- Infisical (optional; `.infisical.json`)
- Java backend (Spring Security JWT/OAuth2)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- Java backend running at `http://localhost:8080` (or set env variable)
- Optional: Infisical CLI

### Install

```bash
npm install
```

### Environment Variables

Frontend:
- `NEXT_PUBLIC_API_URL` (optional)
  - Leave empty for same-origin calls (recommended in dev if you proxy).
  - Set to your API base URL in prod (e.g., `https://api.example.com`).

Backend (examples):
- `CORS_ALLOWED_ORIGINS` (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

If using Infisical, put these in your Infisical workspace. Otherwise create `.env.local`:

```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=
```

### Run (Development)

```bash
# Uses Infisical to inject env (optional)
npm run dev
```

This runs Next.js locally (default `http://localhost:3000`). Ensure your backend runs at `http://localhost:8080`.

Without Infisical:

```bash
npx next dev
```

### Build and Start (Production)

```bash
npm run build
npm start
```

## Project Structure

- `src/app/`
  - `page.tsx`: App entry (renders auth layout or app content depending on auth state)
  - `layout.tsx`: Root layout; provides `AuthProvider`
  - `globals.css`: Tailwind tokens + global styles
- `src/auth/`
  - `providers/auth-provider.tsx`: React context for auth (login/register/refresh/logout)
  - `services/auth-service.ts`: Fetch calls to backend (`/auth/*`)
  - `components/`: Login/Register forms and OAuth buttons
  - `types/`: Shared auth types
- `src/components/ui/`: UI primitives (Button, Input, Label, Table, etc.)
- `src/components/views/CustomerView.tsx`: Example screen
- `src/shared/utils/api-client.ts`: API client with refresh retry for 401s

## Auth Flow

- On app load, `AuthProvider` calls:
  1. `POST /auth/refresh` (silent session restore via HttpOnly cookie)
  2. If not restored, `GET /auth/me` (validate existing access token)
- Login: `POST /auth/login`
- Register: `POST /auth/register`
- OAuth: frontend redirects to backend (e.g., `/oauth2/authorization/google`)
- Logout: `POST /auth/logout`

Backend should return:
- `200` JSON for success
- `401` for unauthenticated API requests (no HTML redirects)
- Avoid `302` redirects for API endpoints like `/auth/me`, `/auth/refresh`

## Scripts

```json
{
  "dev": "infisical run -- next dev",
  "build": "infisical run -- next build",
  "start": "infisical run -- next start",
  "lint": "infisical run -- next lint"
}
```

If not using Infisical, run the equivalent Next.js commands directly.

## OAuth Configuration (Google)

- Authorization endpoint: `/oauth2/authorization/google`
- Redirect/callback: `/login/oauth2/code/google`
- Add the callback URL to your Google OAuth client configuration
- Ensure backend permits `"/oauth2/**"` and `"/login/oauth2/**"`

## Troubleshooting

- **Too many redirects (302) on `/auth/me` or `/auth/refresh`**:
  - Configure Spring Security to return `401` for API endpoints instead of redirecting to a login page (`HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)` for `/auth/me`, `/auth/refresh`, `/api/**`).
- **CORS/cookies in dev**:
  - If cross-origin, set `CORS_ALLOWED_ORIGINS=http://localhost:3000` and configure cookie attributes appropriately.
  - Alternatively, use a Next.js rewrite proxy (same-origin) and leave `NEXT_PUBLIC_API_URL` empty.
- **Token refresh**:
  - `auth-service.ts` uses `redirect: "manual"` and treats redirects as unauthenticated; ensure backend returns JSON for API errors.

## License

MIT (or your preferred license)
