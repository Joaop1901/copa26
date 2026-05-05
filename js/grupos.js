/**
 * grupos.js
 * Página de grupos - seleções para acompanhar
 */

const gruposEl = document.getElementById("grupos");
const messageEl = document.getElementById("app-message") || document.createElement("div");

let usuarioAtual = null;
let selecoesAcompanhadas = new Set();

const gruposCopa = [
  {
    grupo: "Grupo A",
    times: [
      { nome: "México", codigo: "mx" },
      { nome: "África do Sul", codigo: "za" },
      { nome: "Coreia do Sul", codigo: "kr" },
      { nome: "República Tcheca", codigo: "cz" }
    ]
  },
  {
    grupo: "Grupo B",
    times: [
      { nome: "Canadá", codigo: "ca" },
      { nome: "Catar", codigo: "qa" },
      { nome: "Suíça", codigo: "ch" },
      { nome: "Bósnia e Herzegovina", codigo: "ba" }
    ]
  },
  {
    grupo: "Grupo C",
    times: [
      { nome: "Brasil", codigo: "br" },
      { nome: "Marrocos", codigo: "ma" },
      { nome: "Haiti", codigo: "ht" },
      { nome: "Escócia", codigo: "gb-sct" }
    ]
  },
  {
    grupo: "Grupo D",
    times: [
      { nome: "Estados Unidos", codigo: "us" },
      { nome: "Paraguai", codigo: "py" },
      { nome: "Austrália", codigo: "au" },
      { nome: "Turquia", codigo: "tr" }
    ]
  },
  {
    grupo: "Grupo E",
    times: [
      { nome: "Alemanha", codigo: "de" },
      { nome: "Curaçau", codigo: "cw" },
      { nome: "Costa do Marfim", codigo: "ci" },
      { nome: "Equador", codigo: "ec" }
    ]
  },
  {
    grupo: "Grupo F",
    times: [
      { nome: "Holanda", codigo: "nl" },
      { nome: "Japão", codigo: "jp" },
      { nome: "Tunísia", codigo: "tn" },
      { nome: "Suécia", codigo: "se" }
    ]
  },
  {
    grupo: "Grupo G",
    times: [
      { nome: "Bélgica", codigo: "be" },
      { nome: "Egito", codigo: "eg" },
      { nome: "Irã", codigo: "ir" },
      { nome: "Nova Zelândia", codigo: "nz" }
    ]
  },
  {
    grupo: "Grupo H",
    times: [
      { nome: "Espanha", codigo: "es" },
      { nome: "Cabo Verde", codigo: "cv" },
      { nome: "Arábia Saudita", codigo: "sa" },
      { nome: "Uruguai", codigo: "uy" }
    ]
  },
  {
    grupo: "Grupo I",
    times: [
      { nome: "França", codigo: "fr" },
      { nome: "Iraque", codigo: "iq" },
      { nome: "Senegal", codigo: "sn" },
      { nome: "Noruega", codigo: "no" }
    ]
  },
  {
    grupo: "Grupo J",
    times: [
      { nome: "Argentina", codigo: "ar" },
      { nome: "Argélia", codigo: "dz" },
      { nome: "Áustria", codigo: "at" },
      { nome: "Jordânia", codigo: "jo" }
    ]
  },
  {
    grupo: "Grupo K",
    times: [
      { nome: "RD Congo", codigo: "cd" },
      { nome: "Portugal", codigo: "pt" },
      { nome: "Uzbequistão", codigo: "uz" },
      { nome: "Colômbia", codigo: "co" }
    ]
  },
  {
    grupo: "Grupo L",
    times: [
      { nome: "Inglaterra", codigo: "gb-eng" },
      { nome: "Croácia", codigo: "hr" },
      { nome: "Gana", codigo: "gh" },
      { nome: "Panamá", codigo: "pa" }
    ]
  }
];

function mostrarMensagem(mensagem, tipo = "") {
  if (!messageEl) return;
  messageEl.textContent = mensagem;
  messageEl.className = "app-message";
  if (tipo) messageEl.classList.add(tipo);
  
  setTimeout(() => {
    messageEl.textContent = "";
    messageEl.className = "app-message";
  }, 3000);
}

function normalizar(nome) {
  return nome?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function gerarUrlBandeira(codigo) {
  return `https://flagcdn.com/w40/${codigo}.png`;
}

async function carregarSelecoesAcompanhadas() {
  selecoesAcompanhadas.clear();
  if (!usuarioAtual) return;

  try {
    const acompanhadas = await userData.getFollowedTeams(usuarioAtual.id);
    selecoesAcompanhadas = new Set(acompanhadas.map(t => normalizar(t.team_name)));
  } catch (error) {
    console.error("Erro ao carregar seleções acompanhadas:", error);
  }
}

async function alternarSelecaoAcompanhada(nomeTime, nomeGrupo) {
  if (!usuarioAtual) {
    mostrarMensagem("Você precisa entrar para usar essa função.", "error");
    window.location.href = "login.html";
    return;
  }

  const nomeNormalizado = normalizar(nomeTime);

  try {
    if (selecoesAcompanhadas.has(nomeNormalizado)) {
      // Remove
      await userData.unfollowTeam(usuarioAtual.id, nomeTime);
      selecoesAcompanhadas.delete(nomeNormalizado);
      mostrarMensagem("Seleção removida dos acompanhados.", "success");
    } else {
      // Adiciona
      await userData.followTeam({
        user_id: usuarioAtual.id,
        team_name: nomeTime,
        team_code: "",
        group_name: nomeGrupo,
        country_code: ""
      });
      selecoesAcompanhadas.add(nomeNormalizado);
      mostrarMensagem("Seleção adicionada aos acompanhados.", "success");
    }

    atualizarVisualSelecao(nomeTime);
  } catch (error) {
    console.error("Erro ao alternar seleção:", error);
    mostrarMensagem("Erro ao salvar. Tente novamente.", "error");
  }
}

function atualizarVisualSelecao(nomeTime) {
  document.querySelectorAll(`[data-team-name="${nomeTime}"]`).forEach(btn => {
    const nomeNormalizado = normalizar(nomeTime);
    const acompanhada = selecoesAcompanhadas.has(nomeNormalizado);
    btn.classList.toggle("is-following", acompanhada);
    btn.textContent = acompanhada ? "★ Acompanhando" : "☆ Acompanhar";
  });
}

function renderizarGrupos() {
  gruposEl.innerHTML = gruposCopa.map(grupo => {
    return `
      <article class="grupo-card">
        <h2 class="grupo-titulo">${grupo.grupo}</h2>

        <ul class="times">
          ${grupo.times.map(time => {
            const nomeNormalizado = normalizar(time.nome);
            const estaAcompanhada = selecoesAcompanhadas.has(nomeNormalizado);
            
            return `
              <li class="time">
                <img 
                  src="${gerarUrlBandeira(time.codigo)}" 
                  alt="Bandeira de ${time.nome}"
                  loading="lazy"
                >
                <strong>${time.nome}</strong>
                <button 
                  type="button" 
                  class="follow-team-btn ${estaAcompanhada ? "is-following" : ""}"
                  data-team-name="${time.nome}"
                  data-group-name="${grupo.grupo}"
                >
                  ${estaAcompanhada ? "★ Acompanhando" : "☆ Acompanhar"}
                </button>
              </li>
            `;
          }).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function adicionarEventosSelecoes() {
  document.querySelectorAll("[data-team-name]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const nomeTime = btn.dataset.teamName;
      const nomeGrupo = btn.dataset.groupName;
      alternarSelecaoAcompanhada(nomeTime, nomeGrupo);
    });
  });
}

async function iniciarGrupos() {
  usuarioAtual = await getCurrentUser();
  await updateHeaderUser();
  
  if (usuarioAtual) {
    await carregarSelecoesAcompanhadas();
  }
  
  renderizarGrupos();
  adicionarEventosSelecoes();
}

iniciarGrupos();
