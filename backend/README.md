# CollabX Backend

## Local development

The backend uses PostgreSQL when `DATABASE_URL` or all `POSTGRES_*` settings are provided:

```powershell
Set-Location backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For an explicit local SQLite fallback, set `USE_SQLITE_FALLBACK=true`. The fallback remains available for development and does not override a configured PostgreSQL URL.

## PostgreSQL with pgvector

Docker is required for the PostgreSQL setup:

```powershell
Set-Location backend
docker compose up -d postgres
Copy-Item .env.example .env
```

Set `DATABASE_URL` to your environment-provided `postgresql+psycopg://<user>:<password>@<host>:5432/<database>` value and `USE_SQLITE_FALLBACK=false` in `.env`, then start Uvicorn. The compose service uses `pgvector/pgvector:pg16` and mounts `scripts/init_db.sql` during first-time initialization.

`ENABLE_PGVECTOR=true` is the default for PostgreSQL and requires the `vector` server extension to be installed in the PostgreSQL instance. Installing the Python `pgvector` package is not sufficient. On Windows, install a pgvector build compatible with the installed PostgreSQL major version, or use the provided pgvector Docker image. For an explicitly non-vector development database only, set `ENABLE_PGVECTOR=false`; embeddings then use the existing JSON fallback.

## AI problem structuring

AI structuring is disabled by default. With `AI_ENABLED=false`, CollabX uses its local deterministic recommendation fallback and still saves every citizen report. To use an OpenAI-compatible provider, set these values in `.env`:

```env
AI_ENABLED=true
AI_PROVIDER_URL=https://your-provider.example/v1/chat/completions
AI_MODEL=your-model-name
AI_API_KEY=your-key
AI_TIMEOUT_SECONDS=15
```

Problem structuring and idea screening use the configured OpenAI-compatible provider when `AI_ENABLED=true`; failures fall back to local advisory heuristics. Optional provider embedding configuration is controlled by `AI_EMBEDDING_ENABLED`, `AI_EMBEDDING_PROVIDER_URL`, and `AI_EMBEDDING_MODEL`. Keep provider keys backend-only. Duplicate detection and smart matching remain similarity recommendations, and government or expert users retain final decision authority.

The API key is read only from the environment and is never stored in reports. Provider failures fall back to local recommendations. Government users can override the final `category`, `priority`, or `severity` through `PATCH /api/reports/{report_id}/ai-overrides`; the original recommendation remains available as `ai_recommendation`.

## Database migrations

The backend uses Alembic for non-destructive schema changes. From the `backend` directory, apply migrations with:

```powershell
..\.venv\Scripts\alembic.exe upgrade head
```

The normalized schema adds users, locations, challenges, ideas, projects, milestones, and feedback while preserving the existing report and legacy tables. Do not use destructive downgrade operations against production data.

## Smart matching

Create university and industry profiles through `POST /api/matching/profiles/universities` and `POST /api/matching/profiles/industries`. Create an open challenge with `POST /api/matching`, then retrieve recommendations with `GET /api/matching/{challenge_id}/matches`.

Recommendations start as `pending`. Authorized reviewers can accept or reject one through `PATCH /api/matching/matches/{recommendation_id}/decision`. Matching never assigns partners and does not guarantee funding, procurement, or a government tender.

## Authentication

Authentication uses environment-configured JWTs. Request an OTP with `POST /api/auth/request-otp`, verify it with `POST /api/auth/verify-otp`, and send the returned bearer token to protected endpoints. `GET /api/auth/me` verifies the current token. Set `JWT_SECRET_KEY` before use.

For development or an SIH demonstration, set `AUTH_MODE=demo`. Each request generates a new random six-digit OTP, which is stored only as a keyed hash with expiry and attempt limits. The OTP is printed only in the backend development console; it is never returned by the API. Demo mode is not suitable for production.

For production SMS delivery, set `AUTH_MODE=sms`, `AUTH_OTP_PROVIDER_URL`, `AUTH_OTP_PROVIDER_API_KEY`, and `AUTH_OTP_SENDER`. Missing SMS configuration returns a clear service configuration error. Provider credentials must come from the environment and must never be exposed to the frontend.

Production OTP delivery requires `AUTH_OTP_PROVIDER_URL`, with optional `AUTH_OTP_PROVIDER_API_KEY` and `AUTH_OTP_SENDER`. The provider receives JSON containing `recipient`, `otp`, `expires_at`, and `sender`; the OTP is never returned by the API or written to logs/database. Requests are rate limited and verification attempts are bounded by the `AUTH_OTP_*` settings.