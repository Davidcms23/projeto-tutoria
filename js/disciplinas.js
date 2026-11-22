function criarIconeSeta() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "icone-seta");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", "M4 10H16M11 5L16 10L11 15");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path);
  return svg;
}

async function carregarDisciplinas() {
  const params = new URLSearchParams(window.location.search);
  const semestreId = params.get("semestre") || "1";

  const listaEl = document.getElementById("lista-disciplinas");
  const tituloEl = document.getElementById("titulo-semestre");
  const descEl = document.getElementById("desc-semestre");

  const urlDados = "./data/disciplinas.json";

  try {
    const resposta = await fetch(urlDados, { cache: "no-store" });
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status} ao buscar ${urlDados}`);
    }

    const catalogo = await resposta.json();
    const semestre = catalogo[semestreId];

    if (!semestre) {
      tituloEl.textContent = "Semestre inválido";
      exibirAviso(listaEl, `Semestre "${semestreId}" não encontrado.`);
      return;
    }

    document.title = `${semestre.titulo} — Tutoria`;
    tituloEl.textContent = semestre.titulo;
    descEl.textContent = semestre.descricao;

    const fragmento = document.createDocumentFragment();

    semestre.disciplinas.forEach((disciplina) => {
      const link = document.createElement("a");
      link.className = "card-disciplina";
      link.href = `estudo.html?semestre=${encodeURIComponent(semestreId)}&disciplina=${encodeURIComponent(disciplina.id)}`;

      const cantoSE = document.createElement("span");
      cantoSE.className = "canto canto-se";
      cantoSE.setAttribute("aria-hidden", "true");

      const cantoID = document.createElement("span");
      cantoID.className = "canto canto-id";
      cantoID.setAttribute("aria-hidden", "true");

      const info = document.createElement("div");
      info.className = "card-disciplina-info";

      const titulo = document.createElement("h2");
      titulo.textContent = disciplina.nome;

      const carga = document.createElement("p");
      carga.className = "card-detalhe";
      carga.textContent = `${disciplina.cargaHoraria}h`;

      info.append(titulo, carga);
      link.append(cantoSE, cantoID, info, criarIconeSeta());
      fragmento.appendChild(link);
    });

    listaEl.replaceChildren(fragmento);
  } catch (erro) {
    tituloEl.textContent = "Erro ao carregar";
    exibirAviso(listaEl, `Detalhe técnico: ${erro.message}`);
    console.error(erro);
  }
}

function exibirAviso(container, mensagem) {
  const aviso = document.createElement("p");
  aviso.className = "estado-aviso";
  aviso.textContent = mensagem;
  container.replaceChildren(aviso);
}

carregarDisciplinas();
