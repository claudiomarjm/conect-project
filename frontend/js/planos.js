requireAuth();

let planoSelecionadoId = null;
let paginaAtual = 1;

async function carregarPlanos(page = 1) {
  paginaAtual = page;
  try {
    const res  = await fetch(`${API_URL}/plans?page=${page}&limit=6`);
    const data = await res.json();

    const lista = document.getElementById('listaPacotes');
    lista.innerHTML = '';

    data.data.forEach(plano => {
      const div = document.createElement('div');
      div.className = 'pacote' + (plano.id === planoSelecionadoId ? ' ativo' : '');
      div.innerHTML = `
        <h3>${plano.nome}</h3>
        <p>R$ ${plano.preco.toFixed(2)}/mês</p>
        <span>${plano.descricao || plano.velocidade}</span>
      `;
      div.onclick = () => selecionarPlano(plano.id, div);
      lista.appendChild(div);
    });

    renderPagination('paginacao', data.pagination, carregarPlanos);
  } catch {
    showError('erro', 'Erro ao carregar planos.');
  }
}

function selecionarPlano(id, elemento) {
  planoSelecionadoId = id;
  document.querySelectorAll('.pacote').forEach(p => p.classList.remove('ativo'));
  elemento.classList.add('ativo');
}

async function contratarPlano() {
  if (!planoSelecionadoId) return showError('erro', 'Selecione um plano antes de continuar.');

  try {
    const res  = await fetch(API_URL + '/users/me/plan', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ plano_id: planoSelecionadoId })
    });
    const data = await res.json();

    if (!res.ok) return showError('erro', data.error || 'Erro ao contratar plano.');

    window.location.href = 'confirmacao.html';
  } catch {
    showError('erro', 'Não foi possível conectar ao servidor.');
  }
}

carregarPlanos();
