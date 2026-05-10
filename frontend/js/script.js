let usuarioCadastrado = localStorage.getItem("usuarioCadastrado") || "";
let senhaCadastrada = localStorage.getItem("senhaCadastrada") || "";
let pacoteSelecionado = localStorage.getItem("pacoteSelecionado") || "";

function mostrarPagina(id) {
  const paginas = document.querySelectorAll(".pagina");
  paginas.forEach((pagina) => pagina.classList.remove("ativa"));

  const paginaAlvo = document.getElementById(id);
  if (paginaAlvo) {
    paginaAlvo.classList.add("ativa");
  }
}

function salvarDadosCliente() {
  localStorage.setItem("nome", document.getElementById("nome").value.trim());
  localStorage.setItem("cpf", document.getElementById("cpf").value.trim());
  localStorage.setItem("cidade", document.getElementById("cidade").value.trim());
  localStorage.setItem("setor", document.getElementById("setor").value.trim());
  localStorage.setItem("cep", document.getElementById("cep").value.trim());
  localStorage.setItem("telefone", document.getElementById("telefone").value.trim());
}

function preencherCamposCadastro() {
  document.getElementById("nome").value = localStorage.getItem("nome") || "";
  document.getElementById("cpf").value = localStorage.getItem("cpf") || "";
  document.getElementById("cidade").value = localStorage.getItem("cidade") || "";
  document.getElementById("setor").value = localStorage.getItem("setor") || "";
  document.getElementById("cep").value = localStorage.getItem("cep") || "";
  document.getElementById("telefone").value = localStorage.getItem("telefone") || "";
  document.getElementById("novoUsuario").value = localStorage.getItem("usuarioCadastrado") || "";
  document.getElementById("novaSenha").value = localStorage.getItem("senhaCadastrada") || "";
}

function cadastrarUsuario() {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const setor = document.getElementById("setor").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const novoUsuario = document.getElementById("novoUsuario").value.trim();
  const novaSenha = document.getElementById("novaSenha").value.trim();

  if (!nome || !cpf || !cidade || !setor || !cep || !telefone || !novoUsuario || !novaSenha) {
    alert("Preencha todos os campos do cadastro.");
    return;
  }

  usuarioCadastrado = novoUsuario;
  senhaCadastrada = novaSenha;

  localStorage.setItem("usuarioCadastrado", usuarioCadastrado);
  localStorage.setItem("senhaCadastrada", senhaCadastrada);

  salvarDadosCliente();

  alert("Cadastro realizado com sucesso. Agora faça login.");
  mostrarPagina("pagina-login");
}

function fazerLogin() {
  const loginUsuario = document.getElementById("loginUsuario").value.trim();
  const loginSenha = document.getElementById("loginSenha").value.trim();

  if (!usuarioCadastrado || !senhaCadastrada) {
    alert("Você precisa fazer o cadastro primeiro.");
    return;
  }

  if (loginUsuario === usuarioCadastrado && loginSenha === senhaCadastrada) {
    mostrarPagina("pagina-pacotes");
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function verMinhaCompra() {
  const loginUsuario = document.getElementById("loginUsuario").value.trim();
  const loginSenha = document.getElementById("loginSenha").value.trim();

  if (!usuarioCadastrado || !senhaCadastrada) {
    alert("Você precisa fazer o cadastro primeiro.");
    return;
  }

  if (loginUsuario !== usuarioCadastrado || loginSenha !== senhaCadastrada) {
    alert("Usuário ou senha incorretos.");
    return;
  }

  const pacoteSalvo = localStorage.getItem("pacoteSelecionado") || "";
  if (!pacoteSalvo) {
    alert("Nenhuma compra foi realizada ainda.");
    return;
  }

  preencherMinhaCompra();
  mostrarPagina("pagina-minha-compra");
}

function selecionarPacote(pacote, elemento) {
  pacoteSelecionado = pacote;
  localStorage.setItem("pacoteSelecionado", pacoteSelecionado);

  const listaPacotes = document.querySelectorAll(".pacote");
  listaPacotes.forEach((item) => item.classList.remove("ativo"));

  if (elemento) {
    elemento.classList.add("ativo");
  }
}

function ativarPacoteSalvo() {
  const pacoteSalvo = localStorage.getItem("pacoteSelecionado") || "";
  if (!pacoteSalvo) return;

  const listaPacotes = document.querySelectorAll(".pacote");

  listaPacotes.forEach((item) => {
    const titulo = item.querySelector("h3")?.textContent?.trim() || "";
    const preco = item.querySelector("p")?.textContent?.trim() || "";
    const textoPacote = `${titulo} - ${preco}`;

    if (textoPacote === pacoteSalvo) {
      item.classList.add("ativo");
    } else {
      item.classList.remove("ativo");
    }
  });
}

function irParaConfirmacao() {
  const pacoteSalvo = localStorage.getItem("pacoteSelecionado") || pacoteSelecionado;

  if (!pacoteSalvo) {
    alert("Selecione um pacote de internet.");
    return;
  }

  salvarDadosCliente();

  document.getElementById("resumoNome").textContent = localStorage.getItem("nome") || "";
  document.getElementById("resumoCpf").textContent = localStorage.getItem("cpf") || "";
  document.getElementById("resumoCidade").textContent = localStorage.getItem("cidade") || "";
  document.getElementById("resumoSetor").textContent = localStorage.getItem("setor") || "";
  document.getElementById("resumoCep").textContent = localStorage.getItem("cep") || "";
  document.getElementById("resumoTelefone").textContent = localStorage.getItem("telefone") || "";
  document.getElementById("resumoUsuario").textContent = localStorage.getItem("usuarioCadastrado") || "";
  document.getElementById("resumoPacote").textContent = pacoteSalvo;

  preencherMinhaCompra();
  mostrarPagina("pagina-confirmacao");
}

function preencherMinhaCompra() {
  document.getElementById("compraNome").textContent = localStorage.getItem("nome") || "";
  document.getElementById("compraCpf").textContent = localStorage.getItem("cpf") || "";
  document.getElementById("compraCidade").textContent = localStorage.getItem("cidade") || "";
  document.getElementById("compraSetor").textContent = localStorage.getItem("setor") || "";
  document.getElementById("compraCep").textContent = localStorage.getItem("cep") || "";
  document.getElementById("compraTelefone").textContent = localStorage.getItem("telefone") || "";
  document.getElementById("compraUsuario").textContent = localStorage.getItem("usuarioCadastrado") || "";
  document.getElementById("compraPacote").textContent = localStorage.getItem("pacoteSelecionado") || "";
}

function voltarInicio() {
  document.getElementById("loginUsuario").value = "";
  document.getElementById("loginSenha").value = "";
  mostrarPagina("pagina-login");
}

const campoCpf = document.getElementById("cpf");
if (campoCpf) {
  campoCpf.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.slice(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = valor;
  });
}

const campoCep = document.getElementById("cep");
if (campoCep) {
  campoCep.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.slice(0, 8);
    valor = valor.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    e.target.value = valor;
  });
}

window.addEventListener("load", function () {
  preencherCamposCadastro();
  ativarPacoteSalvo();
  preencherMinhaCompra();
});