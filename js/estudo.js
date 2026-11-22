const CHAVE_STORAGE = "tutoria_progresso_v1";

const estado = {
  semestreId: "1",
  disciplinaId: "",
  modo: "quiz",          // "quiz" | "cards"
  unidade: "1",          // "1" | "2" | "3" | "todas"
  itens: [],
  indiceAtual: 0,
  revelado: false,
  respostaEscolhida: null
};

const elTitulo = document.getElementById("titulo-disciplina");
const elVoltar = document.getElementById("link-voltar");
const elArea = document.getElementById("area-estudo");
const botoesModo = document.querySelectorAll(".btn-modo");
const botoesUnidade = document.querySelectorAll(".btn-unidade");

/* ===== Persistência local (localStorage) ===== */
function lerProgresso() {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    return bruto ? JSON.parse(bruto) : { quiz: {}, cards: {} };
  } catch {
    return { quiz: {}, cards: {} };
  }
}

function salvarProgresso(tipo, id, valor) {
  try {
    const progresso = lerProgresso();
    if (!progresso[tipo]) progresso[tipo] = {};
    progresso[tipo][id] = valor;
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(progresso));
  } catch {
    // Ignora caso o navegador bloqueie armazenamento local
  }
}

/* ===== Renderização do MathJax ===== */
function renderizarMath(elemento) {
  if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
    window.MathJax.startup.promise
      .then(() => {
        if (window.MathJax.typesetClear) {
          window.MathJax.typesetClear([elemento]);
        }
        return window.MathJax.typesetPromise([elemento]);
      })
      .catch((erro) => console.error("Erro no MathJax:", erro));
    return;
  }

  const script = document.getElementById("MathJax-script");
  if (script) {
    script.addEventListener("load", () => renderizarMath(elemento), { once: true });
  }
}

/* ===== Inicialização ===== */
async function iniciar() {
  const params = new URLSearchParams(window.location.search);
  estado.semestreId = params.get("semestre") || "1";
  estado.disciplinaId = params.get("disciplina") || "";

  elVoltar.href = `disciplinas.html?semestre=${encodeURIComponent(estado.semestreId)}`;

  if (!estado.disciplinaId) {
    elTitulo.textContent = "Disciplina não informada";
    mostrarAviso("Selecione uma disciplina na lista anterior.");
    return;
  }

  await carregarMetadadosDisciplina();
  configurarControles();
  await carregarConteudoModo();
}

async function carregarMetadadosDisciplina() {
  try {
    const resp = await fetch("./data/disciplinas.json", { cache: "no-store" });
    if (!resp.ok) return;
    const catalogo = await resp.json();
    const semestre = catalogo[estado.semestreId];
    const disc = semestre?.disciplinas.find((d) => d.id === estado.disciplinaId);

    if (disc) {
      elTitulo.textContent = disc.nome;
      document.title = `${disc.nome} — Tutoria`;
    } else {
      elTitulo.textContent = estado.disciplinaId;
    }
  } catch {
    elTitulo.textContent = estado.disciplinaId;
  }
}

function configurarControles() {
  botoesModo.forEach((btn) => {
    const ativoInicial = btn.dataset.modo === estado.modo;
    btn.classList.toggle("ativo", ativoInicial);
    btn.setAttribute("aria-selected", String(ativoInicial));

    btn.addEventListener("click", async () => {
      if (estado.modo === btn.dataset.modo) return;
      estado.modo = btn.dataset.modo;
      botoesModo.forEach((b) => {
        const ativo = b.dataset.modo === estado.modo;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-selected", String(ativo));
      });
      await carregarConteudoModo();
    });
  });

  botoesUnidade.forEach((btn) => {
    btn.classList.toggle("ativo", btn.dataset.unidade === estado.unidade);

    btn.addEventListener("click", async () => {
      if (estado.unidade === btn.dataset.unidade) return;
      estado.unidade = btn.dataset.unidade;
      botoesUnidade.forEach((b) => {
        b.classList.toggle("ativo", b.dataset.unidade === estado.unidade);
      });
      await carregarConteudoModo();
    });
  });
}

/* ===== Leitura da árvore data/semestre-X/disciplina/unidade-Y/ ===== */
async function buscarArquivoUnidade(unidadeNum, arquivo) {
  const url = `./data/semestre-${encodeURIComponent(estado.semestreId)}/${encodeURIComponent(estado.disciplinaId)}/unidade-${unidadeNum}/${arquivo}`;

  const resp = await fetch(url, { cache: "no-store" });
  if (resp.status === 404) return [];
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} em ${url}`);
  }

  const texto = (await resp.text()).trim();
  if (!texto) return [];

  let dados;
  try {
    dados = JSON.parse(texto);
  } catch (erro) {
    throw new Error(`JSON inválido em ${url}: ${erro.message}`);
  }

  if (!Array.isArray(dados)) {
    throw new Error(`Formato inválido em ${url}: esperado um array []`);
  }

  return dados.map((item) => ({ ...item, unidade: unidadeNum }));
}

async function carregarConteudoModo() {
  const arquivo = estado.modo === "quiz" ? "quiz.json" : "cards.json";
  const unidadesAlvo = estado.unidade === "todas" ? [1, 2, 3] : [Number(estado.unidade)];

  estado.itens = [];
  estado.indiceAtual = 0;
  estado.revelado = false;
  estado.respostaEscolhida = null;

  try {
    const listas = await Promise.all(
      unidadesAlvo.map((u) => buscarArquivoUnidade(u, arquivo))
    );
    estado.itens = listas.flat();
    renderizarTela();
  } catch (erro) {
    mostrarAviso(`Erro ao carregar ${arquivo}: ${erro.message}`);
    console.error(erro);
  }
}

/* ===== Renderização ===== */
function renderizarTela() {
  const itens = estado.itens;

  if (itens.length === 0) {
    const tipoTexto = estado.modo === "quiz" ? "questões" : "cards";
    const escopo = estado.unidade === "todas" ? "esta disciplina" : `a Unidade ${estado.unidade}`;
    mostrarAviso(`Ainda não há ${tipoTexto} cadastrados para ${escopo}.`);
    return;
  }

  if (estado.indiceAtual >= itens.length) {
    estado.indiceAtual = 0;
  }

  const item = itens[estado.indiceAtual];

  if (estado.modo === "quiz") {
    renderizarQuiz(item, itens.length);
  } else {
    renderizarCard(item, itens.length);
  }

  renderizarMath(elArea);
}

/* ===== Modo Quiz ===== */
function renderizarQuiz(questao, total) {
  const progresso = lerProgresso().quiz || {};
  const jaAcertou = progresso[questao.id] === true;

  const caixa = document.createElement("article");
  caixa.className = "bloco-conteudo";

  const cabecalho = document.createElement("div");
  cabecalho.className = "bloco-topo";

  const meta = document.createElement("span");
  meta.className = "bloco-meta";
  meta.textContent = `UNIDADE ${questao.unidade} · ${estado.indiceAtual + 1} / ${total}`;

  cabecalho.appendChild(meta);

  if (jaAcertou) {
    const selo = document.createElement("span");
    selo.className = "selo-status";
    selo.textContent = "CONCLUÍDA";
    cabecalho.appendChild(selo);
  }

  const enunciado = document.createElement("p");
  enunciado.className = "texto-principal";
  enunciado.textContent = questao.enunciado;

  const listaAlt = document.createElement("div");
  listaAlt.className = "lista-alternativas";

  const letras = ["A", "B", "C", "D", "E"];
  const respondida = estado.respostaEscolhida !== null;

  questao.alternativas.forEach((textoAlt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-alternativa";
    btn.disabled = respondida;

    const letra = document.createElement("span");
    letra.className = "alt-letra";
    letra.textContent = letras[idx] || String(idx + 1);

    const conteudo = document.createElement("span");
    conteudo.className = "alt-texto";
    conteudo.textContent = textoAlt;

    btn.append(letra, conteudo);

    if (respondida) {
      if (idx === questao.correta) {
        btn.classList.add("alt-correta");
      } else if (idx === estado.respostaEscolhida) {
        btn.classList.add("alt-errada");
      }
    }

    btn.addEventListener("click", () => {
      estado.respostaEscolhida = idx;
      const acertou = idx === questao.correta;
      salvarProgresso("quiz", questao.id, acertou);
      renderizarTela();
    });

    listaAlt.appendChild(btn);
  });

  caixa.append(cabecalho, enunciado, listaAlt);

  if (respondida) {
    const acertou = estado.respostaEscolhida === questao.correta;
    const feedback = document.createElement("div");
    feedback.className = "bloco-explicacao";

    const tituloFb = document.createElement("p");
    tituloFb.className = "explicacao-titulo";
    tituloFb.textContent = acertou ? "RESPOSTA CORRETA" : "RESPOSTA INCORRETA";

    const textoFb = document.createElement("p");
    textoFb.className = "explicacao-texto";
    textoFb.textContent = questao.explicacao;

    feedback.append(tituloFb, textoFb);
    caixa.appendChild(feedback);
  }

  elArea.replaceChildren(caixa, criarNavegacao(total));
}

/* ===== Modo Cards ===== */
function renderizarCard(card, total) {
  const progresso = lerProgresso().cards || {};
  const revisado = progresso[card.id] === true;

  const caixa = document.createElement("article");
  caixa.className = "bloco-conteudo";

  const cabecalho = document.createElement("div");
  cabecalho.className = "bloco-topo";

  const meta = document.createElement("span");
  meta.className = "bloco-meta";
  meta.textContent = `UNIDADE ${card.unidade} · ${estado.indiceAtual + 1} / ${total}`;

  cabecalho.appendChild(meta);

  if (revisado) {
    const selo = document.createElement("span");
    selo.className = "selo-status";
    selo.textContent = "REVISADO";
    cabecalho.appendChild(selo);
  }

  const frente = document.createElement("p");
  frente.className = "texto-principal";
  frente.textContent = card.frente;

  caixa.append(cabecalho, frente);

  if (!estado.revelado) {
    const btnVer = document.createElement("button");
    btnVer.type = "button";
    btnVer.className = "btn-acao-primaria";
    btnVer.textContent = "Mostrar resposta";
    btnVer.addEventListener("click", () => {
      estado.revelado = true;
      renderizarTela();
    });
    caixa.appendChild(btnVer);
  } else {
    const verso = document.createElement("div");
    verso.className = "bloco-explicacao";

    const rotulo = document.createElement("p");
    rotulo.className = "explicacao-titulo";
    rotulo.textContent = "RESPOSTA";

    const textoVerso = document.createElement("p");
    textoVerso.className = "explicacao-texto";
    textoVerso.textContent = card.verso;

    verso.append(rotulo, textoVerso);

    const btnRevisado = document.createElement("button");
    btnRevisado.type = "button";
    btnRevisado.className = revisado ? "btn-acao-secundaria" : "btn-acao-primaria";
    btnRevisado.textContent = revisado ? "Desmarcar revisão" : "Marcar como revisado";
    btnRevisado.addEventListener("click", () => {
      salvarProgresso("cards", card.id, !revisado);
      renderizarTela();
    });

    caixa.append(verso, btnRevisado);
  }

  elArea.replaceChildren(caixa, criarNavegacao(total));
}

/* ===== Navegação Anterior / Próximo ===== */
function criarNavegacao(total) {
  const nav = document.createElement("div");
  nav.className = "nav-itens";

  const btnAnt = document.createElement("button");
  btnAnt.type = "button";
  btnAnt.className = "btn-nav";
  btnAnt.textContent = "Anterior";
  btnAnt.disabled = estado.indiceAtual === 0;
  btnAnt.addEventListener("click", () => {
    estado.indiceAtual -= 1;
    estado.revelado = false;
    estado.respostaEscolhida = null;
    renderizarTela();
  });

  const btnProx = document.createElement("button");
  btnProx.type = "button";
  btnProx.className = "btn-nav";
  btnProx.textContent = "Próximo";
  btnProx.disabled = estado.indiceAtual >= total - 1;
  btnProx.addEventListener("click", () => {
    estado.indiceAtual += 1;
    estado.revelado = false;
    estado.respostaEscolhida = null;
    renderizarTela();
  });

  nav.append(btnAnt, btnProx);
  return nav;
}

function mostrarAviso(mensagem) {
  const p = document.createElement("p");
  p.className = "estado-aviso";
  p.textContent = mensagem;
  elArea.replaceChildren(p);
}

iniciar();
