import { createClient } from "@supabase/supabase-js"

export function getAccessToken(req) {
  const authHeader = req.headers['authorization']
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }
  // Fallbacks if you decide to store tokens in cookies (HttpOnly recommended)
  return req.cookies?.['sb-access-token'] || req.cookies?.['access_token'] || null
}

export function supabaseForUser(accessToken) {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}