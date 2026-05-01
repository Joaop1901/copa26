const matchesEl = document.getElementById("favorite-matches");
const stadiumsEl = document.getElementById("favorite-stadiums");
const messageEl = document.getElementById("favorites-message");

let currentUser = null;

function mostrarMensagem(mensagem, tipo = "") {
  messageEl.textContent = mensagem;
  messageEl.className = "app-message";
  if (tipo) messageEl.classList.add(tipo);
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatarHora(data) {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function carregarMeusJogosFavoritos() {
  try {
    const matches = await userData.getFavoriteMatches(currentUser.id);

    matchesEl.innerHTML = matches.length ? matches.map(match => `
      <div class="favorite-card">
        <strong>${match.home_team} vs ${match.away_team}</strong>
        <span>${formatarData(match.match_date)} · ${formatarHora(match.match_date)}</span>
        <span>${match.stadium}</span>
        <small>${match.stage}</small>
        <button type="button" data-remove-match="${match.match_key}">Remover</button>
      </div>
    `).join("") : `<p class="empty-state">Nenhum jogo favorito ainda.</p>`;

    matchesEl.querySelectorAll("[data-remove-match]").forEach(button => {
      button.addEventListener("click", () => removerJogoFavorito(button.dataset.removeMatch));
    });
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function carregarMeusEstadiosFavoritos() {
  try {
    const stadiums = await userData.getFavoriteStadiums(currentUser.id);

    stadiumsEl.innerHTML = stadiums.length ? stadiums.map(stadium => `
      <div class="favorite-card">
        <strong>${stadium.stadium_name}</strong>
        <span>${stadium.city}</span>
        <small>${stadium.country}</small>
        <button type="button" data-remove-stadium="${stadium.stadium_slug}">Remover</button>
      </div>
    `).join("") : `<p class="empty-state">Nenhum estádio favorito ainda.</p>`;

    stadiumsEl.querySelectorAll("[data-remove-stadium]").forEach(button => {
      button.addEventListener("click", () => removerEstadioFavorito(button.dataset.removeStadium));
    });
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function removerJogoFavorito(matchKey) {
  try {
    await userData.removeFavoriteMatch(currentUser.id, matchKey);
    mostrarMensagem("Favorito removido.", "success");
    await carregarMeusJogosFavoritos();
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao remover favorito.", "error");
  }
}

async function removerEstadioFavorito(stadiumSlug) {
  try {
    await userData.removeFavoriteStadium(currentUser.id, stadiumSlug);
    mostrarMensagem("Favorito removido.", "success");
    await carregarMeusEstadiosFavoritos();
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao remover favorito.", "error");
  }
}

async function iniciarFavoritos() {
  currentUser = await requireLogin();
  if (!currentUser) return;

  await updateHeaderUser();
  await Promise.all([carregarMeusJogosFavoritos(), carregarMeusEstadiosFavoritos()]);
}

iniciarFavoritos();
