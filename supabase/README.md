Supabase workflow and environments

Overview
- Migrations are stored in supabase/migrations and are the source of truth for the database schema.
- We manage staging and production environments by linking to each project with the Supabase CLI.
- TypeScript types for the database are generated into types/supabase.ts and consumed by the app for end-to-end type safety.

Prerequisites
- Install the Supabase CLI: https://supabase.com/docs/reference/cli/installing
- Log in: supabase login

Managing environments (staging/prod)
1) Link the CLI to a project
   # Staging
   supabase link --project-ref $SUPABASE_STAGING_PROJECT_ID

   # Production
   supabase link --project-ref $SUPABASE_PROD_PROJECT_ID

2) Apply migrations to the linked project
   supabase db push

3) Generate TypeScript types for the linked project
   # Staging
   supabase gen types typescript --project-id $SUPABASE_STAGING_PROJECT_ID > types/supabase.ts

   # Production
   supabase gen types typescript --project-id $SUPABASE_PROD_PROJECT_ID > types/supabase.ts

Local development (optional)
- You can spin up a local Supabase stack:
  supabase start
  supabase db reset
  supabase db push
  supabase gen types typescript --local > types/supabase.ts

Environment variables (mobile app)
- Configure Expo public env vars in app.json or your runtime env:
  EXPO_PUBLIC_SUPABASE_URL
  EXPO_PUBLIC_SUPABASE_ANON_KEY

Notes
- RLS is enabled with permissive policies for MVP. Tighten these policies when Auth is added.
- Storage buckets (avatars, banners, thumbnails, option-images) are created via migration.
- Do not edit generated types manually; use the CLI to regenerate from your environment.
