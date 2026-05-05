# Guia de Deploy

Este documento explica como publicar o projeto Calendário da Copa 2026.

## 1. Pré-requisitos

- Conta no GitHub.
- Conta no Supabase.
- Projeto configurado no Supabase.
- Repositório com os arquivos do frontend.
- Plataforma de hospedagem estática, como Vercel, Netlify ou GitHub Pages.

## 2. Supabase

### 2.1 Banco de dados

Crie as tabelas usando como base:

```txt
supabase/schema.sql
```

Depois, confira se o Row Level Security está ativo nas tabelas.

### 2.2 Storage

Crie um bucket chamado:

```txt
avatars
```

Esse bucket será usado para armazenar as fotos de perfil.

### 2.3 Autenticação

No Supabase Auth, confira:

- Provedores de e-mail ativados.
- URLs permitidas em desenvolvimento e produção.
- Confirmação de e-mail configurada conforme necessidade do projeto.

Exemplos de URLs:

```txt
http://127.0.0.1:5500
https://seu-projeto.vercel.app
```

## 3. Deploy do frontend na Vercel

1. Suba o projeto para o GitHub.
2. Acesse a Vercel.
3. Clique em **Add New Project**.
4. Selecione o repositório.
5. Como o projeto é estático, não precisa configurar build command.
6. Configure o diretório raiz como a pasta do projeto.
7. Publique.

Após o deploy, teste:

- `index.html`
- `login.html`
- `grupos.html`
- `estadios.html`
- `favoritos.html`
- `perfil.html`
- `noticias.html`

## 4. Deploy na Netlify

1. Suba o projeto no GitHub.
2. Entre na Netlify.
3. Clique em **Add new site**.
4. Escolha o repositório.
5. Deixe o build command em branco.
6. Configure a pasta de publicação como a raiz do projeto.
7. Publique.

## 5. PWA/mobile

A aplicação já possui:

- `manifest.json`
- `service-worker.js`
- `js/pwa.js`
- ícones em `img/`

Para testar:

1. Abra o site no navegador.
2. Use o DevTools.
3. Vá em **Application**.
4. Confira **Manifest** e **Service Worker**.
5. No celular, abra o site e use a opção **Adicionar à tela inicial**.

## 6. Desktop com Electron

A estrutura inicial está na pasta:

```txt
desktop/
```

Para testar:

```bash
cd desktop
npm install
npm start
```

Para gerar pacote futuramente, pode ser usado o Electron Builder.

## 7. Segurança

- Não usar `service_role key` no frontend.
- Não enviar senhas pelo GitHub.
- Configurar políticas RLS no Supabase.
- Restringir chaves de API quando possível.
- Evitar deixar arquivos `.env` no repositório.

## 8. Checklist de publicação

```txt
[ ] Testar login/cadastro
[ ] Testar favoritos de jogos
[ ] Testar seleções acompanhadas
[ ] Testar favoritos de estádio
[ ] Testar upload de avatar
[ ] Testar notícias
[ ] Testar vídeo de abertura
[ ] Testar responsividade mobile
[ ] Configurar URLs no Supabase Auth
[ ] Publicar frontend
[ ] Testar PWA
[ ] Atualizar README com link final
```
