require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('../db');
const { normalizeCpf } = require('../utils/cpf');

// === EDITE AQUI: CPF e senha de cada admin ===
const admins = [
  { nome: 'Claudiomar', cpf: '60361875134', senha: '123456' },
];
// =============================================

for (const admin of admins) {
  const cpfNormalizado = normalizeCpf(admin.cpf);
  const hash = bcrypt.hashSync(admin.senha, 10);
  db.prepare(`
    INSERT INTO usuarios (nome, cpf, senha, role)
    VALUES (?, ?, ?, 'admin')
    ON CONFLICT(cpf) DO UPDATE SET
      nome  = excluded.nome,
      senha = excluded.senha,
      role  = 'admin'
  `).run(admin.nome, cpfNormalizado, hash);
  console.log(`[OK] Admin "${admin.nome}" (${cpfNormalizado}) criado/atualizado.`);
}
// tutorial de como adicionar admin em uma pessoa
//  cd backend                                                                                                                                                                                             
//  node scripts/create-admin.js 