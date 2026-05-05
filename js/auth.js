/**
 * auth.js
 * Funções de autenticação reutilizáveis
 */

async function getCurrentSession() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Erro ao obter sessão:", error);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error("Erro em getCurrentSession:", error);
    return null;
  }
}

async function getCurrentUser() {
  try {
    const session = await getCurrentSession();
    return session?.user || null;
  } catch (error) {
    console.error("Erro em getCurrentUser:", error);
    return null;
  }
}

async function isLoggedIn() {
  const session = await getCurrentSession();
  return Boolean(session);
}

async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error);
    }

    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro em logout:", error);
    window.location.href = "login.html";
  }
}

async function requireLogin() {
  try {
    const logged = await isLoggedIn();

    if (!logged) {
      window.location.href = "login.html";
      return null;
    }

    return getCurrentUser();
  } catch (error) {
    console.error("Erro em requireLogin:", error);
    window.location.href = "login.html";
    return null;
  }
}

function getPaginaAtual() {
  const caminho = window.location.pathname;
  const pagina = caminho.split("/").pop();

  return pagina || "index.html";
}

function montarLinkAtivo(href, texto) {
  const paginaAtual = getPaginaAtual();
  const ativo = paginaAtual === href ? "is-active" : "";

  return `<a href="${href}" class="${ativo}">${texto}</a>`;
}

async function updateHeaderUser() {
  try {
    const containers = document.querySelectorAll("[data-auth-nav]");

    if (!containers.length) return;

    const user = await getCurrentUser();

    containers.forEach((container) => {
      const baseLinks = `
        ${montarLinkAtivo("index.html", "Calendário")}
        ${montarLinkAtivo("grupos.html", "Grupos")}
        ${montarLinkAtivo("estadios.html", "Estádios")}
        ${montarLinkAtivo("noticias.html", "Notícias")}
      `;

      if (user) {
        container.innerHTML = `
          ${baseLinks}
          ${montarLinkAtivo("favoritos.html", "Favoritos")}
          ${montarLinkAtivo("perfil.html", "Perfil")}
          <button type="button" data-logout-btn>Sair</button>
        `;

        return;
      }

      container.innerHTML = `
        ${baseLinks}
        ${montarLinkAtivo("login.html", "Entrar")}
      `;
    });

    document.querySelectorAll("[data-logout-btn]").forEach((button) => {
      button.addEventListener("click", logout);
    });
  } catch (error) {
    console.error("Erro em updateHeaderUser:", error);
  }
}

// Expõe globalmente
window.getCurrentSession = getCurrentSession;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.logout = logout;
window.requireLogin = requireLogin;
window.updateHeaderUser = updateHeaderUser;