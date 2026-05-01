const loginForm = document.getElementById("login-form");
const signupBtn = document.getElementById("signup-btn");
const statusEl = document.getElementById("login-status");

function mostrarStatus(mensagem, tipo = "") {
  statusEl.textContent = mensagem;
  statusEl.className = "login-status";

  if (tipo) {
    statusEl.classList.add(tipo);
  }
}

function pegarDadosFormulario() {
  return {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim()
  };
}

async function verificarSessaoAtual() {
  const session = await getCurrentSession();

  if (session) {
    window.location.href = "index.html";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { email, password } = pegarDadosFormulario();

  if (!email || !password) {
    mostrarStatus("Preencha e-mail e senha.", "error");
    return;
  }

  mostrarStatus("Entrando...");

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    mostrarStatus("E-mail ou senha inválidos", "error");
    return;
  }

  mostrarStatus("Entrando...", "success");
  window.location.href = "index.html";
});

signupBtn.addEventListener("click", async () => {
  const { email, password } = pegarDadosFormulario();

  if (!email || !password) {
    mostrarStatus("Digite e-mail e senha para criar a conta.", "error");
    return;
  }

  if (password.length < 6) {
    mostrarStatus("A senha precisa ter pelo menos 6 caracteres.", "error");
    return;
  }

  mostrarStatus("Criando conta...");

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error(error);
    mostrarStatus(error.message || "Erro ao criar conta.", "error");
    return;
  }

  mostrarStatus("Conta criada com sucesso. Verifique seu e-mail, se necessário.", "success");
});

verificarSessaoAtual();
