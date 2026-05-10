document.getElementById('cpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.value = v;
});

async function fazerLogin() {
  const cpf   = document.getElementById('cpf').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!cpf || !senha) return showError('erro', 'Preencha o CPF e a senha.');

  try {
    const res  = await fetch(API_URL + '/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha })
    });
    const data = await res.json();

    if (!res.ok) return showError('erro', data.error || 'Acesso negado.');

    setAdminToken(data.token);
    window.location.href = 'usuarios.html';
  } catch {
    showError('erro', 'Não foi possível conectar ao servidor.');
  }
}
