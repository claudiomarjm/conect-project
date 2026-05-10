requireAdminAuth();

let paginaAtual = 1;
let planosDisponiveis = [];

async function carregarTodosPlanos() {
  const res = await fetch(`${API_URL}/plans?limit=100`, { headers: adminHeaders() });
  const data = await res.json();
  planosDisponiveis = data.data || [];
}

async function carregarUsuarios(page = 1) {
  paginaAtual = page;
  const cpf = document.getElementById('filtroCpf').value.trim();
  const nome = document.getElementById('filtroNome').value.trim();

  const params = new URLSearchParams({ page, limit: 10 });
  if (cpf) params.append('cpf', cpf);
  if (nome) params.append('nome', nome);

  const res = await fetch(`${API_URL}/users?${params}`, { headers: adminHeaders() });
  const data = await res.json();

  const tbody = document.querySelector('#tabelaUsuarios tbody');
  tbody.innerHTML = '';

  data.data.forEach(u => {

    let badge = `<span class="plano-badge sem-plano">Sem plano</span>`;
    planosDisponiveis.forEach(p => {

      if (p.id === u.plano_id) badge = `<span class="plano-badge">${p.nome}</span>`;
    });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.nome}</td>
      <td>${u.cpf}</td>
      <td>${u.cidade || '-'}</td>
      <td>${badge}</td>
      <td>
        <button onclick='abrirModal(${JSON.stringify(u)})'>Editar</button>
        <button class="btn-perigo" onclick="excluirUsuario(${u.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination('paginacao', data.pagination, carregarUsuarios);
}

function abrirModal(u) {
  document.getElementById('editId').value = u.id;
  document.getElementById('editNome').value = u.nome;
  document.getElementById('editTelefone').value = u.telefone || '';
  document.getElementById('editCidade').value = u.cidade || '';
  document.getElementById('editSetor').value = u.setor || '';
  document.getElementById('editCep').value = u.cep || '';
  document.getElementById('novaSenha').value = '';

  const sel = document.getElementById('editPlanoId');
  sel.innerHTML = '<option value="">— Sem plano —</option>';
  planosDisponiveis.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nome} — ${p.velocidade} — R$ ${p.preco.toFixed(2)}`;
    if (p.id === u.plano_id) opt.selected = true;
    sel.appendChild(opt);
  });

  document.getElementById('modalEditar').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

async function salvarEdicao() {
  const id = document.getElementById('editId').value;
  const body = {
    nome: document.getElementById('editNome').value.trim(),
    telefone: document.getElementById('editTelefone').value.trim(),
    cidade: document.getElementById('editCidade').value.trim(),
    setor: document.getElementById('editSetor').value.trim(),
    cep: document.getElementById('editCep').value.trim(),
  };

  const planoId = document.getElementById('editPlanoId').value;

  const resEdit = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(body)
  });
  if (!resEdit.ok) {
    const d = await resEdit.json();
    return alert(d.error || 'Erro ao editar.');
  }

  const resPlan = await fetch(`${API_URL}/users/${id}/plan`, {
    method: 'PUT', headers: adminHeaders(),
    body: JSON.stringify({ plano_id: planoId ? parseInt(planoId) : null })
  });
  if (!resPlan.ok) {
    const d = await resPlan.json();
    return alert(d.error || 'Erro ao atualizar plano.');
  }

  fecharModal();
  alert('Usuário atualizado com sucesso!');
  carregarUsuarios(paginaAtual);
}

async function resetarSenha() {
  const id = document.getElementById('editId').value;
  const nova_senha = document.getElementById('novaSenha').value.trim();

  if (!nova_senha) return alert('Informe a nova senha.');

  const res = await fetch(`${API_URL}/users/${id}/reset-password`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify({ nova_senha })
  });

  if (!res.ok) {
    const d = await res.json();
    return alert(d.error || 'Erro ao resetar senha.');
  }
  alert('Senha resetada com sucesso!');
  document.getElementById('novaSenha').value = '';
}

async function excluirUsuario(id) {
  if (!confirm('Excluir este usuário permanentemente?')) return;

  const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: adminHeaders() });
  if (!res.ok) {
    const d = await res.json();
    return alert(d.error || 'Erro ao excluir.');
  }

  alert('Usuário excluído com sucesso.');
  carregarUsuarios(paginaAtual);
}

function sair() { removeAdminToken(); window.location.href = 'login.html'; }

carregarTodosPlanos().then(() => carregarUsuarios());
