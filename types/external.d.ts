declare module '@supabase/supabase-js' {
  export type SupabaseClient = any;
  export function createClient(url: string, key: string, options?: any): SupabaseClient;
}

declare module 'expo-image-picker' {
  export type ImagePickerAsset = { uri: string; fileName?: string };
  export type ImagePickerResult = { canceled: boolean; assets: ImagePickerAsset[] };
  export const MediaTypeOptions: { Images: string };
  export function launchImageLibraryAsync(options?: any): Promise<ImagePickerResult>;
}
