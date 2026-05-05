/**
 * userData.js
 * Centraliza todas as operações com Supabase para dados do usuário
 */

const userData = (() => {
  /**
   * Obtém usuário logado ou redireciona para login
   */
  async function getCurrentUserOrRedirect() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
      console.warn("Usuário não logado, redirecionando...");
      window.location.href = "login.html";
      return null;
    }

    return user;
  }

  /**
   * Obtém perfil do usuário
   */
  async function getProfile(userId) {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar perfil:", error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error("Erro em getProfile:", error);
      return null;
    }
  }

  /**
   * Salva ou atualiza perfil (UPSERT)
   */
  async function upsertProfile(profileData) {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .upsert({
          ...profileData,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" })
        .select();

      if (error) {
        console.error("Erro ao salvar perfil:", error);
        throw error;
      }

      return data ? data[0] : null;
    } catch (error) {
      console.error("Erro em upsertProfile:", error);
      throw error;
    }
  }

  /**
   * Carrega preferências do usuário
   */
  async function getPreferences(userId) {
    try {
      const { data, error } = await supabaseClient
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar preferências:", error);
        throw error;
      }

      return data || {
        user_id: userId,
        language: "pt-BR",
        theme: "dark",
        receive_notifications: false
      };
    } catch (error) {
      console.error("Erro em getPreferences:", error);
      return null;
    }
  }

  /**
   * Salva ou atualiza preferências (UPSERT)
   */
  async function upsertPreferences(preferencesData) {
    try {
      const { data, error } = await supabaseClient
        .from("user_preferences")
        .upsert({
          ...preferencesData,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" })
        .select();

      if (error) {
        console.error("Erro ao salvar preferências:", error);
        throw error;
      }

      return data ? data[0] : null;
    } catch (error) {
      console.error("Erro em upsertPreferences:", error);
      throw error;
    }
  }

  /**
   * Obtém favoritos manuais de jogos
   */
  async function getFavoriteMatches(userId) {
    try {
      const { data, error } = await supabaseClient
        .from("favorite_matches")
        .select("*")
        .eq("user_id", userId)
        .order("match_date", { ascending: true });

      if (error) {
        console.error("Erro ao carregar favoritos de jogos:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Erro em getFavoriteMatches:", error);
      return [];
    }
  }

  /**
   * Adiciona jogo favorito
   */
  async function addFavoriteMatch(matchData) {
    try {
      const { error } = await supabaseClient
        .from("favorite_matches")
        .upsert(matchData, {
          onConflict: "user_id,match_key"
        });

      if (error) {
        console.error("Erro ao adicionar favorito de jogo:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em addFavoriteMatch:", error);
      throw error;
    }
  }

  /**
   * Remove jogo favorito
   */
  async function removeFavoriteMatch(userId, matchKey) {
    try {
      const { error } = await supabaseClient
        .from("favorite_matches")
        .delete()
        .eq("user_id", userId)
        .eq("match_key", matchKey);

      if (error) {
        console.error("Erro ao remover favorito de jogo:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em removeFavoriteMatch:", error);
      throw error;
    }
  }

  /**
   * Verifica se um jogo foi favoritado manualmente
   */
  async function isMatchManuallyFavorited(userId, matchKey) {
    try {
      const { data, error } = await supabaseClient
        .from("favorite_matches")
        .select("id")
        .eq("user_id", userId)
        .eq("match_key", matchKey)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao verificar favorito:", error);
      }

      return !!data;
    } catch (error) {
      console.error("Erro em isMatchManuallyFavorited:", error);
      return false;
    }
  }

  /**
   * Obtém estádios favoritos
   */
  async function getFavoriteStadiums(userId) {
    try {
      const { data, error } = await supabaseClient
        .from("favorite_stadiums")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar estádios favoritos:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Erro em getFavoriteStadiums:", error);
      return [];
    }
  }

  /**
   * Adiciona estádio favorito
   */
  async function addFavoriteStadium(stadiumData) {
    try {
      const { error } = await supabaseClient
        .from("favorite_stadiums")
        .insert(stadiumData);

      if (error) {
        console.error("Erro ao adicionar estádio favorito:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em addFavoriteStadium:", error);
      throw error;
    }
  }

  /**
   * Remove estádio favorito
   */
  async function removeFavoriteStadium(userId, stadiumSlug) {
    try {
      const { error } = await supabaseClient
        .from("favorite_stadiums")
        .delete()
        .eq("user_id", userId)
        .eq("stadium_slug", stadiumSlug);

      if (error) {
        console.error("Erro ao remover estádio favorito:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em removeFavoriteStadium:", error);
      throw error;
    }
  }

  /**
   * Obtém equipes que o usuário acompanha
   */
  async function getFollowedTeams(userId) {
    try {
      const { data, error } = await supabaseClient
        .from("followed_teams")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao carregar seleções acompanhadas:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Erro em getFollowedTeams:", error);
      return [];
    }
  }

  /**
   * Adiciona equipe para acompanhar
   */
  async function followTeam(teamData) {
    try {
      const { error } = await supabaseClient
        .from("followed_teams")
        .upsert(teamData, {
          onConflict: "user_id,team_name"
        });

      if (error) {
        console.error("Erro ao acompanhar seleção:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em followTeam:", error);
      throw error;
    }
  }

  /**
   * Remove equipe da lista de acompanhadas
   */
  async function unfollowTeam(userId, teamName) {
    try {
      const { error } = await supabaseClient
        .from("followed_teams")
        .delete()
        .eq("user_id", userId)
        .eq("team_name", teamName);

      if (error) {
        console.error("Erro ao remover seleção acompanhada:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em unfollowTeam:", error);
      throw error;
    }
  }

  /**
   * Verifica se uma equipe está sendo acompanhada
   */
  async function isTeamFollowed(userId, teamName) {
    try {
      const { data, error } = await supabaseClient
        .from("followed_teams")
        .select("id")
        .eq("user_id", userId)
        .eq("team_name", teamName)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao verificar acompanhamento:", error);
      }

      return !!data;
    } catch (error) {
      console.error("Erro em isTeamFollowed:", error);
      return false;
    }
  }

  // Expõe funções publicamente
  return {
    getCurrentUserOrRedirect,
    getProfile,
    upsertProfile,
    getPreferences,
    upsertPreferences,
    getFavoriteMatches,
    addFavoriteMatch,
    removeFavoriteMatch,
    isMatchManuallyFavorited,
    getFavoriteStadiums,
    addFavoriteStadium,
    removeFavoriteStadium,
    getFollowedTeams,
    followTeam,
    unfollowTeam,
    isTeamFollowed
  };
})();

window.userData = userData;
