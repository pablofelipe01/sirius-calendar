import { createClient } from '@supabase/supabase-js'

// Las variables de entorno deben estar definidas en .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Cliente Supabase para uso en el frontend y server actions
export const supabase = createClient(supabaseUrl, supabaseAnonKey)