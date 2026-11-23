# Student Digital Kit — Bruna Tamari
PWA local-first (React + Vite + TypeScript). Dados em IndexedDB, sem backend.
## Rodar
1. `npm install`  2. `npm run dev`  3. `npm run build` (gera `dist/`)  4. `npm run preview` para testar o build.
## Deploy (Netlify)
Suba para o GitHub → Netlify > Add new site > Import from Git. Build: `npm run build`, publish: `dist` (já em `netlify.toml`, com fallback de SPA).
## Atualizar
Edite, faça commit e push: o Netlify publica sozinho.
## Privacidade
Dados só no aparelho; exporte backups em Settings.
