const gruposEl = document.getElementById("grupos");

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

function gerarUrlBandeira(codigo) {
  return `https://flagcdn.com/w40/${codigo}.png`;
}

function renderizarGrupos() {
  gruposEl.innerHTML = gruposCopa.map(grupo => {
    return `
      <article class="grupo-card">
        <h2 class="grupo-titulo">${grupo.grupo}</h2>

        <ul class="times">
          ${grupo.times.map(time => `
            <li class="time">
              <img 
                src="${gerarUrlBandeira(time.codigo)}" 
                alt="Bandeira de ${time.nome}"
                loading="lazy"
              >
              <strong>${time.nome}</strong>
            </li>
          `).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

renderizarGrupos();
updateHeaderUser();
