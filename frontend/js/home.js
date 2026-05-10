requireAuth();

async function carregarHome() {
  try {
    const res = await fetch(API_URL + '/users/me', { headers: authHeaders() });
    if (res.status === 401) { removeToken(); window.location.href = 'login.html'; return; }

    const data = await res.json();
    document.getElementById('nomeUsuario').textContent = data.nome;

    if (data.plano) {
      document.getElementById('comPlano').style.display = 'block';
      document.getElementById('planoNome').textContent       = data.plano.nome;
      document.getElementById('planoVelocidade').textContent = data.plano.velocidade;
      document.getElementById('planoPreco').textContent      = data.plano.preco.toFixed(2);
      document.getElementById('planoDescricao').textContent  = data.plano.descricao || '';
    } else {
      document.getElementById('semPlano').style.display = 'block';
    }
  } catch {
    window.location.href = 'login.html';
  }
}

function sair() {
  removeToken();
  window.location.href = 'login.html';
}

carregarHome();
