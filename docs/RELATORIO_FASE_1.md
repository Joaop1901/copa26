# Relatório da Fase 1 — Calendário da Copa 2026

## 1. Identificação do projeto

**Nome:** Calendário da Copa 2026  
**Tipo:** Aplicação web interativa com expansão para mobile/PWA e desktop  
**Área:** Esporte, informação, personalização de usuário e acompanhamento de eventos

## 2. Objetivo

O projeto tem como objetivo desenvolver uma plataforma digital para acompanhamento da Copa do Mundo FIFA 2026. A aplicação permite que o usuário consulte jogos, grupos, estádios e notícias, além de personalizar a experiência por meio de favoritos, seleções acompanhadas e perfil próprio.

A proposta é criar um sistema com aparência moderna, navegação simples e funcionalidades conectadas a banco de dados, tornando o projeto adequado tanto para apresentação acadêmica quanto para portfólio profissional.

## 3. Escopo desenvolvido na Fase 1

Nesta fase, foi desenvolvida a versão web principal da aplicação. O sistema já possui autenticação, persistência de dados, mapa interativo, favoritos, perfil do usuário e página de notícias.

### Funcionalidades concluídas

- Login e cadastro com Supabase Auth.
- Navbar dinâmica com base no estado de autenticação.
- Calendário com dados locais da Copa 2026.
- Filtro de jogos por seleção e por fase.
- Visualização em lista e em formato de calendário.
- Favoritos manuais de jogos.
- Seleções acompanhadas.
- Marcação automática dos jogos das seleções acompanhadas.
- Página de favoritos com jogos, seleções e estádios.
- Mapa interativo dos estádios.
- Filtros de estádios por país.
- Estádios favoritos salvos no banco.
- Perfil do usuário com dados e preferências.
- Upload de avatar usando Supabase Storage.
- Página de notícias usando GNews API com fallback local.
- Vídeo de abertura após login ou cadastro.

## 4. Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript puro
- Layout responsivo
- Estilo visual escuro/neon com tons rosa, coral, laranja e ciano

### Backend e banco de dados

- Supabase Auth para autenticação
- Supabase Database para persistência dos dados
- Supabase Storage para armazenamento de avatar
- APIs automáticas do Supabase para comunicação entre frontend e banco

### Dados externos e locais

- JSON local com jogos da Copa 2026
- GNews API para notícias
- API-Football testada como possibilidade de integração

## 5. Arquitetura do sistema

A arquitetura atual do projeto é baseada em frontend web estático consumindo serviços em nuvem do Supabase.

```txt
Usuário
  ↓
Interface Web HTML/CSS/JS
  ↓
Supabase Auth / Database / Storage
  ↓
Dados do usuário, favoritos, seleções, perfil e avatar
```

A camada de dados dos jogos usa `copa.json`, garantindo que a aplicação funcione mesmo quando APIs externas não retornam todos os dados necessários.

## 6. Persistência de dados

A persistência é feita com Supabase Database. Cada usuário possui dados próprios associados ao seu identificador de autenticação.

Principais entidades:

- Perfil do usuário
- Preferências
- Jogos favoritos
- Seleções acompanhadas
- Estádios favoritos

## 7. Mobile

Para a versão mobile, foi criada uma estrutura inicial de PWA. Essa abordagem permite que a própria aplicação web seja instalada em celulares compatíveis, mantendo uma experiência próxima de aplicativo.

Arquivos utilizados:

- `manifest.json`
- `service-worker.js`
- `js/pwa.js`
- ícones em `img/`

## 8. Desktop

Para a versão desktop, foi criada uma estrutura inicial com Electron. A proposta é reaproveitar a mesma interface web e empacotá-la como aplicativo desktop, principalmente para Windows.

Arquivos utilizados:

- `desktop/package.json`
- `desktop/main.js`

## 9. Qualidade e interface

A interface foi desenvolvida com foco em:

- Visual moderno.
- Responsividade.
- Organização por páginas.
- Feedback visual para ações do usuário.
- Cards, filtros e botões com padrão visual consistente.
- Tratamento de erros em login, favoritos, notícias e perfil.

## 10. Próximas etapas

- Fazer deploy do frontend em Vercel, Netlify ou GitHub Pages.
- Revisar responsividade em diferentes celulares.
- Validar políticas RLS do Supabase.
- Melhorar a organização das variáveis de API.
- Gerar instalador desktop com Electron.
- Refinar documentação da API e do banco.
- Criar apresentação final com prints e fluxo de uso.

## 11. Conclusão

A Fase 1 apresenta uma base funcional avançada do Calendário da Copa 2026. O projeto já possui autenticação, banco de dados, storage, perfil, favoritos, notícias, mapa interativo e personalização do usuário. Além disso, foram iniciadas as estruturas para mobile/PWA, desktop/Electron, documentação técnica, DER e deploy.

O sistema atende ao objetivo de demonstrar uma solução de ponta a ponta, integrando frontend, backend em nuvem, persistência de dados e experiência de usuário moderna.
