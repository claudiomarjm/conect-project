require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database', 'conecta.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS planos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT NOT NULL,
    velocidade TEXT NOT NULL,
    preco      REAL NOT NULL,
    descricao  TEXT,
    ativo      INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    cpf       TEXT NOT NULL UNIQUE,
    telefone  TEXT,
    cidade    TEXT,
    setor     TEXT,
    cep       TEXT,
    senha     TEXT NOT NULL,
    role      TEXT DEFAULT 'cliente',
    plano_id  INTEGER REFERENCES planos(id) ON DELETE SET NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
