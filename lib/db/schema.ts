import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';

// Define minimal types that mirror the app's store types but avoid import cycles
export type Author = {
  username: string;
  avatar: string;
  twitter: string;
};

export type Comment = {
  id: string;
  user: { username: string; avatar: string };
  text: string;
  timestamp: number;
};

export type PredictionOption = {
  id: string;
  label: string;
  image?: string | null;
  votes: number;
};

export const predictions = sqliteTable('predictions', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  thumbnail: text('thumbnail'),
  votes: integer('votes').notNull().default(0),
  pool: real('pool').notNull().default(0),
  comments: text('comments'),
  options: text('options'),
  duration: integer('duration').notNull(),
  createdAt: integer('createdAt').notNull(),
  author: text('author'),
  topVoters: text('topVoters'),
});

export type PredictionRow = typeof predictions.$inferSelect;
export type NewPredictionRow = typeof predictions.$inferInsert;
