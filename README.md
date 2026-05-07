# Calendario da Copa 2026

Projeto web interativo para acompanhar a Copa do Mundo FIFA 2026, com calendario de jogos, grupos, mapa de estadios, noticias, perfil do usuario e sistema de favoritos.

## Objetivo

O objetivo do projeto e criar uma plataforma completa para que o usuario consiga acompanhar a Copa de 2026 de forma personalizada. O sistema permite login/cadastro, escolha de selecoes acompanhadas, favoritos de jogos e estadios, edicao de perfil, avatar e consulta de noticias.

## Status do projeto

- Versao Web funcional publicada em ambiente de hospedagem estatica.
- Estrutura PWA para instalacao no celular.
- Estrutura desktop com Electron.
- Supabase usado para autenticacao, banco de dados e avatar.
- Documentacao tecnica inicial com banco de dados, classes e casos de uso.

## Tecnologias, bibliotecas e servicos utilizados

| Nome | Versao/uso | Finalidade |
|---|---|---|
| HTML5 | Padrao Web | Estrutura das paginas. |
| CSS3 | Padrao Web | Estilizacao, responsividade e identidade visual. |
| JavaScript | ES6+ | Logica de interacao e regras do frontend. |
| `@supabase/supabase-js` | v2 via CDN | Comunicacao com Supabase Auth, Database e Storage. |
| Supabase Auth | Servico externo | Login, cadastro, sessao e logout. |
| Supabase Database | PostgreSQL gerenciado | Persistencia de perfil, favoritos e preferencias. |
| Supabase Storage | Bucket `avatars` | Upload e armazenamento de avatar. |
| GNews API | REST API | Busca de noticias da Copa. |
| PWA APIs | Manifest + Service Worker | Instalacao mobile e cache. |
| Electron | `^31.0.0` | Base para versao desktop. |
| Netlify | Hospedagem estatica | Deploy da versao Web/PWA. |

## Funcionalidades implementadas

- Cadastro e login com Supabase Auth.
- Navbar dinamica de acordo com usuario logado.
- Calendario com 104 jogos carregados por JSON local.
- Filtro por selecao e fase.
- Favoritos manuais de jogos.
- Selecoes acompanhadas.
- Jogos das selecoes acompanhadas marcados automaticamente.
- Estádios favoritos salvos no Supabase.
- Perfil do usuario com dados e avatar.
- Upload de avatar pelo Supabase Storage.
- Mapa interativo com pins dos estadios.
- Filtro dos estadios por pais: Canada, EUA e Mexico.
- Pagina de noticias com GNews API e fallback local.
- Video de abertura apos login/cadastro.
- Estrutura PWA para mobile.
- Estrutura Electron para desktop.

## Principios de POO aplicados

O projeto possui uma camada de modelos orientada a objetos em `js/models.js`, representando entidades como usuario, jogo, estadio, noticia e favoritos.

Principios utilizados:

- **Encapsulamento:** cada classe concentra seus dados e metodos.
- **Heranca:** classes principais herdam de `EntidadeBase`.
- **Polimorfismo:** metodos como `validar()` podem ter comportamentos diferentes em cada classe.
- **Abstracao:** repositorios e servicos escondem detalhes de persistencia e APIs externas.

## Estrutura de pastas

```txt
.
├── css/                  # Estilos por pagina
├── docs/                 # Documentacao tecnica
│   ├── API.md
│   ├── DER.md
│   ├── DIAGRAMA_CLASSES.md
│   ├── CASOS_DE_USO.md
│   ├── DOCUMENTACAO_TECNICA_V1.md
│   └── DEPLOY.md
├── img/                  # Imagens, mapa e icones
├── js/                   # Scripts JavaScript
│   ├── auth.js
│   ├── login.js
│   ├── index.js
│   ├── grupos.js
│   ├── estadios.js
│   ├── favoritos.js
│   ├── perfil.js
│   ├── noticias.js
│   ├── models.js
│   ├── pwa.js
│   └── supabaseClient.js
├── desktop/              # Estrutura Electron
├── supabase/             # Script SQL do banco
├── video/                # Video de abertura
├── copa.json             # Base local dos jogos
├── manifest.json         # Configuracao PWA
├── service-worker.js     # Service Worker/cache
└── README.md
```

## Paginas do sistema

| Pagina | Funcao |
|---|---|
| `index.html` | Calendario dos jogos, filtros, favoritos e video de abertura. |
| `login.html` | Login e cadastro de usuarios. |
| `grupos.html` | Grupos e selecoes acompanhadas. |
| `estadios.html` | Mapa interativo dos estadios e favoritos. |
| `favoritos.html` | Central de favoritos do usuario. |
| `perfil.html` | Dados do usuario, preferencias e avatar. |
| `noticias.html` | Noticias da Copa 2026 com API e fallback local. |

## Prints do projeto funcionando



```md
![Calendario](docs/prints/01-calendario.png)
![Login](docs/prints/02-login.png)
![Grupos](docs/prints/03-grupos.png)
![Estadios](docs/prints/04-estadios.png)
![Favoritos](docs/prints/05-favoritos.png)
![Perfil](docs/prints/06-perfil.png)
![Noticias](docs/prints/07-noticias.png)
![PWA Mobile](docs/prints/08-pwa-mobile.png)
```

## Como rodar localmente

1. Abra a pasta do projeto no Visual Studio Code.
2. Instale a extensao Live Server.
3. Clique com o botao direito em `index.html`.
4. Selecione **Open with Live Server**.
5. Acesse a URL local exibida pelo Live Server.

Exemplo:

```txt
http://127.0.0.1:5500/index.html
```

## Como rodar a versao desktop

```bash
cd desktop
npm install
npm start
```

## Configuracao do Supabase

O projeto usa Supabase para autenticacao, banco de dados e storage. O arquivo principal de conexao e:

```txt
js/supabaseClient.js
```

Para reproduzir o banco, use como base:

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
- icones em `img/icon-192.png` e `img/icon-512.png`

Com isso, o site pode ser instalado em dispositivos compativeis, funcionando como uma aplicacao mobile simples.

## Deploy

Configuracao usada/recomendada no Netlify:

```txt
Branch: main
Base directory: vazio
Build command: vazio
Publish directory: .
```

## Documentacao tecnica

Arquivos principais:

- `docs/DOCUMENTACAO_TECNICA_V1.md`
- `docs/DER.md`
- `docs/DIAGRAMA_CLASSES.md`
- `docs/CASOS_DE_USO.md`
- `docs/API.md`
- `docs/DEPLOY.md`

## Observacoes de seguranca

- Nunca subir senhas reais .
- Chaves de APIs publicas no frontend devem ter restricoes sempre que possivel.

## Referencias

- Supabase Docs: https://supabase.com/docs
- Electron Docs: https://www.electronjs.org/docs/latest
- MDN PWA: https://developer.mozilla.org/docs/Web/Progressive_web_apps
- Netlify Docs: https://docs.netlify.com
- GitHub Docs: https://docs.github.com
- GNews API: https://gnews.io/docs
