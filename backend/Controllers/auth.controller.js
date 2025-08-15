
export const getUser = async (req, res) => {
  const sb = req.sb; // Supabase client scoped to user
  const user = req.user; // Supabase Auth user object

  try {
    // 1. Try to fetch existing user from public.users
    const { data: existingUser, error: fetchError } = await sb
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = "Results contain 0 rows" — not a real error
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // 2. If not found, insert new user row
    const { data: newUser, error: insertError } = await sb
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error inserting new user:', insertError);
      return res.status(500).json({ error: 'Failed to create new user' });
    }

    return res.status(200).json(newUser);
  } catch (err) {
    console.error('Unexpected error in getUser:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
