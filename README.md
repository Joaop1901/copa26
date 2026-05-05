# Calendário da Copa 2026

Projeto web interativo para acompanhar a Copa do Mundo FIFA 2026, com calendário de jogos, grupos, mapa de estádios, notícias, perfil do usuário e sistema de favoritos.

## Objetivo

O objetivo do projeto é criar uma plataforma completa para que o usuário consiga acompanhar a Copa de 2026 de forma personalizada. O sistema permite login/cadastro, escolha de seleções acompanhadas, favoritos de jogos e estádios, edição de perfil, avatar e consulta de notícias.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- Supabase Auth
- Supabase Database
- Supabase Storage
- JSON local com jogos da Copa 2026
- GNews API para notícias
- PWA para adaptação mobile
- Electron para versão desktop

## Páginas do sistema

| Página | Função |
|---|---|
| `index.html` | Calendário dos jogos, filtros, favoritos e vídeo de abertura |
| `login.html` | Login e cadastro de usuários |
| `grupos.html` | Grupos e seleções acompanhadas |
| `estadios.html` | Mapa interativo dos estádios e favoritos |
| `favoritos.html` | Central de favoritos do usuário |
| `perfil.html` | Dados do usuário, preferências e avatar |
| `noticias.html` | Notícias da Copa 2026 com API e fallback local |

## Funcionalidades implementadas

- Cadastro e login com Supabase Auth.
- Navbar dinâmica de acordo com usuário logado.
- Calendário com 104 jogos carregados por JSON local.
- Filtro por seleção e por fase.
- Visualização em lista e calendário.
- Favoritos manuais de jogos.
- Seleções acompanhadas.
- Jogos das seleções acompanhadas marcados automaticamente com estrela.
- Estádios favoritos salvos no Supabase.
- Perfil do usuário com dados e avatar.
- Upload de avatar pelo Supabase Storage no bucket `avatars`.
- Mapa interativo com pins dos estádios.
- Filtro dos estádios por país: Canadá, EUA e México.
- Página de notícias com GNews API e fallback local.
- Vídeo de abertura após login/cadastro.
- Estrutura inicial de PWA para mobile.
- Estrutura inicial de Electron para desktop.

## Estrutura de pastas

```txt
.
├── css/
│   ├── estadios.css
│   ├── favoritos.css
│   ├── grupos.css
│   ├── login.css
│   ├── noticias.css
│   ├── perfil.css
│   └── stayle.css
├── docs/
│   ├── API.md
│   ├── DEPLOY.md
│   ├── DER.md
│   └── RELATORIO_FASE_1.md
├── img/
│   ├── mapa-estadios.png
│   ├── icon-192.png
│   └── icon-512.png
├── js/
│   ├── auth.js
│   ├── estadios.js
│   ├── favoritos.js
│   ├── grupos.js
│   ├── index.js
│   ├── login.js
│   ├── noticias.js
│   ├── perfil.js
│   ├── pwa.js
│   ├── supabaseClient.js
│   └── userData.js
├── supabase/
│   └── schema.sql
├── desktop/
│   ├── main.js
│   └── package.json
├── video/
│   └── abertura-copa.mp4.mp4
├── copa.json
├── manifest.json
├── service-worker.js
└── README.md
```

## Como rodar localmente

1. Abra a pasta do projeto no Visual Studio Code.
2. Instale a extensão Live Server, caso ainda não tenha.
3. Clique com o botão direito em `index.html`.
4. Selecione **Open with Live Server**.
5. Acesse a URL local exibida pelo Live Server.

Exemplo:

```txt
http://127.0.0.1:5500/index.html
```

## Configuração do Supabase

O projeto usa Supabase para autenticação, banco de dados e storage. O arquivo principal de conexão é:

```txt
js/supabaseClient.js
```

Para reproduzir o banco, use como base o arquivo:

```txt
supabase/schema.sql
```

Tabelas principais:

- `profiles`
- `user_preferences`
- `favorite_matches`
- `followed_teams`
- `favorite_stadiums`

Bucket utilizado:

```txt
avatars
```

## Mobile/PWA

O projeto possui estrutura de PWA com:

- `manifest.json`
- `service-worker.js`
- `js/pwa.js`
- ícones em `img/icon-192.png` e `img/icon-512.png`

Com isso, o site pode ser instalado em dispositivos compatíveis, funcionando como uma aplicação mobile simples.

## Desktop/Electron

A pasta `desktop/` contém uma estrutura inicial para empacotar o projeto como aplicativo desktop com Electron.

Para testar futuramente:

```bash
cd desktop
npm install
npm start
```

## Deploy sugerido

- Frontend Web: Vercel, Netlify ou GitHub Pages.
- Backend/Auth/Database/Storage: Supabase.
- Mobile: PWA instalável pelo navegador.
- Desktop: Electron.

## Observações de segurança

- Nunca suba senhas reais para o GitHub.
- Nunca use `service_role key` do Supabase no frontend.
- A `anon key` do Supabase pode ser usada no frontend, desde que as políticas RLS estejam configuradas corretamente.
- Chaves de APIs públicas no frontend devem ter restrições sempre que possível.

## Status da Fase 1

A versão web já possui as principais funcionalidades implementadas. As partes adicionadas nesta fase complementam a entrega com documentação, PWA/mobile, estrutura desktop e guia de deploy.
