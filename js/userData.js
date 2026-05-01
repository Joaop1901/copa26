async function getProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function updateProfile(userId, profile) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getPreferences(userId) {
  const { data, error } = await supabaseClient
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function updatePreferences(userId, preferences) {
  const { data, error } = await supabaseClient
    .from("user_preferences")
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getFavoriteMatches(userId) {
  const { data, error } = await supabaseClient
    .from("favorite_matches")
    .select("*")
    .eq("user_id", userId)
    .order("match_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function addFavoriteMatch(match) {
  const { data, error } = await supabaseClient
    .from("favorite_matches")
    .insert(match)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function removeFavoriteMatch(userId, matchKey) {
  const { error } = await supabaseClient
    .from("favorite_matches")
    .delete()
    .eq("user_id", userId)
    .eq("match_key", matchKey);

  if (error) throw error;
}

async function getFavoriteStadiums(userId) {
  const { data, error } = await supabaseClient
    .from("favorite_stadiums")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function addFavoriteStadium(stadium) {
  const { data, error } = await supabaseClient
    .from("favorite_stadiums")
    .insert(stadium)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function removeFavoriteStadium(userId, stadiumSlug) {
  const { error } = await supabaseClient
    .from("favorite_stadiums")
    .delete()
    .eq("user_id", userId)
    .eq("stadium_slug", stadiumSlug);

  if (error) throw error;
}

window.userData = {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getFavoriteMatches,
  addFavoriteMatch,
  removeFavoriteMatch,
  getFavoriteStadiums,
  addFavoriteStadium,
  removeFavoriteStadium
};
