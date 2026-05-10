# Conecta.Net — Frontend

Interface web em HTML/CSS/JS puro. Sem framework, sem build tools.

## Pré-requisitos

**Plugin obrigatório no VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

1. Abra a aba de extensões (`Ctrl+Shift+X`)
2. Pesquise por `Live Server` (autor: Ritwick Dey)
3. Instale

## Como rodar

**VS Code Live Server (recomendado):**
1. Com o plugin instalado, clique com o botão direito em qualquer `.html` dentro de `pages/`
2. Selecione "Open with Live Server"
3. O navegador abrirá automaticamente

**Opção 2 — Python (se instalado):**
```bash
cd frontend
python -m http.server 5500
```
Acesse: `http://localhost:5500/pages/login.html`

## Configurar URL da API

Se o backend rodar em uma porta diferente de `3000`, edite a constante em `js/auth.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

## Páginas

| Arquivo | Descrição |
|---|---|
| `pages/login.html` | Login do cliente |
| `pages/cadastro.html` | Cadastro de novo cliente |
| `pages/home.html` | Home pós-login (exibe plano ativo) |
| `pages/planos.html` | Listagem e contratação de planos |
| `pages/confirmacao.html` | Confirmação de contratação |
| `pages/admin/login.html` | Login do administrador |
| `pages/admin/usuarios.html` | Gestão de usuários |
| `pages/admin/planos.html` | CRUD de planos |
