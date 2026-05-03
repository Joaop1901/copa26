/**
 * favoritos.js
 * Página de favoritos - jogos manuais, seleções acompanhadas,
 * jogos automáticos por seleção e estádios favoritos.
 */

const matchesEl = document.getElementById("favorite-matches");
const followedTeamsEl = document.getElementById("followed-teams");
const automaticMatchesEl = document.getElementById("automatic-matches");
const stadiumsEl = document.getElementById("favorite-stadiums");
const messageEl = document.getElementById("favorites-message");

let currentUser = null;
let todosJogos = [];
let jogosFavoritosManuais = [];
let selecoesAcompanhadas = [];
let estadiosFavoritos = [];

function mostrarMensagem(mensagem, tipo = "") {
  if (!messageEl) return;

  messageEl.textContent = mensagem;
  messageEl.className = "app-message";

  if (tipo) {
    messageEl.classList.add(tipo);
  }

  setTimeout(() => {
    messageEl.textContent = "";
    messageEl.className = "app-message";
  }, 3500);
}

function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizarTexto(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatarData(data) {
  if (!data) return "Data a definir";

  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data a definir";
  }

  return dataObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatarHora(data) {
  if (!data) return "--:--";

  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "--:--";
  }

  return dataObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getJogoHome(jogo) {
  return jogo.home || jogo.home_team || jogo.home_team_en || jogo.teams?.home?.name || "A definir";
}

function getJogoAway(jogo) {
  return jogo.away || jogo.away_team || jogo.away_team_en || jogo.teams?.away?.name || "A definir";
}

function getJogoData(jogo) {
  return jogo.date || jogo.match_date || jogo.fixture?.date || jogo.date_time || null;
}

function getJogoEstadio(jogo) {
  return jogo.stadium || jogo.venue || jogo.fixture?.venue?.name || "Estádio a definir";
}

function getJogoFase(jogo) {
  return jogo.stage || jogo.stage_name || jogo.group || jogo.league?.round || "Fase a definir";
}

function gerarMatchKey(jogo) {
  const data = getJogoData(jogo);
  const home = getJogoHome(jogo);
  const away = getJogoAway(jogo);

  return `${data}-${home}-${away}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getUsuarioLogado() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
    window.location.href = "login.html";
    return null;
  }

  if (!data.user) {
    window.location.href = "login.html";
    return null;
  }

  return data.user;
}

async function carregarCopaJson() {
  try {
    const response = await fetch("copa.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar copa.json");
    }

    const jogos = await response.json();

    todosJogos = Array.isArray(jogos) ? jogos : [];
    return todosJogos;
  } catch (error) {
    console.error("Erro ao carregar copa.json:", error);
    todosJogos = [];
    return [];
  }
}

async function carregarJogosFavoritosManuais() {
  const { data, error } = await supabaseClient
    .from("favorite_matches")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("match_date", { ascending: true });

  if (error) {
    console.error("Erro ao carregar jogos favoritos:", error);
    throw error;
  }

  jogosFavoritosManuais = data || [];
  return jogosFavoritosManuais;
}

async function carregarSelecoesAcompanhadas() {
  const { data, error } = await supabaseClient
    .from("followed_teams")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar seleções acompanhadas:", error);
    throw error;
  }

  selecoesAcompanhadas = data || [];
  return selecoesAcompanhadas;
}

async function carregarEstadiosFavoritos() {
  const { data, error } = await supabaseClient
    .from("favorite_stadiums")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar estádios favoritos:", error);
    throw error;
  }

  estadiosFavoritos = data || [];
  return estadiosFavoritos;
}

function jogoTemSelecaoAcompanhada(jogo, selecoes) {
  const home = normalizarTexto(getJogoHome(jogo));
  const away = normalizarTexto(getJogoAway(jogo));

  return selecoes.some((selecao) => {
    const nomeSelecao = normalizarTexto(selecao.team_name);

    return home === nomeSelecao || away === nomeSelecao;
  });
}

function pegarSelecoesDoJogo(jogo, selecoes) {
  const home = normalizarTexto(getJogoHome(jogo));
  const away = normalizarTexto(getJogoAway(jogo));

  return selecoes.filter((selecao) => {
    const nomeSelecao = normalizarTexto(selecao.team_name);
    return home === nomeSelecao || away === nomeSelecao;
  });
}

function montarJogosAutomaticos() {
  const favoritosManuaisKeys = new Set(
    jogosFavoritosManuais.map((jogo) => jogo.match_key)
  );

  return todosJogos
    .filter((jogo) => jogoTemSelecaoAcompanhada(jogo, selecoesAcompanhadas))
    .filter((jogo) => !favoritosManuaisKeys.has(gerarMatchKey(jogo)))
    .sort((a, b) => new Date(getJogoData(a)) - new Date(getJogoData(b)));
}

function renderizarJogosFavoritosManuais() {
  if (!jogosFavoritosManuais.length) {
    matchesEl.innerHTML = `
      <p class="empty-state">
        Nenhum jogo favoritado manualmente ainda.
      </p>
    `;
    return;
  }

  matchesEl.innerHTML = jogosFavoritosManuais.map((match) => `
    <div class="favorite-card">
      <strong>${escapeHTML(match.home_team)} vs ${escapeHTML(match.away_team)}</strong>

      <div>
        <span>${formatarData(match.match_date)} · ${formatarHora(match.match_date)}</span>
        <span>📍 ${escapeHTML(match.stadium || "Estádio a definir")}</span>
        <small>${escapeHTML(match.stage || "Fase a definir")}</small>
      </div>

      <button 
        type="button" 
        class="btn-remover" 
        data-remove-match="${escapeHTML(match.match_key)}"
      >
        Remover
      </button>
    </div>
  `).join("");

  matchesEl.querySelectorAll("[data-remove-match]").forEach((button) => {
    button.addEventListener("click", () => {
      removerJogoFavorito(button.dataset.removeMatch);
    });
  });
}

function renderizarSelecoesAcompanhadas() {
  if (!selecoesAcompanhadas.length) {
    followedTeamsEl.innerHTML = `
      <p class="empty-state">
        Você ainda não acompanha nenhuma seleção.
      </p>
    `;
    return;
  }

  followedTeamsEl.innerHTML = selecoesAcompanhadas.map((selecao) => `
    <div class="favorite-card">
      <strong>★ ${escapeHTML(selecao.team_name)}</strong>

      <div>
        <span>${escapeHTML(selecao.group_name || "Grupo não informado")}</span>
        <small>Jogos dessa seleção aparecem com estrela automática.</small>
      </div>

      <button 
        type="button" 
        class="btn-remover" 
        data-remove-team="${escapeHTML(selecao.team_name)}"
      >
        Parar de acompanhar
      </button>
    </div>
  `).join("");

  followedTeamsEl.querySelectorAll("[data-remove-team]").forEach((button) => {
    button.addEventListener("click", () => {
      removerSelecaoAcompanhada(button.dataset.removeTeam);
    });
  });
}

function renderizarJogosAutomaticos() {
  const jogosAutomaticos = montarJogosAutomaticos();

  if (!jogosAutomaticos.length) {
    automaticMatchesEl.innerHTML = `
      <p class="empty-state">
        Nenhum jogo automático encontrado para suas seleções acompanhadas.
      </p>
    `;
    return;
  }

  automaticMatchesEl.innerHTML = jogosAutomaticos.map((jogo) => {
    const selecoesDoJogo = pegarSelecoesDoJogo(jogo, selecoesAcompanhadas)
      .map((selecao) => selecao.team_name)
      .join(", ");

    return `
      <div class="favorite-card">
        <strong>★ ${escapeHTML(getJogoHome(jogo))} vs ${escapeHTML(getJogoAway(jogo))}</strong>

        <div>
          <span>${formatarData(getJogoData(jogo))} · ${formatarHora(getJogoData(jogo))}</span>
          <span>📍 ${escapeHTML(getJogoEstadio(jogo))}</span>
          <small>${escapeHTML(getJogoFase(jogo))}</small>
          <small>Marcado porque você acompanha: ${escapeHTML(selecoesDoJogo)}</small>
        </div>
      </div>
    `;
  }).join("");
}

function renderizarEstadiosFavoritos() {
  if (!estadiosFavoritos.length) {
    stadiumsEl.innerHTML = `
      <p class="empty-state">
        Nenhum estádio favorito ainda.
      </p>
    `;
    return;
  }

  stadiumsEl.innerHTML = estadiosFavoritos.map((stadium) => `
    <div class="favorite-card">
      <strong>${escapeHTML(stadium.stadium_name)}</strong>

      <div>
        <span>${escapeHTML(stadium.city || "Cidade não informada")}</span>
        <small>${escapeHTML(stadium.country || "País não informado")}</small>
      </div>

      <button 
        type="button" 
        class="btn-remover" 
        data-remove-stadium="${escapeHTML(stadium.stadium_slug)}"
      >
        Remover
      </button>
    </div>
  `).join("");

  stadiumsEl.querySelectorAll("[data-remove-stadium]").forEach((button) => {
    button.addEventListener("click", () => {
      removerEstadioFavorito(button.dataset.removeStadium);
    });
  });
}

function renderizarTudo() {
  renderizarJogosFavoritosManuais();
  renderizarSelecoesAcompanhadas();
  renderizarJogosAutomaticos();
  renderizarEstadiosFavoritos();
}

async function removerJogoFavorito(matchKey) {
  try {
    const { error } = await supabaseClient
      .from("favorite_matches")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("match_key", matchKey);

    if (error) {
      throw error;
    }

    mostrarMensagem("Jogo removido dos favoritos.", "success");

    await carregarJogosFavoritosManuais();
    renderizarJogosFavoritosManuais();
    renderizarJogosAutomaticos();
  } catch (error) {
    console.error("Erro ao remover jogo favorito:", error);
    mostrarMensagem("Erro ao remover jogo favorito.", "error");
  }
}

async function removerSelecaoAcompanhada(teamName) {
  try {
    const { error } = await supabaseClient
      .from("followed_teams")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("team_name", teamName);

    if (error) {
      throw error;
    }

    mostrarMensagem("Seleção removida das acompanhadas.", "success");

    await carregarSelecoesAcompanhadas();
    renderizarSelecoesAcompanhadas();
    renderizarJogosAutomaticos();
  } catch (error) {
    console.error("Erro ao remover seleção acompanhada:", error);
    mostrarMensagem("Erro ao remover seleção.", "error");
  }
}

async function removerEstadioFavorito(stadiumSlug) {
  try {
    const { error } = await supabaseClient
      .from("favorite_stadiums")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("stadium_slug", stadiumSlug);

    if (error) {
      throw error;
    }

    mostrarMensagem("Estádio removido dos favoritos.", "success");

    await carregarEstadiosFavoritos();
    renderizarEstadiosFavoritos();
  } catch (error) {
    console.error("Erro ao remover estádio favorito:", error);
    mostrarMensagem("Erro ao remover estádio.", "error");
  }
}

async function carregarFavoritos() {
  try {
    currentUser = await getUsuarioLogado();

    if (!currentUser) return;

    if (typeof updateHeaderUser === "function") {
      await updateHeaderUser();
    }

    matchesEl.innerHTML = `<p class="empty-state">Carregando jogos favoritos...</p>`;
    followedTeamsEl.innerHTML = `<p class="empty-state">Carregando seleções...</p>`;
    automaticMatchesEl.innerHTML = `<p class="empty-state">Carregando jogos automáticos...</p>`;
    stadiumsEl.innerHTML = `<p class="empty-state">Carregando estádios...</p>`;

    await Promise.all([
      carregarCopaJson(),
      carregarJogosFavoritosManuais(),
      carregarSelecoesAcompanhadas(),
      carregarEstadiosFavoritos()
    ]);

    renderizarTudo();
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    mostrarMensagem("Erro ao carregar página de favoritos.", "error");
  }
}

carregarFavoritos();