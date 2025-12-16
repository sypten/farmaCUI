import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno de Astro
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);