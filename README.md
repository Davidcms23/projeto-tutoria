# Quiz Tutoria de Estatística - UFRN

Aplicação web *mobile-first* desenvolvida como ferramenta de apoio pedagógico para a Tutoria de Estatística da Universidade Federal do Rio Grande do Norte (UFRN). O objetivo é permitir que os bolsistas apliquem testes rápidos e interativos com os alunos durante os atendimentos para fixação de conteúdo das disciplinas iniciais, com envio direto das questões para o **Anki** via API.

## Como Contribuir

 1. Faça um clone deste repositório.
 2. Para adicionar novas questões, edite os arquivos na pasta [/data]() seguindo o modelo(note o escape duplo `\\` exigido pelo formato JSON para barras invertidas do LaTeX):

```JSON
{
  "id": 1,
  "disciplina": "Probabilidade I",
  "topico": "Probabilidade Condicional",
  "enunciado": "Sejam \\(A\\) e \\(B\\) dois eventos independentes com \\(P(A) = 0{,}4\\) e \\(P(B) = 0{,}5\\). Qual o valor de \\(P(A \\cap B)\\)?",
  "alternativas": ["0,90", "0,20", "0,10", "0,50"],
  "correta": 1,
  "justificativa": "Como \\(A\\) e \\(B\\) são independentes, temos: \\[P(A \\cap B) = P(A) \\cdot P(B) = 0{,}4 \\cdot 0{,}5 = 0{,}20\\]"
}
```
  3. Faça um **PuLL Request** descrevendo as questões adicionais.

