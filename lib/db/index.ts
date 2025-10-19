import { openDatabaseSync } from 'expo-sqlite/next';
import type { SQLiteDatabase } from 'expo-sqlite/next';
import { drizzle } from 'drizzle-orm/expo-sqlite';

// Open a persistent database file
const sqlite = openDatabaseSync('app.db');

function initDb(db: SQLiteDatabase) {
  // Create tables if they don't exist. Keep in sync with schema.ts
  db.execSync(
    `CREATE TABLE IF NOT EXISTS predictions (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      thumbnail TEXT,
      votes INTEGER NOT NULL DEFAULT 0,
      pool REAL NOT NULL DEFAULT 0,
      comments TEXT DEFAULT '[]',
      options TEXT NOT NULL,
      duration INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      author TEXT NOT NULL,
      topVoters TEXT DEFAULT '[]'
    );`
  );
}

initDb(sqlite);

export const db = drizzle(sqlite);
export { sqlite };
