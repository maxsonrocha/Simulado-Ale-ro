# Transpetro 2026 — Etapa 1, Lote 4

Branch: `feature/transpetro-banco-questoes-etapa-1-lote-4`.
Base: `5b51b64`, main atualizada com os três lotes integrados.
Commit de entrega: o commit que contém este relatório, com hash informado na entrega/PR.
**Exatamente +100 questões; banco 300 → 400. Não integrar sem auditoria independente do usuário.**

## Distribuição e preservação

| Área | Anterior | Lote 4 | Acumulado | Média / alta / muito alta no lote |
| --- | ---: | ---: | ---: | --- |
| Português | 60 | 20 | 80 | 4 / 9 / 7 |
| Inglês | 60 | 20 | 80 | 4 / 9 / 7 |
| Específicos | 180 | 60 | 240 | 12 / 27 / 21 |
| Total | 300 | 100 | 400 | 20 / 45 / 35 |

Acumulado: **80 médias, 180 altas e 140 muito altas**.
Gabaritos: 20 de cada letra no novo lote e 80 de cada no acumulado.
Por língua: 4 de cada letra; ESP: 12 de cada. Balanceamento apenas por permutação
correspondente de alternativas e pareceres, sem alterar qual proposição é correta.

| Arquivo/assunto | Antes | Novas | Acumulado | Meta ESP |
| --- | ---: | ---: | ---: | ---: |
| acidentes.json | 16 | 4 | 20 | 40 |
| desenvolvimento_sustentavel.json | 6 | 0 | 6 | 10 |
| emergencias.json | 15 | 2 | 17 | 30 |
| ergonomia.json | 11 | 1 | 12 | 20 |
| gerenciamento_riscos.json | 18 | 8 | 26 | 60 |
| gestao_sms.json | 18 | 3 | 21 | 40 |
| higiene_ocupacional.json | 24 | 11 | 35 | 80 |
| incendio.json | 11 | 2 | 13 | 24 |
| ingles.json | 60 | 20 | 80 | — |
| legislacao_nr.json | 30 | 14 | 44 | 90 |
| portugues.json | 60 | 20 | 80 | — |
| prevencao_riscos.json | 20 | 14 | 34 | 90 |
| saude_ocupacional.json | 11 | 1 | 12 | 16 |

Antes do lote, os maiores déficits específicos eram Prevenção 70, Legislação 60,
Higiene 56 e Gerenciamento 42. Receberam 14, 14, 11 e 8 itens; os outros 13 foram
para SMS, Acidentes, Emergências, Incêndio, Ergonomia e Saúde. Legislação recebeu
reforço para explorar NR-18/23/33, sem ultrapassar o suporte das fichas locais.
Sustentabilidade ficou em 6/10; não foi preenchida por conveniência.

Novos IDs: `TP26-ENGSEG-PORT-0061..0080`, `ING-0061..0080` e `ESP-0181..0240`.
Novos grupos: 20, sufixos 031..040 em cada língua, duas questões por texto.
Novas: 40 vinculadas e 60 independentes. Acumulado: 80 grupos, 160 vinculadas,
240 independentes. O contexto permanece na primeira questão, com `groupId` e
ordem original; dependentes recebem o contexto pelo motor já existente.

Os **300 itens anteriores permanecem iguais, na mesma ordem**, sem novos
metadados, renumeração ou correções. Teste compara seus objetos com a main-base;
pareceres e corpus históricos são comparados byte a byte. Não houve erro grave
que exigisse alteração dos antigos. `app.js`, HTML, CSS e bancos ALERO intactos.

## Auditoria 1 — estrutural: APROVADA

Evidências em `auditorias/transpetro-etapa-1-lote-4-estrutura.json` e
`...-previa.json`: 400 itens, identidade concurso/cargo, áreas/assuntos por arquivo,
subassuntos, dificuldade, IDs globais, cinco alternativas não vazias e distintas,
answer inteiro, explicações, quotas por lote/área e grupos contíguos e ordenados.
Pareceres de conteúdo estão vinculados por hash a todos os itens reais.

**Problema encontrado:** PORT-0070 tinha duas opções que diferiam apenas por
acento e colidiam na normalização do validador. O validador não foi afrouxado:
a questão foi refeita com relativo possessivo `cujo`, concordância e agente da
passiva. As cinco opções passaram a ser distintas. Estrutura e hashes foram
reexecutados após a correção e após os ajustes editoriais posteriores.

O gate integral continua exigindo **700** e deve reprovar com 400. Faltam 300;
nenhuma aprovação parcial foi apresentada como conclusão da Etapa 1.

## Auditoria 2 — editorial e normativa: APROVADA EDITORIALMENTE

`...-conteudo.json`: revisão individual dos **100 enunciados, 500 alternativas,
100 gabaritos e 100 explicações**, com justificativa da dificuldade e hash.
As rodadas foram feitas pelo assistente com objetivos diferentes; não são três
especialistas independentes. A classificação é editorial, sem calibração empírica.

Foram relidos plano, matriz, relatórios anteriores e base de nove arquivos em
`references/transpetro/`, incluindo os DOIS corpus e as travas do edital.
`...-fontes.json` registra **15 itens normativos**: os 14 de Legislação e um de
Saúde, com arquivo, fichas e hash da fonte. NR-18 aparece em obra civil e em
interfaces com máquinas/caldeiras; NR-33 em espaços confinados e frentes de obra;
NR-23 em proteção contra incêndio e interface com inflamáveis/NR-20.

A cobertura de NR-18/23/33 é **de escopo e interfaces**, como permitem as fichas.
Não foram inventados PET, atribuições, resgate, cargas, periodicidades ou
especificações dimensionais dessas normas. As cargas e intervalos de treinamento
NR-35 estão explicitamente no corpus. Lei 14.063/2020 é cobrada por seu objeto,
sem inventar classes obrigatórias de assinatura. Não há cláusula ISO/ABNT nova;
as edições expressas no edital não foram substituídas.

Quatro consultas externas, inclusive índice oficial alternativo, foram recusadas
pelo proxy com HTTP 403 antes da leitura do conteúdo. Usou-se o corpus local
auditado como fallback autorizado, não memória para completar lacunas. Não se
alega conferência externa bem-sucedida de vigência nesta execução.

`...-calculos.json`: **17 segundas resoluções aprovadas**, em código separado da
autoria: 14 numéricas e três discretas/temporais (carga inicial, calendário de
periódico e compatibilidade de tarefas). Incluem solo, frenagem, eslingas, folga
de queda, RC, resistências térmicas, covariância, percentil, saturação/diluição,
carteira de projetos, cobertura de testes, frequência cumulativa, capacitação
por pessoa e momento muscular. Unidades, hipóteses e as cinco opções conferidas.
RC foi refeito por bisseção, com tolerância declarada para o ln arredondado dado;
carteira e tarefas por enumeração. Parâmetros de exercício não são limites legais.
Também passaram os **64 recálculos históricos** (30 + 26 + 8).

A revisão substituiu alternativas caricatas de junta aparafusada e de médico
responsável por erros próximos ao tema. Respostas corretas longas foram encurtadas
sem perder as condições do problema; detalhes explicativos permanecem na explicação.
Após isso, repetiram-se estrutura, hashes, recálculos e testes.

Correta maior que a mediana dos distratores: PORT 9/20, ING 9/20 e ESP 26/60. Essa métrica é triagem, não certificação de qualidade.

## Auditoria 3 — global: APROVADA EDITORIALMENTE COM LIMITES

`...-similaridade.json`: **79.800 comparações lexicais** — 4.950 novas × novas,
30.000 novas × 300 antigas e 44.850 antigas × antigas. Números neutralizados;
contexto compartilhado legítimo separado da pergunta. Nenhuma duplicata canônica
final e nenhum par final acima dos limiares. Isso não prova originalidade semântica.

`...-semantica.json`: inventário dos 300 antigos e 100 registros de cenário/operação,
condições e confrontos. Candidatos lexicais e confrontos críticos dirigidos foram
revisados editorialmente; não se alegam embeddings nem 34.950 pareceres humanos.
Conceitos do programa podem reaparecer em problemas distintos. A revisão procurou
isomorfismos, trocas de nomes/números, contexto, papel dos distratores e inferências.

**Sete rascunhos substituídos antes da versão final:**

- PORT-0077/0078: edição de entrevistas próxima de relatos antigos → composição
  e ordem de leitura de romance.
- PORT-0071/0072: evidência discriminante próxima de raciocínio anterior → citação,
  voz citada e distanciamento da analista.
- PORT-0070: regência relativa próxima de exercícios anteriores e colisão de
  alternativas normalizadas → `cujo`, posse e preservação de agente.
- ESP-0229: abrangência de achados próxima de discussão anterior → cobertura de
  capacitação por interseção de pessoas.
- ESP-0237: discussão sobre limitação de ficha normativa próxima de anteriores →
  fulgor versus autoignição, com definições explícitas.

Nenhuma substituição atingiu os 300 antigos. Depois das mudanças, os controles
afetados foram reexecutados. Não se encontrou duplicidade relevante remanescente
na revisão editorial; não é garantia matemática de ausência de toda paráfrase.

## Testes e regressão

- `node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs`:
  **79 passaram, zero falhas**.
- Validador parcial: **400/400 íntegros**. Integral: falha esperada 400/700.
- Recálculos: **17/17 novos e 64/64 anteriores** aprovados.
- Chromium `transpetro-bank-ui.cjs`: banco real de 400; completo 10/10/50,
  específico 50, PROVA/TREINO, respostas, feedback/explicações, mapa, marcações,
  timer 4h30 e aviso de 15min, resultado, histórico, erradas/contexto dos quatro
  lotes e tela móvel — **aprovado**.
- Chromium `transpetro-ui.cjs`: critérios, resultados, assuntos, histórico, modos,
  grupos, erradas e timer com mocks somente em memória — **aprovado**.
- Chromium `multiconcurso.cjs`: oito combinações ALERO (Desenhista/Arquiteto,
  PROVA/TREINO, completo/específico), correção, timer, navegação, respostas, mapa,
  marcações, grupos, erradas, histórico, migração e isolamento — **aprovado**.
- `node --check app.js` e `git diff --check` — **aprovados**.

`...-motor.json`: dez sementes, cinco provas consecutivas por semente. **Quatro
completas inteiramente inéditas**, com grupos completos, contíguos e ordenados;
na quinta, 40 específicas inéditas e 10 vistas. PORT/ING permitem oito cotas de
dez, mas ESP (240/50) limita a capacidade completa. O limite teórico de quatro
foi confirmado pelo motor real, não presumido apenas por divisão.

O teste histórico do motor do Lote 3 passou a filtrar explicitamente seu snapshot
até aquele lote, preservando a capacidade histórica de três. Essa mudança fica
no script de auditoria, não no motor da aplicação. Os modos históricos de
similaridade e os testes de preservação dos três lotes continuam ativos.

## Arquivos e limites de entrega

Modificados:

- `MULTICONCURSO.md`
- `data/transpetro/eng_seguranca/acidentes.json`
- `data/transpetro/eng_seguranca/emergencias.json`
- `data/transpetro/eng_seguranca/ergonomia.json`
- `data/transpetro/eng_seguranca/gerenciamento_riscos.json`
- `data/transpetro/eng_seguranca/gestao_sms.json`
- `data/transpetro/eng_seguranca/higiene_ocupacional.json`
- `data/transpetro/eng_seguranca/incendio.json`
- `data/transpetro/eng_seguranca/ingles.json`
- `data/transpetro/eng_seguranca/legislacao_nr.json`
- `data/transpetro/eng_seguranca/portugues.json`
- `data/transpetro/eng_seguranca/prevencao_riscos.json`
- `data/transpetro/eng_seguranca/saude_ocupacional.json`
- `docs/transpetro-etapa-1-plano.json`
- `scripts/audit-transpetro-lote3-engine.cjs`
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro.cjs`

Criados:

- `docs/auditorias/transpetro-etapa-1-lote-4-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-motor.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-4-similaridade.json`
- `docs/transpetro-etapa-1-lote-4-relatorio.md`
- `scripts/audit-transpetro-lote4-calculations.cjs`
- `scripts/audit-transpetro-lote4-engine.cjs`
- `tests/transpetro-lote4.cjs`

O motor, armazenamento concurso/cargo, ciclo de inéditas, histórico, modos e
avaliações da aplicação não foram alterados. As mudanças de código são scripts
de verificação e expectativas/testes. O projeto permanece estático e compatível
com GitHub Pages, sem dependências de produção novas.

**Limitações:** fontes externas bloqueadas; uso limitado ao corpus registrado;
revisão linguística/técnica e semântica pelo assistente, sem parecer humano ou
calibração psicométrica independente. Cabe à auditoria do usuário avaliar também
o nível e a plausibilidade dos distratores antes da integração. Restam 300 itens
para a Etapa 1. **Sem merge e sem iniciar Lote 5.**
