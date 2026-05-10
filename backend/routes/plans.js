const express = require('express');
const db = require('../db');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET público — lista planos ativos com paginação
router.get('/', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  const { count: total } = db.prepare('SELECT COUNT(*) as count FROM planos WHERE ativo = 1').get();
  const data = db.prepare('SELECT * FROM planos WHERE ativo = 1 LIMIT ? OFFSET ?').all(limit, offset);

  res.json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// POST criar plano [admin]
router.post('/', adminMiddleware, (req, res) => {
  const { nome, velocidade, preco, descricao } = req.body;
  if (!nome || !velocidade || preco == null) {
    return res.status(400).json({ error: 'nome, velocidade e preco são obrigatórios' });
  }

  const result = db.prepare(
    'INSERT INTO planos (nome, velocidade, preco, descricao) VALUES (?, ?, ?, ?)'
  ).run(nome, velocidade, preco, descricao || null);

  const plano = db.prepare('SELECT * FROM planos WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    message: 'Plano criado com sucesso.',
    plano
  });
});

// PUT editar plano [admin]
router.put('/:id', adminMiddleware, (req, res) => {
  const plano = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);
  if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });

  const { nome, velocidade, preco, descricao, ativo } = req.body;

  db.prepare(
    'UPDATE planos SET nome = ?, velocidade = ?, preco = ?, descricao = ?, ativo = ? WHERE id = ?'
  ).run(
    nome       ?? plano.nome,
    velocidade ?? plano.velocidade,
    preco      ?? plano.preco,
    descricao  ?? plano.descricao,
    ativo      ?? plano.ativo,
    req.params.id
  );

  const atualizado = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);

  res.json({
    message: 'Plano atualizado com sucesso.',
    plano: atualizado
  });
});

// DELETE excluir plano [admin]
router.delete('/:id', adminMiddleware, (req, res) => {
  const plano = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);
  if (!plano) return res.status(404).json({ error: 'Plano não encontrado' });

  db.prepare('DELETE FROM planos WHERE id = ?').run(req.params.id);

  res.json({
    message: 'Plano excluído com sucesso.',
    plano
  });
});

module.exports = router;
