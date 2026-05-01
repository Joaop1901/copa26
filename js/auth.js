async function getCurrentSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error(error);
    return null;
  }

  return data.session;
}

async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

async function isLoggedIn() {
  const session = await getCurrentSession();
  return Boolean(session);
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error(error);
  }

  window.location.href = "login.html";
}

async function requireLogin() {
  const logged = await isLoggedIn();

  if (!logged) {
    window.location.href = "login.html";
    return null;
  }

  return getCurrentUser();
}

async function updateHeaderUser() {
  const containers = document.querySelectorAll("[data-auth-nav]");
  if (!containers.length) return;

  const user = await getCurrentUser();

  containers.forEach(container => {
    const baseLinks = `
      <a href="index.html">Calendário</a>
      <a href="grupos.html">Grupos</a>
      <a href="estadios.html">Estádios</a>
    `;

    if (user) {
      container.innerHTML = `
        ${baseLinks}
        <a href="favoritos.html">Favoritos</a>
        <a href="perfil.html">Perfil</a>
        <button type="button" data-logout-btn>Sair</button>
      `;
      return;
    }

    container.innerHTML = `
      ${baseLinks}
      <a href="login.html">Entrar</a>
    `;
  });

  document.querySelectorAll("[data-logout-btn]").forEach(button => {
    button.addEventListener("click", logout);
  });
}

window.getCurrentSession = getCurrentSession;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.logout = logout;
window.requireLogin = requireLogin;
window.updateHeaderUser = updateHeaderUser;
