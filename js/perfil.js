/**
 * perfil.js
 * Lógica da página de perfil com upload de avatar.
 *
 * Observação:
 * O card de preferências foi removido para simplificar a apresentação.
 * Esta página agora salva apenas dados principais do perfil e avatar.
 */

const profileForm = document.getElementById("profile-form");
const messageEl = document.getElementById("profile-message");

const avatarFileInput = document.getElementById("avatar-file");
const avatarPreview = document.getElementById("avatar-preview");
const avatarPlaceholder = document.getElementById("avatar-placeholder");

const heroAvatarPreview = document.getElementById("hero-avatar-preview");
const heroAvatarPlaceholder = document.getElementById("hero-avatar-placeholder");

let currentUser = null;
let avatarUrlAtual = "";

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
  }, 4000);
}

function atualizarPreviewAvatar(url) {
  const temAvatar = Boolean(url);

  avatarUrlAtual = url || "";

  if (avatarPreview) {
    avatarPreview.src = temAvatar ? url : "";
    avatarPreview.classList.toggle("is-visible", temAvatar);
  }

  if (avatarPlaceholder) {
    avatarPlaceholder.style.display = temAvatar ? "none" : "grid";
  }

  if (heroAvatarPreview) {
    heroAvatarPreview.src = temAvatar ? url : "";
    heroAvatarPreview.classList.toggle("is-visible", temAvatar);
  }

  if (heroAvatarPlaceholder) {
    heroAvatarPlaceholder.style.display = temAvatar ? "none" : "grid";
  }
}

function validarArquivoAvatar(file) {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(file.type)) {
    throw new Error("Use apenas imagens JPG, PNG ou WEBP.");
  }

  const tamanhoMaximoMB = 2;
  const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;

  if (file.size > tamanhoMaximoBytes) {
    throw new Error("A imagem precisa ter no máximo 2MB.");
  }
}

function obterExtensaoArquivo(file) {
  const extensao = file.name.split(".").pop()?.toLowerCase();

  if (extensao) {
    return extensao;
  }

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";

  return "png";
}

async function uploadAvatarSeNecessario() {
  const file = avatarFileInput?.files?.[0];

  if (!file) {
    return avatarUrlAtual || null;
  }

  validarArquivoAvatar(file);

  const extensao = obterExtensaoArquivo(file);
  const caminhoArquivo = `${currentUser.id}/avatar-${Date.now()}.${extensao}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("avatars")
    .upload(caminhoArquivo, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    console.error("Erro ao enviar avatar:", uploadError);
    throw new Error("Erro ao enviar foto de perfil.");
  }

  const { data } = supabaseClient.storage
    .from("avatars")
    .getPublicUrl(caminhoArquivo);

  if (!data?.publicUrl) {
    throw new Error("Não foi possível gerar a URL da foto.");
  }

  return data.publicUrl;
}

async function carregarPerfil() {
  try {
    const profile = await userData.getProfile(currentUser.id);

    if (profile) {
      document.getElementById("full-name").value = profile.full_name || "";
      document.getElementById("username").value = profile.username || "";
      document.getElementById("favorite-team").value = profile.favorite_team || "";

      atualizarPreviewAvatar(profile.avatar_url || "");
      return;
    }

    atualizarPreviewAvatar("");
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    mostrarMensagem("Erro ao carregar dados do perfil.", "error");
  }
}

async function salvarPerfil() {
  try {
    const fullName = document.getElementById("full-name").value.trim();
    const username = document.getElementById("username").value.trim();
    const favoriteTeam = document.getElementById("favorite-team").value.trim();

    mostrarMensagem("Salvando perfil...");

    const avatarUrl = await uploadAvatarSeNecessario();

    await userData.upsertProfile({
      id: currentUser.id,
      full_name: fullName || null,
      username: username || null,
      favorite_team: favoriteTeam || null,
      avatar_url: avatarUrl || null
    });

    atualizarPreviewAvatar(avatarUrl || "");

    if (avatarFileInput) {
      avatarFileInput.value = "";
    }

    mostrarMensagem("Perfil salvo com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    mostrarMensagem(error.message || "Erro ao salvar perfil.", "error");
  }
}

if (avatarFileInput) {
  avatarFileInput.addEventListener("change", () => {
    const file = avatarFileInput.files?.[0];

    if (!file) return;

    try {
      validarArquivoAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      atualizarPreviewAvatar(previewUrl);
    } catch (error) {
      avatarFileInput.value = "";
      mostrarMensagem(error.message, "error");
    }
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await salvarPerfil();
  });
}

async function iniciarPerfil() {
  currentUser = await requireLogin();

  if (!currentUser) return;

  await updateHeaderUser();
  await carregarPerfil();
}

iniciarPerfil();
