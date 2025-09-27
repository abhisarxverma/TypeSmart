import { getAccessToken, supabaseForUser } from "../utils/supabase.utils.js"
import supabase from "../lib/supabase/supabaseClient.js"

async function requireAuth(req, res, next) {
  try {
    const token = getAccessToken(req)
    if (!token) return res.status(401).json({ error: 'Missing access token' })

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' })

    req.user = data.user
    req.sb = supabaseForUser(token)
    return next()
  } catch (e) {
    console.log("Error in require auth middleware : ", e)
    return res.status(500).json({ error: 'Auth check failed', details: e.message })
  }
}

export default requireAuth;