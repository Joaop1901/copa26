# Diagrama de Classes - Calendario da Copa 2026

Este documento apresenta uma proposta de classes para representar as principais entidades do sistema, seus atributos, metodos e relacionamentos. O projeto usa JavaScript puro, mas a modelagem foi organizada com base em Programacao Orientada a Objetos para deixar clara a estrutura interna da aplicacao.

## Diagrama em Mermaid

> O GitHub renderiza diagramas Mermaid automaticamente em arquivos Markdown.

```mermaid
classDiagram
  class EntidadeBase {
    +string id
    +Date createdAt
    +constructor(id, createdAt)
    +validar() boolean
    +toJSON() object
  }

  class Usuario {
    +string email
    +string nome
    +string username
    +string avatarUrl
    +string favoriteTeam
    +atualizarPerfil(dados) void
    +alterarAvatar(url) void
    +validar() boolean
  }

  class Jogo {
    +string matchKey
    +string homeTeam
    +string awayTeam
    +string stage
    +string stadium
    +Date matchDate
    +boolean isFavorite
    +getTitulo() string
    +envolveSelecao(teamName) boolean
    +marcarFavorito() void
    +removerFavorito() void
  }

  class Estadio {
    +string stadiumSlug
    +string stadiumName
    +string city
    +string country
    +number pinX
    +number pinY
    +getLocalizacao() string
    +pertenceAoPais(country) boolean
  }

  class Noticia {
    +string titulo
    +string descricao
    +string fonte
    +string url
    +Date publicadaEm
    +boolean fallback
    +getResumo() string
  }

  class Favorito {
    +string userId
    +string itemId
    +string tipo
    +Date createdAt
    +validar() boolean
  }

  class JogoFavorito {
    +string matchKey
    +string homeTeam
    +string awayTeam
    +Date matchDate
    +string stadium
    +string stage
    +validar() boolean
  }

  class EstadioFavorito {
    +string stadiumSlug
    +string stadiumName
    +string city
    +string country
    +validar() boolean
  }

  class SelecaoAcompanhada {
    +string userId
    +string teamName
    +Date createdAt
    +validar() boolean
  }

  class PerfilRepositorio {
    +carregarPerfil(userId) Promise
    +salvarPerfil(userId, dados) Promise
    +uploadAvatar(userId, arquivo) Promise
  }

  class FavoritosRepositorio {
    +listarJogos(userId) Promise
    +adicionarJogo(userId, jogo) Promise
    +removerJogo(userId, matchKey) Promise
    +listarEstadios(userId) Promise
    +adicionarEstadio(userId, estadio) Promise
    +removerEstadio(userId, stadiumSlug) Promise
  }

  class TimesRepositorio {
    +listarSelecoes(userId) Promise
    +acompanharSelecao(userId, teamName) Promise
    +removerSelecao(userId, teamName) Promise
  }

  class NoticiasServico {
    +buscarNoticias(termo, tema) Promise
    +buscarFallback() Array~Noticia~
    +normalizarArtigo(artigo) Noticia
  }

  EntidadeBase <|-- Usuario
  EntidadeBase <|-- Jogo
  EntidadeBase <|-- Estadio
  EntidadeBase <|-- Noticia
  EntidadeBase <|-- Favorito
  Favorito <|-- JogoFavorito
  Favorito <|-- EstadioFavorito
  EntidadeBase <|-- SelecaoAcompanhada

  Usuario "1" --> "0..*" JogoFavorito : favorita
  Usuario "1" --> "0..*" EstadioFavorito : favorita
  Usuario "1" --> "0..*" SelecaoAcompanhada : acompanha
  Jogo "0..*" --> "1" Estadio : ocorre em
  NoticiasServico --> Noticia : cria
  FavoritosRepositorio --> JogoFavorito : persiste
  FavoritosRepositorio --> EstadioFavorito : persiste
  PerfilRepositorio --> Usuario : persiste
  TimesRepositorio --> SelecaoAcompanhada : persiste
```

## Como os principios de POO aparecem no projeto

### Encapsulamento
Cada classe concentra seus proprios dados e metodos. Por exemplo, a classe `Jogo` possui atributos como `homeTeam`, `awayTeam`, `stage` e metodos como `getTitulo()` e `envolveSelecao()`.

### Heranca
Classes como `Usuario`, `Jogo`, `Estadio`, `Noticia` e `Favorito` podem herdar de `EntidadeBase`, reaproveitando atributos comuns como `id`, `createdAt`, `validar()` e `toJSON()`.

### Polimorfismo
O metodo `validar()` pode existir em diferentes classes, mas cada uma valida suas regras de forma propria. Um `JogoFavorito` valida `matchKey`, enquanto um `EstadioFavorito` valida `stadiumSlug`.

### Abstracao
Classes como `PerfilRepositorio`, `FavoritosRepositorio`, `TimesRepositorio` e `NoticiasServico` escondem detalhes internos de comunicacao com Supabase, Storage, JSON local e API externa. A interface principal chama metodos de alto nivel sem precisar conhecer toda a logica interna.

## Observacao
A aplicacao atual usa modularizacao por arquivos JavaScript separados. A modelagem de classes documenta a estrutura orientada a objetos adotada e serve como base para evolucao do codigo, mantendo a separacao entre entidades, regras de negocio, persistencia e interface.
