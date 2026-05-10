const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { normalizeCpf } = require('../utils/cpf');

const router = express.Router();

const USUARIO_PUBLICO = 'id, nome, cpf, telefone, cidade, setor, cep, role, plano_id, criado_em';

// POST cadastro de cliente (público)
router.post('/', (req, res) => {
  const { nome, cpf, telefone, cidade, setor, cep, senha } = req.body;
  if (!nome || !cpf || !senha) {
    return res.status(400).json({ error: 'nome, cpf e senha são obrigatórios' });
  }

  const cpfNormalizado = normalizeCpf(cpf);

  const existe = db.prepare('SELECT id FROM usuarios WHERE cpf = ?').get(cpfNormalizado);
  if (existe) return res.status(409).json({ error: 'CPF já cadastrado' });

  const hash   = bcrypt.hashSync(senha, 10);
  const result = db.prepare(
    'INSERT INTO usuarios (nome, cpf, telefone, cidade, setor, cep, senha) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(nome, cpfNormalizado, telefone || null, cidade || null, setor || null, cep || null, hash);

  const usuario = db.prepare(`SELECT ${USUARIO_PUBLICO} FROM usuarios WHERE id = ?`).get(result.lastInsertRowid);

  res.status(201).json({
    message: 'Cadastro realizado com sucesso.',
    usuario
  });
});

// GET dados do usuário logado [cliente]
router.get('/me', authMiddleware, (req, res) => {
  const usuario = db.prepare(`SELECT ${USUARIO_PUBLICO} FROM usuarios WHERE id = ?`).get(req.user.id);

  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const plano = usuario.plano_id
    ? db.prepare('SELECT * FROM planos WHERE id = ?').get(usuario.plano_id)
    : null;

  res.json({ ...usuario, plano });
});

// PUT vincular plano ao usuário logado [cliente]
router.put('/me/plan', authMiddleware, (req, res) => {
  const { plano_id } = req.body;
  if (!plano_id) return res.status(400).json({ error: 'plano_id é obrigatório' });

  const plano = db.prepare('SELECT * FROM planos WHERE id = ? AND ativo = 1').get(plano_id);
  if (!plano) return res.status(404).json({ error: 'Plano não encontrado ou inativo' });

  db.prepare('UPDATE usuarios SET plano_id = ? WHERE id = ?').run(plano_id, req.user.id);

  res.json({
    message: 'Plano contratado com sucesso.',
    plano: {
      id:        plano.id,
      nome:      plano.nome,
      velocidade: plano.velocidade,
      preco:     plano.preco,
      descricao: plano.descricao
    }
  });
});

// GET listar clientes com paginação e filtros [admin]
router.get('/', adminMiddleware, (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;
  const cpf    = req.query.cpf  ? `%${normalizeCpf(req.query.cpf)}%` : '%';
  const nome   = req.query.nome ? `%${req.query.nome}%` : '%';

  const { count: total } = db.prepare(
    "SELECT COUNT(*) as count FROM usuarios WHERE cpf LIKE ? AND nome LIKE ? AND role = 'cliente'"
  ).get(cpf, nome);

  const data = db.prepare(`
    SELECT u.id, u.nome, u.cpf, u.telefone, u.cidade, u.setor, u.cep, u.plano_id,
           p.nome AS plano_nome, u.criado_em
    FROM usuarios u
    LEFT JOIN planos p ON u.plano_id = p.id
    WHERE u.cpf LIKE ? AND u.nome LIKE ? AND u.role = 'cliente'
    LIMIT ? OFFSET ?
  `).all(cpf, nome, limit, offset);

  res.json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// PUT editar dados do usuário [admin]
router.put('/:id', adminMiddleware, (req, res) => {
  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const { nome, telefone, cidade, setor, cep } = req.body;
  db.prepare(
    'UPDATE usuarios SET nome = ?, telefone = ?, cidade = ?, setor = ?, cep = ? WHERE id = ?'
  ).run(
    nome     ?? usuario.nome,
    telefone ?? usuario.telefone,
    cidade   ?? usuario.cidade,
    setor    ?? usuario.setor,
    cep      ?? usuario.cep,
    req.params.id
  );

  const atualizado = db.prepare(`SELECT ${USUARIO_PUBLICO} FROM usuarios WHERE id = ?`).get(req.params.id);

  res.json({
    message: 'Usuário atualizado com sucesso.',
    usuario: atualizado
  });
});

// PUT editar plano do usuário [admin]
router.put('/:id/plan', adminMiddleware, (req, res) => {
  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const plano_id = req.body.plano_id || null;
  db.prepare('UPDATE usuarios SET plano_id = ? WHERE id = ?').run(plano_id, req.params.id);

  const plano = plano_id
    ? db.prepare('SELECT * FROM planos WHERE id = ?').get(plano_id)
    : null;

  res.json({
    message: plano_id ? 'Plano do usuário atualizado com sucesso.' : 'Plano do usuário removido com sucesso.',
    plano
  });
});

// PUT resetar senha do usuário [admin]
router.put('/:id/reset-password', adminMiddleware, (req, res) => {
  const { nova_senha } = req.body;
  if (!nova_senha) return res.status(400).json({ error: 'nova_senha é obrigatória' });

  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const hash = bcrypt.hashSync(nova_senha, 10);
  db.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(hash, req.params.id);

  res.json({ message: 'Senha redefinida com sucesso.' });
});

// DELETE excluir usuário [admin]
router.delete('/:id', adminMiddleware, (req, res) => {
  const usuario = db.prepare(`SELECT ${USUARIO_PUBLICO} FROM usuarios WHERE id = ?`).get(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  db.prepare('DELETE FROM usuarios WHERE id = ?').run(req.params.id);

  res.json({
    message: 'Usuário excluído com sucesso.',
    usuario
  });
});

module.exports = router;
