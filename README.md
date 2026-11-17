# Quiz Tutoria de Estatística

Aplicação web *mobile-first* desenvolvida como ferramenta de apoio pedagógico para a Tutoria de Estatística da Universidade Federal do Rio Grande do Norte (UFRN). O objetivo é permitir que os bolsistas apliquem testes rápidos e interativos com os alunos durante os atendimentos para fixação de conteúdo das disciplinas iniciais, com envio direto das questões para o **Anki** via API.

## Como Contribuir

### 1 - Clone o repositório e crie uma nova branch
No terminal, baixe o projeto e crie uma ramificação isolada para as suas alterações (evitando conflitos diretos na branch `main`):

```bash
git clone https://github.com/Davidcms23/projeto-tutoria.git
cd projeto-tutoria
git checkout -b feat/questoes-est-descritiva
```

### 2 - Adicione as novas questões no arquivo JSON
Edite o arquivo correspondente à disciplina dentro da pasta [`/data`]() (ex.: [`data/est_desc.json`]()) seguindo rigorosamente a estrutura abaixo.

```JSON
{
  "id": 1,
  "disciplina": "Estatística Descritiva",
  "topico": "Medidas de Dispersão",
  "enunciado": "Considere a amostra \\(X = \\{2, 4, 6\\}\\). Qual é o valor da variância amostral \\(s^2\\)?",
  "alternativas": ["2,67", "4,00", "2,00", "8,00"],
  "correta": 1,
  "justificativa": "Primeiro calculamos a média amostral \\(\\bar{x} = \\frac{2 + 4 + 6}{3} = 4\\). Em seguida, aplicamos a definição de variância amostral com denominador \\(n - 1\\): \\[s^2 = \\frac{(2 - 4)^2 + (4 - 4)^2 + (6 - 4)^2}{3 - 1} = \\frac{4 + 0 + 4}{2} = 4{,}00\\]"
}
```

### 3 - Salve e envie suas alterações (Commit e Push)
Valide se o JSON não possui erros de sintaxe (como vírgulas sobrando no último item), registre as mudanças e envie sua branch para o GitHub:

```bash
git add data/
git commit -m "feat(data): adiciona questoes de Estatistica Descritiva"
git push -u origin feat/questoes-est-descritiva
```
### 4 - Abra um Pull Request (PR)



