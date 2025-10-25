import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Helper function to add cache-busting parameter to URLs
export const addCacheBuster = (url: string) => {
  if (!url) return '';
  // Check if URL is from Supabase storage
  if (url.includes('storage.googleapis.com') || url.includes('supabase')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
  return url;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  },
  global: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
})

export interface Song {
  id: string
  song_name: string
  artist?: string
  song_url: string
  thumbnail_url: string
  created_at: string
}

export interface News {
  id: string
  title: string
  description?: string
  image_url: string
  button_name?: string
  button_url?: string
  created_at: string
}

export interface Movie {
  id: string
  movie_name: string
  description?: string
  thumbnail_url: string
  video_url: string
  duration?: number
  created_at: string
}

export interface Ad {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  button_text?: string
  is_active: boolean
  display_order: number
  created_at: string
}
