function normalizeCpf(cpf) {
  return String(cpf).replace(/\D/g, '');
}

module.exports = { normalizeCpf };
