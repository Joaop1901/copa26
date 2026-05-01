const MODO = "auto";
// "api" = forca API
// "local" = forca JSON
// "auto" = tenta API e cai pro JSON

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = "SUA_API_KEY_AQUI";

const calendarioEl = document.getElementById("calendario");
const totalJogosEl = document.getElementById("total-jogos");
const filtroTimeEl = document.getElementById("filtro-time");
const filtroFaseEl = document.getElementById("filtro-fase");
const viewButtons = document.querySelectorAll(".view-btn");
const appMessageEl = document.getElementById("app-message");

let todosJogos = [];
let jogosAtuais = [];
let visualizacaoAtual = "lista";
let dataSelecionada = "";
let usuarioAtual = null;
let favoritosJogos = new Set();

const tradutorPaises = {
  brazil: "Brasil",
  mexico: "México",
  usa: "Estados Unidos",
  argentina: "Argentina",
  france: "França",
  germany: "Alemanha"
};

function normalizar(nome) {
  return nome?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function traduzir(nome) {
  if (!nome) return "A definir";
  return tradutorPaises[normalizar(nome)] || nome;
}

function mostrarMensagem(mensagem, tipo = "") {
  if (!appMessageEl) return;
  appMessageEl.textContent = mensagem;
  appMessageEl.className = "app-message";
  if (tipo) appMessageEl.classList.add(tipo);
}

function gerarMatchKey(jogo) {
  return `${jogo.date}-${jogo.home}-${jogo.away}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function buscarDadosDaCopa() {
  if (MODO === "local") {
    console.warn("Modo LOCAL ativado");
    return carregarLocal();
  }

  try {
    const response = await fetch(`${API_BASE}/fixtures?league=4&season=2022`, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    const dados = await response.json();

    if (!dados.response || dados.response.length === 0) {
      throw new Error("Sem dados da API");
    }

    const jogos = dados.response.map(j => ({
      date: j.fixture.date,
      home: j.teams.home.name,
      away: j.teams.away.name,
      stadium: j.fixture.venue.name,
      stage: j.league.round
    }));

    console.log("Dados vindos da API");
    iniciarCalendario(jogos);
  } catch (error) {
    console.warn("API falhou, usando JSON local");
    carregarLocal();
  }
}

async function carregarLocal() {
  const response = await fetch("copa.json");
  const jogos = await response.json();
  iniciarCalendario(jogos);
}

async function iniciarCalendario(jogos) {
  todosJogos = jogos;
  preencherFiltroDeFases(jogos);
  usuarioAtual = await getCurrentUser();
  await updateHeaderUser();
  await carregarFavoritosJogos();
  aplicarFiltros();
}

function preencherFiltroDeFases(jogos) {
  const grupos = [...new Set(jogos
    .map(jogo => jogo.stage)
    .filter(stage => stage?.startsWith("Grupo"))
  )].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  const fasesFinais = [
    "Rodada de 32",
    "Oitavas de Final",
    "Quartas de Final",
    "Semifinal",
    "Terceiro Lugar",
    "Final"
  ].filter(stage => jogos.some(jogo => jogo.stage === stage));

  filtroFaseEl.innerHTML = `
    <option value="todas">Todas as fases</option>
    <option value="fase-grupos">Fase de Grupos</option>
    <option value="mata-mata">Mata-mata</option>
    <optgroup label="Grupos">
      ${grupos.map(grupo => `<option value="${grupo}">${grupo}</option>`).join("")}
    </optgroup>
    <optgroup label="Fases finais">
      ${fasesFinais.map(fase => `<option value="${fase}">${fase}</option>`).join("")}
    </optgroup>
  `;
}

async function carregarFavoritosJogos() {
  favoritosJogos = new Set();
  if (!usuarioAtual) return;

  try {
    const favoritos = await userData.getFavoriteMatches(usuarioAtual.id);
    favoritosJogos = new Set(favoritos.map(favorito => favorito.match_key));
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function favoritarJogo(jogo) {
  const matchKey = gerarMatchKey(jogo);

  await userData.addFavoriteMatch({
    user_id: usuarioAtual.id,
    match_key: matchKey,
    home_team: traduzir(jogo.home),
    away_team: traduzir(jogo.away),
    match_date: jogo.date,
    stadium: jogo.stadium,
    stage: jogo.stage
  });

  favoritosJogos.add(matchKey);
}

async function removerFavoritoJogo(matchKey) {
  await userData.removeFavoriteMatch(usuarioAtual.id, matchKey);
  favoritosJogos.delete(matchKey);
}

async function alternarFavoritoJogo(jogo) {
  if (!usuarioAtual) {
    mostrarMensagem("Você precisa entrar para usar essa função.", "error");
    window.location.href = "login.html";
    return;
  }

  const matchKey = gerarMatchKey(jogo);

  try {
    if (favoritosJogos.has(matchKey)) {
      await removerFavoritoJogo(matchKey);
      mostrarMensagem("Favorito removido.", "success");
    } else {
      await favoritarJogo(jogo);
      mostrarMensagem("Favorito salvo com sucesso.", "success");
    }

    atualizarVisualFavorito(matchKey);
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao salvar favorito.", "error");
  }
}

function atualizarVisualFavorito(matchKey) {
  document.querySelectorAll(`[data-favorite-match="${matchKey}"]`).forEach(button => {
    const favoritado = favoritosJogos.has(matchKey);
    button.classList.toggle("is-favorite", favoritado);
    button.textContent = favoritado ? "★" : "☆";
  });
}

function encontrarJogoPorMatchKey(matchKey) {
  return todosJogos.find(jogo => gerarMatchKey(jogo) === matchKey);
}

function jogoCombinaComTime(jogo, termo) {
  if (!termo) return true;

  return [
    traduzir(jogo.home),
    traduzir(jogo.away),
    jogo.home,
    jogo.away
  ].some(nome => normalizar(nome)?.includes(termo));
}

function jogoCombinaComFase(jogo, fase) {
  if (fase === "todas") return true;
  if (fase === "fase-grupos") return jogo.stage?.startsWith("Grupo");
  if (fase === "mata-mata") return !jogo.stage?.startsWith("Grupo");
  return jogo.stage === fase;
}

function aplicarFiltros() {
  const termo = normalizar(filtroTimeEl.value);
  const fase = filtroFaseEl.value;

  const jogosFiltrados = todosJogos.filter(jogo => (
    jogoCombinaComTime(jogo, termo) &&
    jogoCombinaComFase(jogo, fase)
  ));

  if (dataSelecionada && !agruparPorData(jogosFiltrados)[dataSelecionada]) {
    dataSelecionada = "";
  }

  renderizar(jogosFiltrados);
}

function agruparPorData(jogos) {
  return jogos.reduce((acc, jogo) => {
    const d = new Date(jogo.date);
    const key = d.toLocaleDateString("sv-SE");

    acc[key] = acc[key] || [];
    acc[key].push(jogo);

    return acc;
  }, {});
}

function formatarHora(jogo) {
  return jogo.time || new Date(jogo.date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function templateBotaoFavorito(jogo) {
  const matchKey = gerarMatchKey(jogo);
  const favoritado = favoritosJogos.has(matchKey);

  return `
    <button class="favorite-match-btn ${favoritado ? "is-favorite" : ""}" type="button" data-favorite-match="${matchKey}" aria-label="Favoritar jogo">
      ${favoritado ? "★" : "☆"}
    </button>
  `;
}

function templateJogo(jogo) {
  return `
  <div class="jogo" data-match-key="${gerarMatchKey(jogo)}">
    <div>
      <strong>${traduzir(jogo.home)}</strong>
      vs
      <strong>${traduzir(jogo.away)}</strong>
      <div>📍 ${jogo.stadium}</div>
    </div>

    <div>
      <div>${formatarHora(jogo)}</div>
      <small>${jogo.stage}</small>
      ${templateBotaoFavorito(jogo)}
    </div>
  </div>
  `;
}

function templateJogoTimeline(jogo) {
  return `
  <div class="timeline-game">
    <strong>${traduzir(jogo.home)} vs ${traduzir(jogo.away)}</strong>
    <span>${formatarHora(jogo)} · ${jogo.stadium}</span>
    <small>${jogo.stage}</small>
    ${templateBotaoFavorito(jogo)}
  </div>
  `;
}

function renderizarLista(jogos) {
  const grupos = agruparPorData(jogos);
  const datas = Object.keys(grupos);

  if (datas.length === 0) {
    calendarioEl.innerHTML = `<p class="sem-resultados">Nenhum jogo encontrado para esse filtro.</p>`;
    return;
  }

  calendarioEl.innerHTML = datas.map(data => {
    const d = new Date(`${data}T00:00:00`);
    const titulo = d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long"
    });

    return `
    <div class="dia">
      <h2 class="dia-titulo">${titulo}</h2>
      ${grupos[data].map(templateJogo).join("")}
    </div>
    `;
  }).join("");
}

function obterMesesDoTorneio(jogos) {
  if (jogos.length === 0) return [];

  const datas = jogos.map(jogo => new Date(jogo.date));
  const inicio = new Date(Math.min(...datas));
  const fim = new Date(Math.max(...datas));
  const meses = [];
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);

  while (cursor <= fim) {
    meses.push({
      ano: cursor.getFullYear(),
      mes: cursor.getMonth()
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return meses;
}

function renderizarCalendario(jogos) {
  const grupos = agruparPorData(jogos);
  const meses = obterMesesDoTorneio(jogos);
  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  if (jogos.length === 0) {
    calendarioEl.innerHTML = `<p class="sem-resultados">Nenhum jogo encontrado para esse filtro.</p>`;
    return;
  }

  calendarioEl.innerHTML = `
  <section class="timeline-calendar">
    ${meses.map(({ ano, mes }) => {
      const primeiroDia = new Date(ano, mes, 1).getDay();
      const totalDias = new Date(ano, mes + 1, 0).getDate();
      const nomeMes = new Date(ano, mes, 1).toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();
      const espacos = Array.from({ length: primeiroDia }, () => `<div class="timeline-empty"></div>`).join("");
      const dias = Array.from({ length: totalDias }, (_, index) => {
        const dia = index + 1;
        const data = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const jogosDoDia = grupos[data] || [];
        const temJogos = jogosDoDia.length > 0;
        const ativo = data === dataSelecionada;

        return `
        <button
          class="timeline-item ${temJogos ? "has-games" : ""} ${ativo ? "is-selected" : ""}"
          type="button"
          data-date="${data}"
          ${temJogos ? "" : "disabled"}
        >
          <span class="timeline-day">${dia}</span>
          <span class="timeline-count">${temJogos ? `${jogosDoDia.length} jogos` : ""}</span>
          ${ativo && temJogos ? `
            <div class="timeline-games">
              ${jogosDoDia.map(templateJogoTimeline).join("")}
            </div>
          ` : ""}
        </button>
        `;
      }).join("");

      return `
      <article class="calendar-month">
        <div class="calendar-month-header">
          <span>${ano}</span>
          <strong>${nomeMes}</strong>
          <span>${ano}</span>
        </div>
        <div class="calendar-weekdays">
          ${diasSemana.map(dia => `<span>${dia}</span>`).join("")}
        </div>
        <div class="timeline-grid">
          ${espacos}${dias}
        </div>
      </article>
      `;
    }).join("")}
  </section>
  `;
}

function renderizar(jogos) {
  jogosAtuais = jogos;
  totalJogosEl.textContent = jogos.length;

  if (visualizacaoAtual === "calendario") {
    renderizarCalendario(jogos);
    return;
  }

  renderizarLista(jogos);
}

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    visualizacaoAtual = button.dataset.view;
    viewButtons.forEach(item => item.classList.toggle("is-active", item === button));
    aplicarFiltros();
  });
});

calendarioEl.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite-match]");

  if (favoriteButton) {
    event.stopPropagation();
    const jogo = encontrarJogoPorMatchKey(favoriteButton.dataset.favoriteMatch);
    if (jogo) alternarFavoritoJogo(jogo);
    return;
  }

  const timelineItem = event.target.closest(".timeline-item.has-games");
  if (!timelineItem) return;

  dataSelecionada = dataSelecionada === timelineItem.dataset.date ? "" : timelineItem.dataset.date;
  renderizarCalendario(jogosAtuais);
});

filtroTimeEl.addEventListener("input", aplicarFiltros);
filtroFaseEl.addEventListener("change", aplicarFiltros);

buscarDadosDaCopa();
