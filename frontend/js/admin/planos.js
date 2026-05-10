requireAdminAuth();

let paginaAtual = 1;

async function carregarPlanos(page = 1) {
  paginaAtual = page;
  const res = await fetch(`${API_URL}/plans?page=${page}&limit=10`, { headers: adminHeaders() });
  const data = await res.json();

  const tbody = document.querySelector('#tabelaPlanos tbody');
  tbody.innerHTML = '';

  data.data.forEach(p => {
    const desc = (p.descricao || '').replace(/'/g, "\\'");
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.velocidade}</td>
      <td>R$ ${p.preco.toFixed(2)}</td>
      <td>
        <button onclick="editarPlano(${p.id}, '${p.nome}', '${p.velocidade}', ${p.preco}, '${desc}')">Editar</button>
        <button class="btn-perigo" onclick="excluirPlano(${p.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination('paginacao', data.pagination, carregarPlanos);
}

function editarPlano(id, nome, velocidade, preco, descricao) {
  document.getElementById('planoId').value = id;
  document.getElementById('fNome').value = nome;
  document.getElementById('fVelocidade').value = velocidade;
  document.getElementById('fPreco').value = preco;
  document.getElementById('fDescricao').value = descricao;
  document.getElementById('tituloForm').textContent = 'Editar Plano';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparForm() {
  document.getElementById('planoId').value = '';
  document.getElementById('fNome').value = '';
  document.getElementById('fVelocidade').value = '';
  document.getElementById('fPreco').value = '';
  document.getElementById('fDescricao').value = '';
  document.getElementById('tituloForm').textContent = 'Novo Plano';
}

async function salvarPlano() {
  const id = document.getElementById('planoId').value;
  const nome = document.getElementById('fNome').value.trim();
  const velocidade = document.getElementById('fVelocidade').value.trim();
  const preco = parseFloat(document.getElementById('fPreco').value);
  const descricao = document.getElementById('fDescricao').value.trim();

  if (!nome || !velocidade || isNaN(preco)) {
    return alert('Preencha nome, velocidade e preço.');
  }

  const url = id ? `${API_URL}/plans/${id}` : `${API_URL}/plans`;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: adminHeaders(),
    body: JSON.stringify({ nome, velocidade, preco, descricao })
  });

  if (!res.ok) {
    const d = await res.json();
    return alert(d.error || 'Erro ao salvar.');
  }

  alert(id ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
  limparForm();
  carregarPlanos(paginaAtual);
}

async function excluirPlano(id) {
  if (!confirm('Excluir este plano?')) return;

  const res = await fetch(`${API_URL}/plans/${id}`, { method: 'DELETE', headers: adminHeaders() });
  if (!res.ok) {
    const d = await res.json();
    return alert(d.error || 'Erro ao excluir.');
  }

  alert('Plano excluído com sucesso.');
  carregarPlanos(paginaAtual);
}

function sair() { removeAdminToken(); window.location.href = 'login.html'; }

carregarPlanos();
