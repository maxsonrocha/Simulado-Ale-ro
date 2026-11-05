# Fundamentos dos pilotos visuais

Figuras e dados originais, produzidos para os 20 exercícios. Todos os valores são
hipóteses didáticas ou critérios internos explícitos, nunca limites legais.
As fórmulas e regras necessárias estão no enunciado ou na figura. A descrição
textual contém os mesmos dados para leitura assistiva e falha de arquivo.

## Referências bibliográficas de apoio

- **estatistica** — NIST/SEMATECH, *e-Handbook of Statistical Methods*:
  https://www.itl.nist.gov/div898/handbook/ . Distribuições, gráficos, medidas
  descritivas, regressão e monitoramento estatístico. A regra de seis observações
  do piloto03 é interna, não atribuída como regra normativa ou transcrição do NIST.
- **matematica** — OpenStax, *Precalculus 2e*:
  https://openstax.org/details/books/precalculus-2e . Coordenadas, distâncias,
  funções e álgebra. Balanços dos exercícios são modelos expressamente definidos.
- **calculo** — OpenStax, *Calculus, Volume 2*:
  https://openstax.org/details/books/calculus-volume-2 . Integração e área.
- **fisica** — OpenStax, *University Physics, Volume 1*:
  https://openstax.org/details/books/university-physics-volume-1 . Grandezas,
  modelagem e raciocínio quantitativo; nenhuma tabela normativa é atribuída ao livro.
- **grafos** — Kenneth H. Rosen, *Discrete Mathematics and Its Applications*,
  McGraw Hill. Caminhos e conectividade em grafos. A rede do piloto07 é hipotética.
- **estruturas** — R. C. Hibbeler, *Mechanics of Materials*, Pearson, tópico
  flambagem elástica de colunas. O piloto13 usa explicitamente o modelo de Euler,
  com mesmoEI e comprimento efetivoKL; não dimensiona suporte real.
- **incendio** — Dougal Drysdale, *An Introduction to Fire Dynamics*, Wiley.
  Fundamento de energia de combustíveis. O inventário do piloto16 é hipotético,
  sem classificação de ocupação, exigência de proteção ou coeficiente legal.

Não houve consulta externa bem-sucedida nesta execução: NIST e representações
OpenStax tentadas retornaram403 do túnel. As referências são identificáveis e
verificáveis pelo revisor, mas não se afirma leitura de edição/página/cláusula
externa. Não foram copiados textos ou figuras dessas obras. Edição/página exata
não é alegada. O corpus normativo local permanece intacto; os pilotos não cobram
requisito fino de NR/ISO sem fonte. Conferir bibliografia externamente integra a
revisão humana antes do merge.

## Conferência matemática dos modelos

O manifesto `docs/transpetro-visuais-dados.json` transcreve dados das figuras.
O script `scripts/validate-transpetro-visuais.cjs` refaz, separadamente da autoria:
fração temporal1/6; IQR30/10; seis pontos acima da referência; distância ao centro;
paresB=2A; domínio1–4/estimativa8; corte da rede; condicional45/70; contagem deA;
comparação de referências; balanço de reclassificação; união de retângulos;
razão de Euler(3/2)²; integral por trapézios56/10; comprimentos10/8;
inventário2900/30; posições10/11 na classe[5,10); custos16/17/26;
captação20/5; amplitudes10/2/5.

Imagens são necessárias à resolução: enunciados não repetem seus dados completos.
A alternativa textual é equivalência de acesso, não um gabarito ou decoração.
Nenhum resultado desses modelos constitui laudo ou condição suficiente de segurança.
