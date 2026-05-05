async function protegerPagina() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
  }
}

async function sairDaConta() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

protegerPagina();