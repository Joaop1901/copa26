/*
 * models.js
 * Camada de modelos orientada a objetos do projeto Calendario da Copa 2026.
 *
 * Este arquivo centraliza entidades do dominio para demonstrar e organizar
 * principios de POO: encapsulamento, heranca, polimorfismo e abstracao.
 * Ele nao altera o comportamento visual atual do site; serve como base
 * tecnica para evoluir as regras de negocio do projeto.
 */

class EntidadeBase {
  constructor({ id = crypto.randomUUID?.() || String(Date.now()), createdAt = new Date() } = {}) {
    this.id = id;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  validar() {
    return Boolean(this.id);
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString()
    };
  }
}

class Usuario extends EntidadeBase {
  constructor({ email = "", nome = "", username = "", avatarUrl = "", favoriteTeam = "", ...base } = {}) {
    super(base);
    this.email = email;
    this.nome = nome;
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.favoriteTeam = favoriteTeam;
  }

  atualizarPerfil(dados = {}) {
    this.nome = dados.nome ?? this.nome;
    this.username = dados.username ?? this.username;
    this.favoriteTeam = dados.favoriteTeam ?? this.favoriteTeam;
  }

  alterarAvatar(url) {
    this.avatarUrl = url || this.avatarUrl;
  }

  validar() {
    return super.validar() && this.email.includes("@");
  }

  toJSON() {
    return {
      ...super.toJSON(),
      email: this.email,
      nome: this.nome,
      username: this.username,
      avatarUrl: this.avatarUrl,
      favoriteTeam: this.favoriteTeam
    };
  }
}

class Jogo extends EntidadeBase {
  constructor({ matchKey = "", homeTeam = "", awayTeam = "", stage = "", stadium = "", matchDate = null, isFavorite = false, ...base } = {}) {
    super(base);
    this.matchKey = matchKey;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.stage = stage;
    this.stadium = stadium;
    this.matchDate = matchDate ? new Date(matchDate) : null;
    this.isFavorite = isFavorite;
  }

  getTitulo() {
    return `${this.homeTeam} x ${this.awayTeam}`.trim();
  }

  envolveSelecao(teamName) {
    if (!teamName) return false;
    const nome = String(teamName).toLowerCase();
    return this.homeTeam.toLowerCase() === nome || this.awayTeam.toLowerCase() === nome;
  }

  marcarFavorito() {
    this.isFavorite = true;
  }

  removerFavorito() {
    this.isFavorite = false;
  }

  validar() {
    return super.validar() && Boolean(this.matchKey && this.homeTeam && this.awayTeam);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      matchKey: this.matchKey,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      stage: this.stage,
      stadium: this.stadium,
      matchDate: this.matchDate ? this.matchDate.toISOString() : null,
      isFavorite: this.isFavorite
    };
  }
}

class Estadio extends EntidadeBase {
  constructor({ stadiumSlug = "", stadiumName = "", city = "", country = "", pinX = 0, pinY = 0, ...base } = {}) {
    super(base);
    this.stadiumSlug = stadiumSlug;
    this.stadiumName = stadiumName;
    this.city = city;
    this.country = country;
    this.pinX = Number(pinX);
    this.pinY = Number(pinY);
  }

  getLocalizacao() {
    return `${this.city} - ${this.country}`;
  }

  pertenceAoPais(country) {
    return this.country.toLowerCase() === String(country || "").toLowerCase();
  }

  validar() {
    return super.validar() && Boolean(this.stadiumSlug && this.stadiumName && this.country);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      stadiumSlug: this.stadiumSlug,
      stadiumName: this.stadiumName,
      city: this.city,
      country: this.country,
      pinX: this.pinX,
      pinY: this.pinY
    };
  }
}

class Noticia extends EntidadeBase {
  constructor({ titulo = "", descricao = "", fonte = "", url = "", publicadaEm = null, fallback = false, ...base } = {}) {
    super(base);
    this.titulo = titulo;
    this.descricao = descricao;
    this.fonte = fonte;
    this.url = url;
    this.publicadaEm = publicadaEm ? new Date(publicadaEm) : null;
    this.fallback = Boolean(fallback);
  }

  getResumo() {
    if (!this.descricao) return this.titulo;
    return this.descricao.length > 140 ? `${this.descricao.slice(0, 137)}...` : this.descricao;
  }

  validar() {
    return super.validar() && Boolean(this.titulo);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      titulo: this.titulo,
      descricao: this.descricao,
      fonte: this.fonte,
      url: this.url,
      publicadaEm: this.publicadaEm ? this.publicadaEm.toISOString() : null,
      fallback: this.fallback
    };
  }
}

class Favorito extends EntidadeBase {
  constructor({ userId = "", itemId = "", tipo = "", ...base } = {}) {
    super(base);
    this.userId = userId;
    this.itemId = itemId;
    this.tipo = tipo;
  }

  validar() {
    return super.validar() && Boolean(this.userId && this.itemId && this.tipo);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userId: this.userId,
      itemId: this.itemId,
      tipo: this.tipo
    };
  }
}

class JogoFavorito extends Favorito {
  constructor({ matchKey = "", homeTeam = "", awayTeam = "", matchDate = null, stadium = "", stage = "", ...favorito } = {}) {
    super({ ...favorito, itemId: matchKey || favorito.itemId, tipo: "jogo" });
    this.matchKey = matchKey || this.itemId;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.matchDate = matchDate ? new Date(matchDate) : null;
    this.stadium = stadium;
    this.stage = stage;
  }

  validar() {
    return super.validar() && Boolean(this.matchKey);
  }
}

class EstadioFavorito extends Favorito {
  constructor({ stadiumSlug = "", stadiumName = "", city = "", country = "", ...favorito } = {}) {
    super({ ...favorito, itemId: stadiumSlug || favorito.itemId, tipo: "estadio" });
    this.stadiumSlug = stadiumSlug || this.itemId;
    this.stadiumName = stadiumName;
    this.city = city;
    this.country = country;
  }

  validar() {
    return super.validar() && Boolean(this.stadiumSlug && this.stadiumName);
  }
}

class SelecaoAcompanhada extends EntidadeBase {
  constructor({ userId = "", teamName = "", ...base } = {}) {
    super(base);
    this.userId = userId;
    this.teamName = teamName;
  }

  validar() {
    return super.validar() && Boolean(this.userId && this.teamName);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userId: this.userId,
      teamName: this.teamName
    };
  }
}

class RepositorioBase {
  constructor(client) {
    this.client = client;
  }

  garantirCliente() {
    if (!this.client) {
      throw new Error("Cliente de persistencia nao configurado.");
    }
  }
}

class NoticiasServico {
  constructor({ fallback = [] } = {}) {
    this.fallback = fallback;
  }

  normalizarArtigo(artigo = {}) {
    return new Noticia({
      titulo: artigo.title || artigo.titulo || "Noticia sem titulo",
      descricao: artigo.description || artigo.descricao || "",
      fonte: artigo.source?.name || artigo.fonte || "Fonte nao informada",
      url: artigo.url || "#",
      publicadaEm: artigo.publishedAt || artigo.publicadaEm || null,
      fallback: Boolean(artigo.fallback)
    });
  }

  buscarFallback() {
    return this.fallback.map((item) => this.normalizarArtigo({ ...item, fallback: true }));
  }
}

window.CopaModels = {
  EntidadeBase,
  Usuario,
  Jogo,
  Estadio,
  Noticia,
  Favorito,
  JogoFavorito,
  EstadioFavorito,
  SelecaoAcompanhada,
  RepositorioBase,
  NoticiasServico
};
