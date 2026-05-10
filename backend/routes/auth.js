const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { normalizeCpf } = require('../utils/cpf');

const router = express.Router();

router.post('/login', (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
  }

  const cpfNormalizado = normalizeCpf(cpf);
  const usuario = db.prepare("SELECT * FROM usuarios WHERE cpf = ? AND role IN ('cliente', 'admin')").get(cpfNormalizado);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(401).json({ error: 'CPF ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: usuario.id, cpf: usuario.cpf, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

router.post('/admin-login', (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
  }

  const cpfNormalizado = normalizeCpf(cpf);
  const usuario = db.prepare('SELECT * FROM usuarios WHERE cpf = ? AND role = ?').get(cpfNormalizado, 'admin');

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(401).json({ error: 'CPF ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: usuario.id, cpf: usuario.cpf, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

module.exports = router;
