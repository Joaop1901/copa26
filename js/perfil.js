const profileForm = document.getElementById("profile-form");
const preferencesForm = document.getElementById("preferences-form");
const messageEl = document.getElementById("profile-message");

let currentUser = null;

function mostrarMensagem(mensagem, tipo = "") {
  messageEl.textContent = mensagem;
  messageEl.className = "app-message";
  if (tipo) messageEl.classList.add(tipo);
}

async function carregarPerfil() {
  try {
    const profile = await userData.getProfile(currentUser.id);

    document.getElementById("full-name").value = profile?.full_name || "";
    document.getElementById("username").value = profile?.username || "";
    document.getElementById("favorite-team").value = profile?.favorite_team || "";
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function salvarPerfil() {
  try {
    await userData.updateProfile(currentUser.id, {
      full_name: document.getElementById("full-name").value.trim() || null,
      username: document.getElementById("username").value.trim() || null,
      favorite_team: document.getElementById("favorite-team").value.trim() || null
    });

    mostrarMensagem("Perfil atualizado com sucesso.", "success");
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao salvar seu perfil.", "error");
  }
}

async function carregarPreferencias() {
  try {
    const preferences = await userData.getPreferences(currentUser.id);

    document.getElementById("language").value = preferences?.language || "pt-BR";
    document.getElementById("theme").value = preferences?.theme || "dark";
    document.getElementById("receive-notifications").checked = Boolean(preferences?.receive_notifications);
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar seus dados.", "error");
  }
}

async function salvarPreferencias() {
  try {
    await userData.updatePreferences(currentUser.id, {
      language: document.getElementById("language").value,
      theme: document.getElementById("theme").value,
      receive_notifications: document.getElementById("receive-notifications").checked
    });

    mostrarMensagem("Preferências atualizadas com sucesso.", "success");
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao salvar suas preferências.", "error");
  }
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await salvarPerfil();
});

preferencesForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await salvarPreferencias();
});

async function iniciarPerfil() {
  currentUser = await requireLogin();
  if (!currentUser) return;

  await updateHeaderUser();
  await Promise.all([carregarPerfil(), carregarPreferencias()]);
}

iniciarPerfil();
