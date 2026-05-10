document.getElementById('cpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.value = v;
});

document.getElementById('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  } else {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }
  this.value = v;
});

document.getElementById('cep').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 8);
  v = v.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  this.value = v;
});

async function cadastrar() {
  const campos = ['nome', 'cpf', 'telefone', 'cidade', 'setor', 'cep', 'senha'];
  const dados  = {};
  for (const campo of campos) {
    dados[campo] = document.getElementById(campo).value.trim();
  }

  if (!dados.nome || !dados.cpf || !dados.senha) {
    return showError('erro', 'Nome, CPF e senha são obrigatórios.');
  }

  try {
    const res  = await fetch(API_URL + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await res.json();

    if (!res.ok) return showError('erro', data.error || 'Erro ao cadastrar.');

    alert('Cadastro realizado com sucesso! Faça login.');
    window.location.href = 'login.html';
  } catch {
    showError('erro', 'Não foi possível conectar ao servidor.');
  }
}
