# Quiz Tutoria de Estatística - UFRN

Aplicação web *mobile-first* desenvolvida como ferramenta de apoio pedagógico para a Tutoria de Estatística da Universidade Federal do Rio Grande do Norte (UFRN). O objetivo é permitir que os bolsistas apliquem testes rápidos e interativos com os alunos durante os atendimentos para fixação de conteúdo das disciplinas iniciais, com envio direto das questões para o **Anki** via API.

---

## Escopo e Público-Alvo

* **Público:** Alunos das disciplinas introdutórias de Estatística e Probabilidade.
* **Uso:** Dinâmicas rápidas via smartphone (presencialmente na tutoria ou de forma assíncrona).
* **Formato:** Questões de múltipla escolha com feedback imediato e integração direta com baralhos do Anki para repetição espaçada.

---

## Estrtura

Priorizando tecnologias abertas, leves e de fácil manutenção:

* **Estrutura e Estilo:** HTML5 semântico e CSS3 (abordagem *Mobile-First*, Flexbox/Grid).
* **Lógica:** JavaScript (Vanilla ES6+) para controle de estado, pontuação e carregamento dinâmico de questões.
* **Renderização Matemática:** [MathJax 3](https://www.mathjax.org/) (biblioteca open-source para renderização de LaTeX no navegador, mantendo 100% de compatibilidade sintática com o MathJax nativo do Anki).
* **Integração com Anki:** API local (**AnkiConnect** / ponte Android-Desktop) via requisições HTTP (`fetch`) para criação automática de baralhos (`createDeck`) e adição de notas (`addNotes`).
* **Banco de Questões:** Arquivos estruturados em `JSON` (compatíveis com a interface do Quiz e com o mapeamento Frente/Verso do Anki).
* **Hospedagem:** GitHub Pages / GitLab Pages.

---

## Diretórios Planejada

```text
quiz-tutoria-ufrn/
├── index.html            # Tela inicial (seleção de disciplina/tópico)
├── quiz.html             # Interface principal de resolução das questões
├── css/
│   └── style.css         # Estilização responsiva (foco em telas pequenas)
├── js/
│   ├── app.js            # Lógica de navegação, pontuação e carregamento JSON
│   ├── mathjax-config.js # Configuração do MathJax 3 (delimitadores e re-renderização dinâmica)
│   └── anki-api.js       # Comunicação com a API do Anki (createDeck / addNotes)
├── data/
│   ├── prob1.json        # Banco de questões: Probabilidade I
│   └── est_desc.json     # Banco de questões: Estatística Descritiva
└── README.md
