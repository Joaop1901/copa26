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

function getRedirectUrl() {
  return new URL("login.html", window.location.href).href;
}

async function verificarSessaoAtual() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Erro ao verificar sessão:", error);
      return;
    }

    if (data.session) {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Erro inesperado ao verificar sessão:", error);
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

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Erro ao entrar:", error);

    const mensagem = String(error.message || "").toLowerCase();

    if (mensagem.includes("email not confirmed")) {
      mostrarStatus(
        "Sua conta foi criada, mas o e-mail ainda não foi confirmado. Confirme o e-mail ou desative Confirm Email no Supabase.",
        "error"
      );
      return;
    }

    if (mensagem.includes("invalid login credentials")) {
      mostrarStatus("E-mail ou senha inválidos.", "error");
      return;
    }

    mostrarStatus(error.message || "Erro ao entrar na conta.", "error");
    return;
  }

  if (!data.session) {
    mostrarStatus("Login não gerou sessão. Verifique as configurações do Supabase.", "error");
    return;
  }

  mostrarStatus("Login realizado com sucesso!", "success");

sessionStorage.setItem("mostrarVideoAbertura", "true");

setTimeout(() => {
  window.location.href = "index.html";
}, 700);
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

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectUrl(),
      data: {
        full_name: ""
      }
    }
  });

  if (error) {
    console.error("Erro ao criar conta:", error);
    mostrarStatus(error.message || "Erro ao criar conta.", "error");
    return;
  }

  console.log("Conta criada:", data);

  if (data.session) {
  mostrarStatus("Conta criada e login realizado com sucesso!", "success");

  sessionStorage.setItem("mostrarVideoAbertura", "true");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 700);

  return;
}

  mostrarStatus(
    "Conta criada. Confirme seu e-mail antes de entrar, ou desative Confirm Email no Supabase para testes.",
    "success"
  );
});

verificarSessaoAtual();