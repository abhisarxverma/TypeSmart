import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js'

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseKey || !supabaseUrl) throw new Error("Missing either supabase url or the supabase anon key, please check.")

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;