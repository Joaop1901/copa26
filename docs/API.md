# Documentação da API / Backend

## Visão geral

Nesta fase, o backend do projeto é baseado no Supabase. Ele fornece autenticação, banco de dados, storage e API automática para acesso aos dados.

A aplicação web em HTML, CSS e JavaScript consome esses serviços diretamente pelo SDK oficial do Supabase no navegador.

## Serviços utilizados

| Serviço | Função no projeto |
|---|---|
| Supabase Auth | Login, cadastro, sessão e logout |
| Supabase Database | Armazenamento de perfil, favoritos e preferências |
| Supabase Storage | Upload e acesso ao avatar do usuário |
| GNews API | Busca de notícias da Copa 2026 |
| JSON local | Base de jogos da Copa 2026 |

## Arquivos responsáveis pela comunicação

| Arquivo | Responsabilidade |
|---|---|
| `js/supabaseClient.js` | Cria a conexão com o Supabase |
| `js/auth.js` | Controla sessão, usuário atual, logout e navbar |
| `js/userData.js` | Centraliza operações de dados no Supabase |
| `js/noticias.js` | Busca notícias na GNews API e usa fallback local |
| `js/index.js` | Carrega jogos, favoritos e seleções acompanhadas |

## Autenticação

### Cadastro

Arquivo: `js/login.js`

```js
supabaseClient.auth.signUp({ email, password })
```

### Login

Arquivo: `js/login.js`

```js
supabaseClient.auth.signInWithPassword({ email, password })
```

### Sessão atual

Arquivo: `js/auth.js`

```js
supabaseClient.auth.getSession()
```

### Logout

Arquivo: `js/auth.js`

```js
supabaseClient.auth.signOut()
```

## Operações de dados

### Perfil do usuário

Tabela: `profiles`

Operações:

- Carregar perfil.
- Criar/atualizar perfil.
- Salvar nome, usuário, seleção favorita e avatar.

### Preferências

Tabela: `user_preferences`

Operações:

- Carregar preferências.
- Salvar idioma, tema e notificações.

### Favoritos de jogos

Tabela: `favorite_matches`

Operações:

- Listar jogos favoritos do usuário.
- Adicionar jogo favorito.
- Remover jogo favorito.

### Seleções acompanhadas

Tabela: `followed_teams`

Operações:

- Listar seleções acompanhadas.
- Acompanhar seleção.
- Remover seleção acompanhada.

### Estádios favoritos

Tabela: `favorite_stadiums`

Operações:

- Listar estádios favoritos.
- Adicionar estádio favorito.
- Remover estádio favorito.

## Notícias

Arquivo: `js/noticias.js`

A busca de notícias utiliza a GNews API. A lógica tenta diferentes combinações de busca e, caso não encontre resultados, usa notícias fixas de fallback.

Fluxo:

```txt
Busca principal
  ↓
Busca sem filtro de país
  ↓
Busca em inglês
  ↓
Top headlines / esportes
  ↓
Fallback local
```

## Dados dos jogos

Arquivo: `copa.json`

A base local contém os jogos usados pelo calendário. Essa decisão evita que o sistema dependa totalmente de APIs externas que podem retornar dados incompletos durante o desenvolvimento.

## Possível API REST própria em etapa futura

Caso seja necessário criar uma API REST própria, uma estrutura futura em Node.js/Express poderia ter rotas como:

```txt
GET /api/jogos
GET /api/jogos/:id
GET /api/estadios
GET /api/noticias
GET /api/status
```

Nesta fase, o Supabase já atua como backend em nuvem, fornecendo autenticação, banco, storage e API de dados.
