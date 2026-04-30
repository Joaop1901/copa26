const API_BASE = "https://api.wc2026api.com";
const API_KEY = "wc26_BYhbyQezyWzy8sCggqf8ii";

const calendarioEl = document.getElementById("calendario");
const filtroTimeEl = document.getElementById("filtro-time");
const filtroFaseEl = document.getElementById("filtro-fase");
const totalJogosEl = document.getElementById("total-jogos");

const tradutorPaises = {
    "Brazil": "Brasil", "Mexico": "México", "South Africa": "África do Sul",
    "Korea Republic": "Coreia do Sul", "Czechia": "Chéquia", "Canada": "Canadá",
    "Bosnia-Herzegovina": "Bósnia e Herz.", "USA": "EUA", "Switzerland": "Suíça"
};

function traduzir(nome) {
    if (!nome) return "A definir";
    return tradutorPaises[nome] || nome;
}

async function buscarDadosDaCopa() {
    try {
        const response = await fetch(`${API_BASE}/matches`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const dados = await response.json();
        const jogos = Array.isArray(dados) ? dados : (dados.data || []);

        renderizar(jogos);

    } catch (error) {
        console.error("Erro:", error);
        calendarioEl.innerHTML = "<p class='vazio'>Erro ao carregar dados.</p>";
    }
}

function renderizar(jogos) {
    if (!jogos || jogos.length === 0) return;

    totalJogosEl.textContent = jogos.length;

    const grupos = jogos.reduce((acc, jogo) => {
        let dataKey = "Data a definir";

        if (jogo.date_time) {
            const d = new Date(jogo.date_time);

            if (!isNaN(d)) {
                // pega data local corretamente
                dataKey = d.toLocaleDateString('sv-SE'); // formato YYYY-MM-DD
            }
        }

        acc[dataKey] = acc[dataKey] || [];
        acc[dataKey].push(jogo);
        return acc;
    }, {});

    calendarioEl.innerHTML = Object.keys(grupos)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(data => {

            let dataTitulo = data;

            if (data !== "Data a definir") {
                const d = new Date(data + "T12:00:00");

                if (!isNaN(d)) {
                    dataTitulo = d.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long'
                    });
                }
            }

            return `
                <div class="dia">
                    <h2 class="dia-titulo" style="color: #0b5cff; border-bottom: 2px solid #0b5cff; margin-bottom: 15px; padding-bottom: 5px; text-transform: lowercase;">
                        ${dataTitulo}
                    </h2>

                    ${grupos[data].map(jogo => {

                        const timeCasa = jogo.home_team_en || jogo.home_team || jogo.casa;
                        const timeFora = jogo.away_team_en || jogo.away_team || jogo.fora;
                        const estadio = jogo.stadium || jogo.venue || "Estádio a definir";

                        // ✅ HORÁRIO CORRIGIDO
                        let horario = "--:--";

                       function extrairDataHora(jogo) {
    const possiveisCampos = [
        jogo.date_time,
        jogo.utc_date,
        jogo.datetime,
        jogo.match_datetime,
        jogo.kickoff_time
    ];

    for (let campo of possiveisCampos) {
        if (campo) {
            const d = new Date(campo);

            if (!isNaN(d)) {
                return d;
            }
        }
    }

    return null;
}

                        const fase = jogo.stage_name || jogo.group || jogo.fase || "Grupo";

                        return `
                        <div class="jogo" style="background:#fff; border-radius:15px; padding:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; border:1px solid #eef2f7;">
                            
                            <div>
                                <div style="font-size: 1.1rem; margin-bottom: 8px;">
                                    <strong>${traduzir(timeCasa)}</strong> 
                                    <span style="color:#ccc; margin:0 5px;">vs</span> 
                                    <strong>${traduzir(timeFora)}</strong>
                                </div>

                                <div style="font-size: 0.85rem; color:#888;">
                                    📍 ${estadio}
                                </div>
                            </div>

                            <div style="text-align:right;">
                                <div style="color:#0b5cff; font-weight:bold; font-size:1.1rem; margin-bottom:5px;">
                                    ${horario}
                                </div>

                                <span style="background:#f0f4ff; color:#5f6f94; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:bold;">
                                    ${fase}
                                </span>
                            </div>

                        </div>
                        `;
                    }).join('')}
                </div>
            `;
        }).join('');
}

buscarDadosDaCopa();
