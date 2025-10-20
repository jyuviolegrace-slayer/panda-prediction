Supabase environments, schema and types

This repository includes a Supabase setup compatible with the Managing Environments guide.

What's included
- supabase/migrations: SQL migrations that define the database schema (predictions, users, votes, comments) and storage buckets.
- supabase/config.toml: CLI config for optional local development (supabase start).
- types/supabase.ts: Database types used by the app. This file should be generated from your Supabase project.
- package.json scripts: handy commands to link environments, push migrations, and generate types.

How to use (staging)
1) Install the CLI and login:
   pnpm supabase:login

2) Link to your staging project:
   export SUPABASE_STAGING_PROJECT_ID=your-staging-project-ref
   pnpm supabase:link:staging

3) Apply the migrations to staging:
   pnpm db:push:staging

4) Generate TypeScript types from staging into types/supabase.ts:
   pnpm types:gen:staging

Production
- Repeat the steps above with SUPABASE_PROD_PROJECT_ID and the prod scripts.

Local development (optional)
- Start local stack and generate types from the local DB:
  supabase start
  pnpm types:gen:local

App integration
- The app reads Supabase credentials from Expo public env vars: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
- The Supabase client is typed using Database from types/supabase.ts, so all queries (select/insert/update) are type-safe.

Notes
- For MVP we enabled permissive RLS policies to allow reads/writes without Auth. Tighten these when adding Auth.
- Storage buckets (avatars, banners, thumbnails, option-images) are created by the initial migration.
