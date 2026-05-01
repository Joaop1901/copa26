const estadiosLayer = document.getElementById("estadios-layer");
const mapaBase = document.querySelector(".mapa-base");
const appMessageEl = document.getElementById("app-message");
const MAPA_LARGURA = 1672;
const MAPA_ALTURA = 941;

let usuarioAtual = null;
let favoritosEstadios = new Set();

const estadios = [
  { cidade: "Vancouver", estadio: "BC Place", capacidade: "54.000", pais: "Canadá", tipo: "canada", x: 40.8, y: 42, cardX: 30, cardY: 42 },
  { cidade: "Seattle", estadio: "Lumen Field", capacidade: "69.000", pais: "Estados Unidos", tipo: "usa", x: 41.2, y: 45.5, cardX: 30.5, cardY: 45.5 },
  { cidade: "San Francisco", estadio: "Levi's Stadium", capacidade: "71.000", pais: "Estados Unidos", tipo: "usa", x: 39.4, y: 54.1, cardX: 29, cardY: 58.1 },
  { cidade: "Los Angeles", estadio: "SoFi Stadium", capacidade: "70.000", pais: "Estados Unidos", tipo: "usa", x: 40.0, y: 60.1, cardX: 30.5, cardY: 63.1 },
  { cidade: "Kansas City", estadio: "Arrowhead Stadium", capacidade: "73.000", pais: "Estados Unidos", tipo: "usa", x: 54.7, y: 54.5, cardX: 45.5, cardY: 54.5 },
  { cidade: "Dallas", estadio: "AT&T Stadium", capacidade: "94.000", pais: "Estados Unidos", tipo: "usa", x: 52.0, y: 60.0, cardX: 45, cardY: 65.7 },
  { cidade: "Houston", estadio: "NRG Stadium", capacidade: "72.000", pais: "Estados Unidos", tipo: "usa", x: 54.3, y: 65.7, cardX: 66, cardY: 70.1 },
  { cidade: "Monterrey", estadio: "Estadio BBVA", capacidade: "53.500", pais: "México", tipo: "mexico", x: 50.2, y: 72.8, cardX: 62, cardY: 76.8 },
  { cidade: "Guadalajara", estadio: "Estadio Akron", capacidade: "48.000", pais: "México", tipo: "mexico", x: 47.3, y: 77.2, cardX: 59, cardY: 84 },
  { cidade: "Cidade do México", estadio: "Estadio Azteca", capacidade: "83.000", pais: "México", tipo: "mexico", x: 50.4, y: 79.0, cardX: 62, cardY: 86.8 },
  { cidade: "Toronto", estadio: "BMO Field", capacidade: "45.000", pais: "Canadá", tipo: "canada", x: 63.2, y: 50, cardX: 55, cardY: 46 },
  { cidade: "Boston", estadio: "Gillette Stadium", capacidade: "65.000", pais: "Estados Unidos", tipo: "usa", x: 66.3, y: 51.9, cardX: 83, cardY: 40.8 },
  { cidade: "New York / New Jersey", estadio: "MetLife Stadium", capacidade: "82.500", pais: "Estados Unidos", tipo: "usa", x: 64.5, y: 54.2, cardX: 82, cardY: 44.2 },
  { cidade: "Philadelphia", estadio: "Lincoln Financial Field", capacidade: "69.000", pais: "Estados Unidos", tipo: "usa", x: 63.7, y: 55.8, cardX: 81.5, cardY: 46.4 },
  { cidade: "Atlanta", estadio: "Mercedes-Benz Stadium", capacidade: "75.000", pais: "Estados Unidos", tipo: "usa", x: 60.1, y: 59.1, cardX: 76, cardY: 59.1 },
  { cidade: "Miami", estadio: "Hard Rock Stadium", capacidade: "65.000", pais: "Estados Unidos", tipo: "usa", x: 61.8, y: 70.4, cardX: 82, cardY: 74.4 }
];

function mostrarMensagem(mensagem, tipo = "") {
  if (!appMessageEl) return;
  appMessageEl.textContent = mensagem;
  appMessageEl.className = "app-message";
  if (tipo) appMessageEl.classList.add(tipo);
}

function gerarStadiumSlug(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function carregarFavoritosEstadios() {
  favoritosEstadios = new Set();
  if (!usuarioAtual) return;

  try {
    const favoritos = await userData.getFavoriteStadiums(usuarioAtual.id);
    favoritosEstadios = new Set(favoritos.map(favorito => favorito.stadium_slug));
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function favoritarEstadio(estadio) {
  const stadiumSlug = gerarStadiumSlug(estadio.estadio);

  await userData.addFavoriteStadium({
    user_id: usuarioAtual.id,
    stadium_slug: stadiumSlug,
    stadium_name: estadio.estadio,
    city: estadio.cidade,
    country: estadio.pais
  });

  favoritosEstadios.add(stadiumSlug);
}

async function removerFavoritoEstadio(stadiumSlug) {
  await userData.removeFavoriteStadium(usuarioAtual.id, stadiumSlug);
  favoritosEstadios.delete(stadiumSlug);
}

async function alternarFavoritoEstadio(estadio) {
  if (!usuarioAtual) {
    mostrarMensagem("Você precisa entrar para usar essa função.", "error");
    window.location.href = "login.html";
    return;
  }

  const stadiumSlug = gerarStadiumSlug(estadio.estadio);

  try {
    if (favoritosEstadios.has(stadiumSlug)) {
      await removerFavoritoEstadio(stadiumSlug);
      mostrarMensagem("Favorito removido.", "success");
    } else {
      await favoritarEstadio(estadio);
      mostrarMensagem("Favorito salvo com sucesso.", "success");
    }

    atualizarVisualFavoritoEstadio(stadiumSlug);
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao salvar favorito.", "error");
  }
}

function atualizarVisualFavoritoEstadio(stadiumSlug) {
  document.querySelectorAll(`[data-favorite-stadium="${stadiumSlug}"]`).forEach(button => {
    const favoritado = favoritosEstadios.has(stadiumSlug);
    button.classList.toggle("is-favorite", favoritado);
    button.textContent = favoritado ? "Remover favorito" : "Favoritar estádio";
  });
}

function fecharTodosCards() {
  document.querySelectorAll(".estadio-card.is-open").forEach(card => {
    card.classList.remove("is-open");
  });

  document.querySelectorAll(".estadio-pin.is-open").forEach(pin => {
    pin.classList.remove("is-open");
  });
}

function criarEstadioPin(item) {
  const stadiumSlug = gerarStadiumSlug(item.estadio);
  const favoritado = favoritosEstadios.has(stadiumSlug);
  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = `estadio-pin ${item.tipo}`;
  pin.dataset.x = item.x;
  pin.dataset.y = item.y;
  pin.setAttribute("aria-label", `Ver informações de ${item.estadio}`);

  const card = document.createElement("article");
  card.className = `estadio-card ${item.tipo}`;
  card.dataset.x = item.cardX;
  card.dataset.y = item.cardY;

  card.innerHTML = `
    <h3>${item.cidade}</h3>
    <p>${item.estadio} · ${item.capacidade}</p>
    <small>${item.pais}</small>
    <button class="favorite-stadium-btn ${favoritado ? "is-favorite" : ""}" type="button" data-favorite-stadium="${stadiumSlug}">
      ${favoritado ? "Remover favorito" : "Favoritar estádio"}
    </button>
  `;

  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    const vaiAbrir = !card.classList.contains("is-open");
    fecharTodosCards();

    if (vaiAbrir) {
      pin.classList.add("is-open");
      card.classList.add("is-open");
    }
  });

  card.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  card.querySelector("[data-favorite-stadium]").addEventListener("click", (event) => {
    event.stopPropagation();
    alternarFavoritoEstadio(item);
  });

  estadiosLayer.appendChild(pin);
  estadiosLayer.appendChild(card);
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
  document.querySelectorAll(".estadio-pin").forEach(pin => {
    const ponto = calcularPontoNoMapa(pin.dataset.x, pin.dataset.y);
    pin.style.left = `${ponto.left}px`;
    pin.style.top = `${ponto.top}px`;
  });

  document.querySelectorAll(".estadio-card").forEach(card => {
    const ponto = calcularPontoNoMapa(card.dataset.x, card.dataset.y);
    const margem = 14;
    const metadeCard = card.offsetWidth / 2;

    card.style.left = `${Math.min(Math.max(ponto.left, metadeCard + margem), mapaBase.clientWidth - metadeCard - margem)}px`;
    card.style.top = `${Math.min(Math.max(ponto.top, 84), mapaBase.clientHeight - margem)}px`;
  });
}

async function renderizarMapa() {
  usuarioAtual = await getCurrentUser();
  await updateHeaderUser();
  await carregarFavoritosEstadios();
  estadios.forEach(criarEstadioPin);
  posicionarElementosDoMapa();
}

document.addEventListener("click", fecharTodosCards);
window.addEventListener("resize", posicionarElementosDoMapa);

renderizarMapa();
