/**
 * estadios.js
 * Página de estádios com favoritos salvos diretamente no Supabase
 * Pins filtráveis por país e cards abrindo lateralmente.
 */

const estadiosLayer = document.getElementById("estadios-layer");
const mapaBase = document.querySelector(".mapa-base");
const appMessageEl = document.getElementById("app-message");
const countryFilterButtons = document.querySelectorAll("[data-country-filter]");

const MAPA_LARGURA = 1672;
const MAPA_ALTURA = 941;

let usuarioAtual = null;
let favoritosEstadios = new Set();
let filtroPaisAtivo = "todos";

const estadios = [
  { cidade: "Vancouver", estadio: "BC Place", capacidade: "54.000", pais: "Canadá", tipo: "canada", x: 40.8, y: 42 },
  { cidade: "Seattle", estadio: "Lumen Field", capacidade: "69.000", pais: "Estados Unidos", tipo: "usa", x: 41.2, y: 45.5 },
  { cidade: "San Francisco", estadio: "Levi's Stadium", capacidade: "71.000", pais: "Estados Unidos", tipo: "usa", x: 39.4, y: 54.1 },
  { cidade: "Los Angeles", estadio: "SoFi Stadium", capacidade: "70.000", pais: "Estados Unidos", tipo: "usa", x: 40.0, y: 60.1 },
  { cidade: "Kansas City", estadio: "Arrowhead Stadium", capacidade: "73.000", pais: "Estados Unidos", tipo: "usa", x: 54.7, y: 54.5 },
  { cidade: "Dallas", estadio: "AT&T Stadium", capacidade: "94.000", pais: "Estados Unidos", tipo: "usa", x: 52.0, y: 60.0 },
  { cidade: "Houston", estadio: "NRG Stadium", capacidade: "72.000", pais: "Estados Unidos", tipo: "usa", x: 54.3, y: 65.7 },
  { cidade: "Monterrey", estadio: "Estadio BBVA", capacidade: "53.500", pais: "México", tipo: "mexico", x: 50.2, y: 72.8 },
  { cidade: "Guadalajara", estadio: "Estadio Akron", capacidade: "48.000", pais: "México", tipo: "mexico", x: 47.3, y: 77.2 },
  { cidade: "Cidade do México", estadio: "Estadio Azteca", capacidade: "83.000", pais: "México", tipo: "mexico", x: 50.4, y: 79.0 },
  { cidade: "Toronto", estadio: "BMO Field", capacidade: "45.000", pais: "Canadá", tipo: "canada", x: 63.2, y: 50 },
  { cidade: "Boston", estadio: "Gillette Stadium", capacidade: "65.000", pais: "Estados Unidos", tipo: "usa", x: 66.3, y: 51.9 },
  { cidade: "New York / New Jersey", estadio: "MetLife Stadium", capacidade: "82.500", pais: "Estados Unidos", tipo: "usa", x: 64.5, y: 54.2 },
  { cidade: "Philadelphia", estadio: "Lincoln Financial Field", capacidade: "69.000", pais: "Estados Unidos", tipo: "usa", x: 63.7, y: 55.8 },
  { cidade: "Atlanta", estadio: "Mercedes-Benz Stadium", capacidade: "75.000", pais: "Estados Unidos", tipo: "usa", x: 60.1, y: 59.1 },
  { cidade: "Miami", estadio: "Hard Rock Stadium", capacidade: "65.000", pais: "Estados Unidos", tipo: "usa", x: 61.8, y: 70.4 }
];

function mostrarMensagem(mensagem, tipo = "") {
  if (!appMessageEl) return;

  appMessageEl.textContent = mensagem;
  appMessageEl.className = "app-message";

  if (tipo) {
    appMessageEl.classList.add(tipo);
  }

  setTimeout(() => {
    appMessageEl.textContent = "";
    appMessageEl.className = "app-message";
  }, 3000);
}

function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function gerarStadiumSlug(nome) {
  return String(nome ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function obterNomePaisFiltro(tipo) {
  const nomes = {
    canada: "Canadá",
    usa: "Estados Unidos",
    mexico: "México"
  };

  return nomes[tipo] || "todos os países";
}

function obterEstadiosFiltrados() {
  if (filtroPaisAtivo === "todos") {
    return estadios;
  }

  return estadios.filter((item) => item.tipo === filtroPaisAtivo);
}

function atualizarVisualFiltroPais() {
  countryFilterButtons.forEach((button) => {
    const ativo = button.dataset.countryFilter === filtroPaisAtivo;

    button.classList.toggle("is-active", ativo);
    button.setAttribute("aria-pressed", ativo ? "true" : "false");
  });
}

function alternarFiltroPais(tipo) {
  const estavaAtivo = filtroPaisAtivo === tipo;

  filtroPaisAtivo = estavaAtivo ? "todos" : tipo;

  fecharTodosCards();
  atualizarVisualFiltroPais();
  renderizarPinsDoMapa();

  if (filtroPaisAtivo === "todos") {
    mostrarMensagem("Mostrando todos os estádios.", "success");
  } else {
    mostrarMensagem(`Mostrando estádios de ${obterNomePaisFiltro(filtroPaisAtivo)}.`, "success");
  }
}

async function carregarUsuarioAtual() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
    usuarioAtual = null;
    return null;
  }

  usuarioAtual = data.user || null;
  return usuarioAtual;
}

async function carregarFavoritosEstadios() {
  favoritosEstadios = new Set();

  if (!usuarioAtual) return;

  const { data, error } = await supabaseClient
    .from("favorite_stadiums")
    .select("stadium_slug")
    .eq("user_id", usuarioAtual.id);

  if (error) {
    console.error("Erro ao carregar estádios favoritos:", error);
    mostrarMensagem("Erro ao carregar seus estádios favoritos.", "error");
    return;
  }

  favoritosEstadios = new Set((data || []).map((item) => item.stadium_slug));
}

async function favoritarEstadio(estadio) {
  if (!usuarioAtual) {
    mostrarMensagem("Você precisa entrar para favoritar estádios.", "error");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);

    return;
  }

  const stadiumSlug = gerarStadiumSlug(estadio.estadio);

  const payload = {
    user_id: usuarioAtual.id,
    stadium_slug: stadiumSlug,
    stadium_name: estadio.estadio,
    city: estadio.cidade,
    country: estadio.pais
  };

  const { error } = await supabaseClient
    .from("favorite_stadiums")
    .upsert(payload, {
      onConflict: "user_id,stadium_slug"
    });

  if (error) {
    console.error("Erro ao favoritar estádio:", error);
    throw error;
  }

  favoritosEstadios.add(stadiumSlug);
}

async function removerFavoritoEstadio(stadiumSlug) {
  if (!usuarioAtual) return;

  const { error } = await supabaseClient
    .from("favorite_stadiums")
    .delete()
    .eq("user_id", usuarioAtual.id)
    .eq("stadium_slug", stadiumSlug);

  if (error) {
    console.error("Erro ao remover estádio favorito:", error);
    throw error;
  }

  favoritosEstadios.delete(stadiumSlug);
}

async function alternarFavoritoEstadio(estadio) {
  if (!usuarioAtual) {
    mostrarMensagem("Você precisa entrar para usar essa função.", "error");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);

    return;
  }

  const stadiumSlug = gerarStadiumSlug(estadio.estadio);

  try {
    if (favoritosEstadios.has(stadiumSlug)) {
      await removerFavoritoEstadio(stadiumSlug);
      mostrarMensagem("Estádio removido dos favoritos.", "success");
    } else {
      await favoritarEstadio(estadio);
      mostrarMensagem("Estádio favoritado com sucesso.", "success");
    }

    atualizarVisualFavoritoEstadio(stadiumSlug);
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
    mostrarMensagem("Erro ao salvar favorito.", "error");
  }
}

function atualizarVisualFavoritoEstadio(stadiumSlug) {
  const favoritado = favoritosEstadios.has(stadiumSlug);

  document.querySelectorAll(`[data-favorite-stadium="${stadiumSlug}"]`).forEach((button) => {
    button.classList.toggle("is-favorite", favoritado);
    button.textContent = favoritado ? "★ Remover favorito" : "☆ Favoritar estádio";
    button.setAttribute("aria-pressed", favoritado ? "true" : "false");
  });
}

function fecharTodosCards() {
  document.querySelectorAll(".estadio-card.is-open").forEach((card) => {
    card.classList.remove("is-open");
    card.classList.remove("open-left");
    card.style.pointerEvents = "none";
  });

  document.querySelectorAll(".estadio-pin.is-open").forEach((pin) => {
    pin.classList.remove("is-open");
  });
}

function abrirCard(pin, card) {
  pin.classList.add("is-open");
  card.classList.add("is-open");
  card.style.pointerEvents = "auto";

  posicionarElementosDoMapa();
}

function criarEstadioPin(item) {
  const stadiumSlug = gerarStadiumSlug(item.estadio);
  const favoritado = favoritosEstadios.has(stadiumSlug);

  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = `estadio-pin ${item.tipo}`;
  pin.dataset.x = item.x;
  pin.dataset.y = item.y;
  pin.dataset.stadiumSlug = stadiumSlug;
  pin.setAttribute("aria-label", `Ver informações de ${item.estadio}`);

  const card = document.createElement("article");
  card.className = `estadio-card ${item.tipo}`;
  card.dataset.x = item.x;
  card.dataset.y = item.y;
  card.dataset.stadiumSlug = stadiumSlug;
  card.style.pointerEvents = "none";

  card.innerHTML = `
    <h3>${escapeHTML(item.cidade)}</h3>
    <p>${escapeHTML(item.estadio)} · ${escapeHTML(item.capacidade)}</p>
    <small>${escapeHTML(item.pais)}</small>

    <button 
      class="favorite-stadium-btn ${favoritado ? "is-favorite" : ""}" 
      type="button" 
      data-favorite-stadium="${escapeHTML(stadiumSlug)}"
      aria-pressed="${favoritado ? "true" : "false"}"
    >
      ${favoritado ? "★ Remover favorito" : "☆ Favoritar estádio"}
    </button>
  `;

  pin.addEventListener("click", (event) => {
    event.stopPropagation();

    const vaiAbrir = !card.classList.contains("is-open");

    fecharTodosCards();

    if (vaiAbrir) {
      abrirCard(pin, card);
    }
  });

  card.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const favoriteButton = card.querySelector("[data-favorite-stadium]");

  favoriteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await alternarFavoritoEstadio(item);
  });

  estadiosLayer.appendChild(pin);
  estadiosLayer.appendChild(card);
}

function renderizarPinsDoMapa() {
  if (!estadiosLayer) return;

  estadiosLayer.innerHTML = "";

  const lista = obterEstadiosFiltrados();

  lista.forEach(criarEstadioPin);

  requestAnimationFrame(() => {
    posicionarElementosDoMapa();
  });
}

function calcularPontoNoMapa(x, y) {
  const largura = mapaBase.clientWidth;
  const altura = mapaBase.clientHeight;

  const escala = Math.max(largura / MAPA_LARGURA, altura / MAPA_ALTURA);

  const larguraRenderizada = MAPA_LARGURA * escala;
  const alturaRenderizada = MAPA_ALTURA * escala;

  const offsetX = (largura - larguraRenderizada) / 2;
  const offsetY = (altura - alturaRenderizada) / 2;

  return {
    left: offsetX + (Number(x) / 100) * larguraRenderizada,
    top: offsetY + (Number(y) / 100) * alturaRenderizada
  };
}

function posicionarElementosDoMapa() {
  if (!mapaBase) return;

  document.querySelectorAll(".estadio-pin").forEach((pin) => {
    const ponto = calcularPontoNoMapa(pin.dataset.x, pin.dataset.y);

    pin.style.left = `${ponto.left}px`;
    pin.style.top = `${ponto.top}px`;
  });

  document.querySelectorAll(".estadio-card").forEach((card) => {
    const ponto = calcularPontoNoMapa(card.dataset.x, card.dataset.y);

    const margem = 16;
    const offsetLateral = 34;

    const larguraCard = card.offsetWidth || 270;
    const alturaCard = card.offsetHeight || 160;

    let abrirParaEsquerda = false;

    let left = ponto.left + offsetLateral;
    let top = ponto.top;

    if (left + larguraCard + margem > mapaBase.clientWidth) {
      abrirParaEsquerda = true;
      left = ponto.left - offsetLateral;
    }

    const topMinimo = 90;
    const topMaximo = mapaBase.clientHeight - alturaCard / 2 - margem;

    top = Math.max(topMinimo, top);
    top = Math.min(top, topMaximo);

    card.classList.toggle("open-left", abrirParaEsquerda);

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  });
}

function configurarFiltroPaises() {
  countryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alternarFiltroPais(button.dataset.countryFilter);
    });
  });
}

async function renderizarMapa() {
  if (!estadiosLayer || !mapaBase) {
    console.error("Elementos do mapa não encontrados.");
    return;
  }

  await carregarUsuarioAtual();

  if (typeof updateHeaderUser === "function") {
    await updateHeaderUser();
  }

  await carregarFavoritosEstadios();

  atualizarVisualFiltroPais();
  renderizarPinsDoMapa();
}

document.addEventListener("click", fecharTodosCards);

window.addEventListener("resize", () => {
  posicionarElementosDoMapa();
});

window.addEventListener("load", () => {
  posicionarElementosDoMapa();
});

configurarFiltroPaises();
renderizarMapa();