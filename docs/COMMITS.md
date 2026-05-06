# Plano de Commits - Calendario da Copa 2026

O criterio pede ao menos 5 commits significativos. O ideal e que cada commit represente uma evolucao real do projeto.

## Sugestao de commits

1. **Estrutura inicial do projeto**
   - HTML principal
   - CSS base
   - Estrutura de pastas

2. **Adiciona autenticacao com Supabase**
   - `login.html`
   - `js/login.js`
   - `js/auth.js`
   - `js/supabaseClient.js`

3. **Implementa calendario e favoritos de jogos**
   - `index.html`
   - `js/index.js`
   - `copa.json`
   - favoritos no Supabase

4. **Adiciona grupos, selecoes acompanhadas e estadios**
   - `grupos.html`
   - `estadios.html`
   - `js/grupos.js`
   - `js/estadios.js`

5. **Adiciona perfil, avatar e favoritos completos**
   - `perfil.html`
   - `favoritos.html`
   - Supabase Storage
   - dados do usuario

6. **Adiciona noticias, PWA e video de abertura**
   - `noticias.html`
   - `js/noticias.js`
   - `manifest.json`
   - `service-worker.js`
   - video de abertura

7. **Adiciona documentacao tecnica e diagramas**
   - `README.md`
   - `docs/DOCUMENTACAO_TECNICA_V1.md`
   - `docs/DIAGRAMA_CLASSES.md`
   - `docs/CASOS_DE_USO.md`

## Comandos uteis

```bash
git status
git add -A
git commit -m "Adiciona documentacao tecnica e diagramas"
git push
```

## Se ainda faltar quantidade de commits

Nao e recomendado criar commits vazios so para bater numero. O melhor e separar alteracoes reais, por exemplo:

```bash
git add README.md
git commit -m "Atualiza README com estrutura e execucao"

git add docs/DIAGRAMA_CLASSES.md docs/CASOS_DE_USO.md
git commit -m "Adiciona diagramas de classes e casos de uso"

git add docs/DOCUMENTACAO_TECNICA_V1.md
git commit -m "Adiciona documentacao tecnica inicial"

git add js/models.js
git commit -m "Adiciona camada de modelos orientada a objetos"

git push
```
