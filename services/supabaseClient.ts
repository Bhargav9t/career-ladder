import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase environment variables are missing!");
    return { url: 'https://placeholder.supabase.co', key: 'placeholder' };
  }
  return { url, key };
};

const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);