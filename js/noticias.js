/**
 * noticias.js
 * Página de notícias da Copa 2026 usando GNews API
 * Versão com múltiplas tentativas para evitar articles vazio.
 */

const GNEWS_API_KEY = "739cd4764318b45c5c123b6b57d37999";

const newsListEl = document.getElementById("news-list");
const newsMessageEl = document.getElementById("news-message");
const newsSearchEl = document.getElementById("news-search");
const newsTopicEl = document.getElementById("news-topic");
const reloadNewsBtn = document.getElementById("reload-news");

const noticiasFallback = [
  {
    title: "Copa do Mundo 2026 terá 48 seleções",
    description: "A edição de 2026 será a primeira com 48 seleções, ampliando o número de partidas e países participantes.",
    url: "https://www.fifa.com",
    image: "",
    source: { name: "FIFA" },
    publishedAt: "2026-01-01T12:00:00Z"
  },
  {
    title: "Estados Unidos, México e Canadá serão os países-sede",
    description: "A Copa de 2026 será realizada em três países, com estádios espalhados pela América do Norte.",
    url: "https://www.fifa.com",
    image: "",
    source: { name: "FIFA" },
    publishedAt: "2026-01-01T12:00:00Z"
  },
  {
    title: "Final da Copa 2026 será em New York/New Jersey",
    description: "O MetLife Stadium receberá a final da Copa do Mundo de 2026.",
    url: "https://www.fifa.com",
    image: "",
    source: { name: "FIFA" },
    publishedAt: "2026-01-01T12:00:00Z"
  }
];

function mostrarMensagem(mensagem, tipo = "") {
  if (!newsMessageEl) return;

  newsMessageEl.textContent = mensagem;
  newsMessageEl.className = "app-message";

  if (tipo) {
    newsMessageEl.classList.add(tipo);
  }
}

function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarData(data) {
  if (!data) return "Data não informada";

  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data não informada";
  }

  return dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function montarQueryNoticias() {
  const busca = newsSearchEl.value.trim();
  const tema = newsTopicEl.value;

  if (busca) {
    return `${busca} Copa do Mundo 2026`;
  }

  return tema || "Copa do Mundo 2026";
}

function montarUrlGNews(endpoint, parametros) {
  const params = new URLSearchParams({
    max: "10",
    apikey: GNEWS_API_KEY,
    ...parametros
  });

  return `https://gnews.io/api/v4/${endpoint}?${params.toString()}`;
}

async function consultarGNews(endpoint, parametros) {
  const url = montarUrlGNews(endpoint, parametros);

  console.log("Tentando buscar notícias:", {
    endpoint,
    parametros,
    url
  });

  const response = await fetch(url);

  let dados = null;

  try {
    dados = await response.json();
  } catch (error) {
    console.warn("Resposta não veio em JSON:", error);
  }

  if (!response.ok) {
    console.error("Erro detalhado da GNews:", {
      status: response.status,
      dados
    });

    throw new Error(`Erro na API: ${response.status}`);
  }

  const artigos = Array.isArray(dados?.articles) ? dados.articles : [];

  console.log("Resposta da GNews:", {
    endpoint,
    totalArticles: dados?.totalArticles,
    artigosRecebidos: artigos.length
  });

  return artigos;
}

function montarTentativasDeBusca() {
  const queryUsuario = montarQueryNoticias();

  return [
    {
      endpoint: "search",
      parametros: {
        q: queryUsuario,
        lang: "pt",
        country: "br",
        sortby: "publishedAt"
      },
      descricao: queryUsuario
    },
    {
      endpoint: "search",
      parametros: {
        q: queryUsuario,
        lang: "pt",
        sortby: "publishedAt"
      },
      descricao: queryUsuario
    },
    {
      endpoint: "search",
      parametros: {
        q: "Copa do Mundo 2026",
        lang: "pt",
        sortby: "publishedAt"
      },
      descricao: "Copa do Mundo 2026"
    },
    {
      endpoint: "search",
      parametros: {
        q: "FIFA World Cup 2026",
        lang: "en",
        sortby: "publishedAt"
      },
      descricao: "FIFA World Cup 2026"
    },
    {
      endpoint: "search",
      parametros: {
        q: "World Cup 2026",
        lang: "en",
        sortby: "publishedAt"
      },
      descricao: "World Cup 2026"
    },
    {
      endpoint: "search",
      parametros: {
        q: "FIFA",
        lang: "pt",
        sortby: "publishedAt"
      },
      descricao: "FIFA"
    },
    {
      endpoint: "top-headlines",
      parametros: {
        q: "FIFA",
        lang: "pt"
      },
      descricao: "manchetes sobre FIFA"
    },
    {
      endpoint: "top-headlines",
      parametros: {
        category: "sports",
        lang: "pt",
        country: "br"
      },
      descricao: "manchetes esportivas do Brasil"
    }
  ];
}

async function buscarNoticias() {
  try {
    mostrarMensagem("Carregando notícias...");

    if (!GNEWS_API_KEY || GNEWS_API_KEY === "COLE_SUA_API_KEY_AQUI") {
      throw new Error("API Key da GNews não configurada.");
    }

    const tentativas = montarTentativasDeBusca();

    for (const tentativa of tentativas) {
      try {
        const noticias = await consultarGNews(tentativa.endpoint, tentativa.parametros);

        if (noticias.length > 0) {
          renderizarNoticias(noticias);
          mostrarMensagem(`Mostrando notícias sobre: ${tentativa.descricao}`, "success");
          return;
        }
      } catch (error) {
        console.warn("Essa tentativa falhou:", tentativa, error);
      }
    }

    throw new Error("Nenhuma notícia encontrada em nenhuma tentativa.");
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);

    renderizarNoticias(noticiasFallback);

    const mensagem = String(error.message || "");

    if (mensagem.includes("401")) {
      mostrarMensagem("API Key inválida ou não autorizada. Verifique sua chave da GNews.", "error");
      return;
    }

    if (mensagem.includes("403")) {
      mostrarMensagem("Limite diário atingido ou plano bloqueou a requisição.", "error");
      return;
    }

    if (mensagem.includes("429")) {
      mostrarMensagem("Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.", "error");
      return;
    }

    mostrarMensagem("A API respondeu, mas não encontrou notícias com esses filtros. Mostrando notícias fixas do projeto.", "error");
  }
}

function renderizarNoticias(noticias) {
  if (!newsListEl) return;

  newsListEl.innerHTML = noticias.map((noticia) => {
    const titulo = noticia.title || "Título não informado";
    const descricao = noticia.description || "Descrição não disponível.";
    const imagem = noticia.image || "";
    const fonte = noticia.source?.name || "Fonte não informada";
    const data = formatarData(noticia.publishedAt);
    const url = noticia.url || "#";

    return `
      <article class="news-card">
        <div class="news-image">
          ${
            imagem
              ? `<img src="${escapeHTML(imagem)}" alt="${escapeHTML(titulo)}">`
              : `<div class="news-image-placeholder">World Cup 2026</div>`
          }
        </div>

        <div class="news-content">
          <div class="news-meta">
            <span>${escapeHTML(fonte)}</span>
            <span>${escapeHTML(data)}</span>
          </div>

          <h2>${escapeHTML(titulo)}</h2>

          <p>${escapeHTML(descricao)}</p>

          <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">
            Ler notícia completa
          </a>
        </div>
      </article>
    `;
  }).join("");
}

if (reloadNewsBtn) {
  reloadNewsBtn.addEventListener("click", buscarNoticias);
}

if (newsSearchEl) {
  newsSearchEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscarNoticias();
    }
  });
}

if (newsTopicEl) {
  newsTopicEl.addEventListener("change", buscarNoticias);
}

async function iniciarPaginaNoticias() {
  if (typeof updateHeaderUser === "function") {
    await updateHeaderUser();
  }

  await buscarNoticias();
}

iniciarPaginaNoticias();