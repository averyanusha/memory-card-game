import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !supabaseKey)
  throw new Error('Missing supabase variables')

export const supabase = createClient(supabaseUrl, supabaseKey);