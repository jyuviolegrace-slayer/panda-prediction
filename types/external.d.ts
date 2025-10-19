declare module 'expo-sqlite/next' {
  export type SQLiteDatabase = any;
  export function openDatabaseSync(name?: string): SQLiteDatabase;
}

declare module 'drizzle-orm/expo-sqlite' {
  export function drizzle(db: any, config?: any): any;
}

declare module 'drizzle-orm/sqlite-core' {
  export const sqliteTable: any;
  export const integer: any;
  export const real: any;
  export const text: any;
}

declare module 'drizzle-orm' {
  export const eq: any;
}

declare module '@supabase/supabase-js' {
  export type SupabaseClient = any;
  export function createClient(url: string, key: string, options?: any): SupabaseClient;
}
