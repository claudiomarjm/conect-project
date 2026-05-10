# Conecta.Net — Backend

API REST em Node.js + Express + SQLite.

## Pré-requisitos

- Node.js v18 ou superior
- npm v9 ou superior

## Instalação

```bash
npm install
```

```bash
npm install better-sqlite3
```

```bash
Criar uma pasta database na raiz /database
```

## Configuração

Crie o arquivo `.env` na raiz da pasta `backend/`:

```
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

## Visualizar o banco de dados no VS Code

Instale a extensão **SQLite DB Viewer** no VS Code:

1. Abra a aba de extensões (`Ctrl+Shift+X`)
2. Pesquise por `SQLite DB Viewer`
3. Instale e abra o arquivo `database/conecta.db`

Permite visualizar e consultar as tabelas diretamente no editor.

## Rodar o servidor

```bash
node server.js
```

O servidor sobe em `http://localhost:3000`.  
O arquivo `database/conecta.db` é criado automaticamente na primeira execução.

## Criar/atualizar admins

Edite os CPFs e senhas no topo de `scripts/create-admin.js` e execute:

```bash
node scripts/create-admin.js
```

## Testar a API com Postman

1. Baixe e instale o [Postman](https://www.postman.com/downloads/)
2. Abra o Postman e clique em **Import**
3. Selecione o arquivo `postman/conecta-net.postman_collection.json`
4. A collection **Conecta.Net API** aparecerá no painel lateral com todas as pastas e endpoints prontos

> **Dica:** As requisições de login salvam o token automaticamente nas variáveis da collection (`token` e `admin_token`). Todas as rotas autenticadas já usam essas variáveis — basta fazer login primeiro.

## Rotas disponíveis

| Método | Rota | Acesso |
|---|---|---|
| POST | /api/auth/login | Público |
| POST | /api/auth/admin-login | Público |
| POST | /api/users | Público (cadastro) |
| GET | /api/users/me | Cliente autenticado |
| PUT | /api/users/me/plan | Cliente autenticado |
| GET | /api/plans | Público |
| POST/PUT/DELETE | /api/plans/:id | Admin |
| GET/PUT/DELETE | /api/users/:id | Admin |
| PUT | /api/users/:id/reset-password | Admin |
