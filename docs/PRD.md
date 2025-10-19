# Product Requirement Documentation (PRD)

Working title: Predict — Crypto-like Social Predictions

Version: v0.1 (MVP)
Owner: Product + Mobile Team
Platforms: iOS, Android (Expo-managed React Native + TypeScript)
Design: Exclusive Dark Theme, modern minimalist (Airbnb-inspired)

## 1. Executive Summary
Predict is a mobile app for making and participating in social predictions. Users post a prediction (question) with multiple options, seed a prize pool with a token (e.g., USDC), and the community votes using a crypto-like token balance. The app features real-time updates for votes and comments, Twitter-based authentication, user leaderboards, and rich media (thumbnails, banners, avatars) stored in Supabase Storage. The tech stack is Expo (React Native + TypeScript), Supabase (Auth, Postgres, Realtime, Storage), and Drizzle ORM for type-safe schemas/queries/migrations.

Core principles:
- Fast: Real-time updates for a lively, social feel
- Simple: Minimal friction through Twitter OAuth and a three-step creation flow
- Trustworthy: Type-safe schemas (Drizzle), explicit constraints, and transparent state
- Mobile-first: Intuitive navigation with bottom tabs and accessible, high-contrast dark UI

Success metrics (MVP):
- D1 conversion from Landing -> Auth > 50%
- 7-day retention (voters) > 20%
- Average time to first vote < 60s post-auth

Non-goals (MVP):
- On-chain settlement/payments; use simulated token accounting for pools
- Complex social graph and notifications (defer to post-MVP)


## 2. User Personas
- Casual Predictor (Ava, 24): Wants to vote on trending topics quickly. Values speed, clear options, and confidence via live vote counts.
- Competitive User (Max, 29): Actively seeks ROI and accuracy. Tracks standings, watches leaderboards, and optimizes voting amounts.
- Creator/Host (Sam, 27): Posts predictions, curates engaging questions, and cares about media presentation and community feedback.
- Lurker (Ray, 32): Browses and reads comments; may convert to voter after trust is established.


## 3. Information Architecture & Navigation
- Auth Group
  - Landing (hero + Get Started)
  - Authentication (Twitter OAuth)
- Tabs Group
  - Home: Feed of predictions
  - Leaderboard: Today / Week / All Time
  - Profile: Banner, avatar, stats
- Stack
  - Create Vote (3-step stepper)
  - Prediction Detail (vote modal, comments)

Navigation: React Navigation with Expo Router (stack + bottom tabs). Profile tab uses user avatar.


## 4. User Stories & Acceptance Criteria

### 4.1 Landing Page
- As a new user, I see a hero image, app headline, and a single CTA: "Get Started".
- Acceptance criteria:
  - Displays hero, headline, and CTA
  - Tapping CTA routes to Auth screen
  - Dark theme visuals (no light mode)

### 4.2 Authentication (Twitter OAuth via Supabase)
- As a user, I sign in with my Twitter account.
- Acceptance criteria:
  - Only "Connect with Twitter" shown
  - Successful login creates/updates user row in DB and stores public profile data
  - Persisted session across app restarts
  - Error state with retry and link to support

### 4.3 Home Tab (Feed)
- As a user, I see a list of active predictions with title, votes, pool size, comments, and thumbnail.
- Acceptance criteria:
  - Header: avatar (left) opens Profile, "Create Vote" (right) opens Create Vote
  - Predictions fetched from Supabase (paginated) and updated via Realtime subscriptions
  - Loading skeletons, empty state, and pull-to-refresh
  - Tapping a card opens Prediction Detail

### 4.4 Leaderboard Tab
- As a user, I can browse top users by Today, Week, and All Time.
- Acceptance criteria:
  - Toggle between filters (Today/Week/All Time)
  - Highlight top 3 users
  - Displays username, avatar, rank metric (winnings/score)
  - Data retrieved from Supabase views (Drizzle-managed schemas)

### 4.5 Profile Tab
- As a user, I view my banner, avatar, username, Twitter handle, and stats.
- Acceptance criteria:
  - Loads live stats: votes_count, accuracy_percentage, winnings_amount
  - Pulls avatar_url and banner_url from Supabase Storage
  - Link to open Twitter profile

### 4.6 Create Vote (3-step)
- Step 1: Question + Options (dynamic add), toggles for Embed Social Post, Cover Media upload, Images Per Option
- Step 2: Duration (24h/12h/1h), Payment Token (USDC/custom), Seed Pool amount (presets/custom)
- Step 3: Preview and Launch
- Acceptance criteria:
  - Local validation (non-empty question, ≥2 options)
  - Cover/option images are uploaded to Supabase Storage before creation
  - On Launch: insert Prediction row + related Option rows, broadcast Realtime event
  - Returns to Home and shows new item at the top

### 4.7 Prediction Detail
- As a user, I see full detail: large thumbnail, title, options (vote), pool size, total votes, countdown, top voters, author info, comments.
- Acceptance criteria:
  - Countdown derived from end_timestamp
  - Vote buttons open a modal for amount selection
  - Comments load with real-time updates; posting adds immediately (optimistic) then confirms

### 4.8 Voting Flow
- As a user, I select a vote amount and confirm.
- Acceptance criteria:
  - Modal with presets (e.g., 0.1, 1, 10) + custom
  - Confirm inserts Vote record, increments pool and votes in real-time
  - Error handling for insufficient balance or network issues


## 5. Functional Requirements

### 5.1 Entities
- Users: id, username, twitter_handle, avatar_url, banner_url, stats (votes_count, accuracy_percentage, winnings_amount)
- Predictions: id, title, thumbnail_url, options (array/JSON), duration (hours), payment_token, seed_pool_amount, total_pool_size, votes_count, comments_count, author_id, end_timestamp
- Votes: id, prediction_id, user_id, option_selected, amount, timestamp
- Comments: id, prediction_id, user_id, text, timestamp
- Leaderboards: computed views (daily/weekly/all-time) based on winnings/accuracy

### 5.2 Real-time
- Subscribe to Postgres changes for Predictions, Votes, and Comments tables
- Update UI lists in-place with minimal flicker

### 5.3 Media Uploads
- Storage buckets: avatars, banners, thumbnails, option-images
- Use expo-image-picker for selection; upload via Supabase Storage with public URLs or signed URLs

### 5.4 Error/Empty/Loading States
- Consistent skeletons, placeholders, and retry affordances

### 5.5 Internationalization (Later)
- English only in MVP; structure copy to allow future i18n


## 6. Non-Functional Requirements
- Performance: First meaningful paint < 1.5s on modern devices; list virtualization for feeds; image caching
- Reliability: Graceful retries, exponential backoff for network; optimistic UI with reconciliation
- Security: Auth guards for protected routes; restricted Storage and RLS policies per user
- Scalability: Pagination and server-side filters; efficient Realtime channels; use Supabase views for aggregations
- Accessibility: Color contrast ≥ 4.5:1; touch targets ≥ 44x44; labels for interactive elements; dynamic type support
- Offline support: Cache last-known feed and profile data in AsyncStorage; queue writes for retry


## 7. Data Models & Drizzle Schemas

Note: Use Drizzle ORM for schema, migrations, and type-safety. Queries at runtime use drizzle-orm/supabase with the Supabase JS client. Migrations are applied via drizzle-kit using generated SQL against the Supabase Postgres.

```ts
// db/schema.ts
import { pgTable, text, timestamp, integer, numeric, jsonb, varchar, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 64 }).notNull(),
  twitterHandle: varchar('twitter_handle', { length: 64 }).notNull(),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  votesCount: integer('votes_count').notNull().default(0),
  accuracyPercentage: numeric('accuracy_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  winningsAmount: numeric('winnings_amount', { precision: 18, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const predictions = pgTable('predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  options: jsonb('options').$type<string[]>().notNull(), // denormalized for quick reads
  durationHours: integer('duration_hours').notNull(),
  paymentToken: varchar('payment_token', { length: 16 }).notNull().default('USDC'),
  seedPoolAmount: numeric('seed_pool_amount', { precision: 18, scale: 2 }).notNull().default('0'),
  totalPoolSize: numeric('total_pool_size', { precision: 18, scale: 2 }).notNull().default('0'),
  votesCount: integer('votes_count').notNull().default(0),
  commentsCount: integer('comments_count').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endTimestamp: timestamp('end_timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  predictionId: uuid('prediction_id').notNull().references(() => predictions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  optionSelected: integer('option_selected').notNull(), // index into options array
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  predictionId: uuid('prediction_id').notNull().references(() => predictions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

// View definitions (generated in migrations)
// Example: leaderboard_daily as a view/materialized view computing score by day
```

Storage buckets (public-read with signed URL for private if needed):
- avatars
- banners
- thumbnails
- option-images


## 8. Supabase + Drizzle Integration

### 8.1 Client Initialization (Expo + React Native)
```ts
// lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/supabase';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

export const db = drizzle(supabase);
```

### 8.2 Twitter OAuth (Expo)
```ts
// auth flow
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

export async function signInWithTwitter() {
  const redirectTo = Linking.createURL('/'); // configure in Supabase Auth Redirect URLs
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session));
}
```

### 8.3 Queries (Feed, Detail) with Drizzle + Supabase
```ts
// Fetch paginated predictions for Home
import { db } from './supabase';
import { predictions, users } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

export async function fetchPredictions(limit = 20, cursor?: string) {
  const q = db
    .from(predictions)
    .select()
    .orderBy(desc(predictions.createdAt))
    .limit(limit);
  // Apply cursor if provided
  return await q;
}

export async function fetchPredictionDetail(id: string) {
  const prediction = await db.from(predictions).select().where(eq(predictions.id, id)).single();
  const author = await db.from(users).select().where(eq(users.id, prediction.authorId)).single();
  return { prediction, author };
}
```

### 8.4 Realtime Subscriptions
```ts
// Real-time updates for predictions, votes, comments
import { supabase } from './supabase';

export function subscribeToPredictionChanges(onChange: (payload: any) => void) {
  const channel = supabase
    .channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'predictions' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
```

### 8.5 Uploads (expo-image-picker + Supabase Storage)
```ts
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export async function pickAndUpload(bucket: string, pathPrefix: string) {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
  if (result.canceled) return null;
  const asset = result.assets[0];
  const fileExt = asset.uri.split('.').pop() || 'jpg';
  const path = `${pathPrefix}/${Date.now()}.${fileExt}`;
  const res = await fetch(asset.uri);
  const blob = await res.blob();
  const { data, error } = await supabase.storage.from(bucket).upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl.publicUrl;
}
```

### 8.6 Leaderboards (Views)
- Create SQL views for daily/weekly/all-time rankings using window functions over votes and winnings.
- Drizzle migrations generate the view SQL and check it into repo.

### 8.7 Drizzle Kit Configuration
```ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // Use Supabase connection string in CI/ops only
  },
} satisfies Config;
```

Migrations
- Generate: pnpm dlx drizzle-kit generate
- Apply: Use Supabase SQL editor/CLI to run generated SQL, or CI job with DATABASE_URL (never from the mobile app)


## 9. Error Handling & Edge Cases
- Auth cancelled: show non-blocking toast and remain on Landing
- Realtime disconnect: show stale indicator and auto-retry when online
- Image upload failure: allow retry or continue without image
- Voting collisions: use server row-level constraints and transactions; display latest pool/votes on failure


## 10. Analytics & Observability (post-MVP optional)
- Log screen views and key actions (create vote, vote confirm)
- Track funnel: Landing -> Auth -> First Vote


## 11. Security, Privacy, and Compliance
- Enforce RLS: users can only update their own profiles; votes/comments tied to authenticated user
- Store only necessary Twitter profile fields; provide logout and data deletion pathway
- Validate and sanitize all user-generated content


## 12. Milestones & Roadmap

M0 — Foundation (1 week)
- Supabase project + storage buckets + RLS policies
- Drizzle schemas + initial migrations
- Auth flow wired with Twitter

M1 — MVP (2–3 weeks)
- Home feed (list, pagination, realtime)
- Create Vote (3-step) with uploads
- Prediction Detail (voting, comments realtime)
- Profile and Leaderboards (views)

M2 — Polish (1–2 weeks)
- Offline caching, skeletons, error/retry
- Visual polish per Design System, haptics

Future
- Push notifications, social sharing, deep links to predictions
- Advanced analytics, moderation tools, reporting


## 13. Success Metrics (Revisited)
- Time-to-first-vote after auth
- DAU and stickiness (WAU/MAU)
- % of predictions with > N votes within 24h


## 14. Open Questions
- Token economy: fixed demo balances vs. simulated off-chain wallet per user
- Payout resolution rules and dispute handling (post-MVP)
