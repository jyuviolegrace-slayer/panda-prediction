// Supabase generated types (manually authored for now)
// In CI or locally with the Supabase CLI, overwrite this file using:
//   supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > types/supabase.ts
// or
//   supabase gen types typescript --local > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      predictions: {
        Row: {
          id: string;
          title: string;
          thumbnail: string | null;
          votes: number;
          pool: number;
          comments: Json | null;
          options: Json | null;
          duration: number; // milliseconds
          createdAt: string; // ISO timestamp
          author: Json | null;
          topVoters: Json | null;
        };
        Insert: {
          id?: string;
          title: string;
          thumbnail?: string | null;
          votes?: number;
          pool?: number;
          comments?: Json | null;
          options?: Json | null;
          duration: number;
          createdAt?: string; // ISO timestamp
          author?: Json | null;
          topVoters?: Json | null;
        };
        Update: {
          id?: string;
          title?: string;
          thumbnail?: string | null;
          votes?: number;
          pool?: number;
          comments?: Json | null;
          options?: Json | null;
          duration?: number;
          createdAt?: string;
          author?: Json | null;
          topVoters?: Json | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          username: string;
          twitter_handle: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          votes_count: number;
          accuracy_percentage: number;
          winnings_amount: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          twitter_handle?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          votes_count?: number;
          accuracy_percentage?: number;
          winnings_amount?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          twitter_handle?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          votes_count?: number;
          accuracy_percentage?: number;
          winnings_amount?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          prediction_id: string;
          user_id: string;
          option_selected: number;
          amount: number;
          timestamp: string | null;
        };
        Insert: {
          id?: string;
          prediction_id: string;
          user_id: string;
          option_selected: number;
          amount: number;
          timestamp?: string | null;
        };
        Update: {
          id?: string;
          prediction_id?: string;
          user_id?: string;
          option_selected?: number;
          amount?: number;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "votes_prediction_id_fkey";
            columns: ["prediction_id"];
            isOneToOne: false;
            referencedRelation: "predictions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          prediction_id: string;
          user_id: string;
          text: string;
          timestamp: string | null;
        };
        Insert: {
          id?: string;
          prediction_id: string;
          user_id: string;
          text: string;
          timestamp?: string | null;
        };
        Update: {
          id?: string;
          prediction_id?: string;
          user_id?: string;
          text?: string;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_prediction_id_fkey";
            columns: ["prediction_id"];
            isOneToOne: false;
            referencedRelation: "predictions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
