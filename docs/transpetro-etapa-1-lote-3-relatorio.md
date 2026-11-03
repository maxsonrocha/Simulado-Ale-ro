# Transpetro 2026 — Etapa 1, Lote 3

Branch: `feature/transpetro-banco-questoes-etapa-1-lote-3`. Base: `ddb8e7a`
(main após PR #5). O commit de entrega é o commit que contém este relatório;
seu hash é informado na entrega/PR. Não houve merge nem início do Lote 4.

**200 → 300 itens: exatamente 100 novos**, sem substituir, reordenar,
renumerar ou acrescentar metadados aos 200 anteriores. Preservação verificada
contra o snapshot Git da base e contra os arquivos históricos de auditoria.
`app.js`, `index.html`, `styles.css` e todos os bancos ALERO ficaram intactos.

## Contagem por arquivo/assunto

| Arquivo em data/transpetro/eng_seguranca | Antes | Novas | Acumulado |
| --- | ---: | ---: | ---: |
| acidentes.json | 14 | 2 | 16 |
| desenvolvimento_sustentavel.json | 6 | 0 | 6 |
| emergencias.json | 14 | 1 | 15 |
| ergonomia.json | 10 | 1 | 11 |
| gerenciamento_riscos.json | 12 | 6 | 18 |
| gestao_sms.json | 14 | 4 | 18 |
| higiene_ocupacional.json | 16 | 8 | 24 |
| incendio.json | 10 | 1 | 11 |
| ingles.json | 40 | 20 | 60 |
| legislacao_nr.json | 0 | 30 | 30 |
| portugues.json | 40 | 20 | 60 |
| prevencao_riscos.json | 14 | 6 | 20 |
| saude_ocupacional.json | 10 | 1 | 11 |

PORT: +20 = 60; ING: +20 = 60; ESP: +60 = 180.
A distribuição usa os déficits reais frente à matriz de 500 específicas:
Legislação tinha 0/90; Prevenção 14/90; Higiene 16/80; Gerenciamento 12/60.
Foram priorizadas 30 normativas, 8 Higiene, 6 Prevenção e 6 Gerenciamento;
os outros dez itens mantêm avanço nos demais eixos. Sustentabilidade ficou
inalterada em 6/10. A matriz-alvo original continua no plano, sem redução.

| Área nova | Média | Alta | Muito alta | A / B / C / D / E |
| --- | ---: | ---: | ---: | --- |
| PORT | 4 | 9 | 7 | 4 / 4 / 4 / 4 / 4 |
| ING | 4 | 9 | 7 | 4 / 4 / 4 / 4 / 4 |
| ESP | 12 | 27 | 21 | 12 / 12 / 12 / 12 / 12 |
| Lote 3 | 20 | 45 | 35 | 20 / 20 / 20 / 20 / 20 |

Acumulado: **60 médias, 135 altas, 105 muito altas**; gabaritos 60 de cada letra.
Novos IDs: `TP26-ENGSEG-PORT-0041..0060`, `ING-0041..0060`, `ESP-0121..0180`.
Novos grupos: 20 (dez PORT e dez ING, sufixos 021..030); 40 vinculadas e 60
independentes. Acumulado: 60 grupos, 120 vinculadas e 180 independentes.
Textos são autorais; contexto está no primeiro item e a ordem do arquivo é
preservada pelo mecanismo `groupId`/`_ord` existente. Não foi criado outro motor.

## Auditoria 1 — estrutural: APROVADA

`auditorias/transpetro-etapa-1-lote-3-estrutura.json`: validação dos 300 itens,
JSON, IDs globais e ALERO, metadados, alternativas distintas, gabaritos, áreas,
assuntos, dificuldades, grupos contíguos/ordenados e quotas dos três lotes.
Hashes dos 200 antigos estão em `...-previa.json`; pareceres dos lotes 1/2
permanecem byte a byte iguais aos da base Git. Não houve erro grave nos antigos.

A primeira execução dos novos testes encontrou uma comparação de arrays entre
realms diferentes do VM: os valores eram iguais, mas os protótipos não.
O teste foi corrigido com `Array.from`, preservando a comparação integral.
Outro controle encontrou uma descrição de operação curta (`cipa_escopo`);
a ficha editorial recebeu a descrição efetiva da operação. Nenhuma questão
antiga foi alterada para satisfazer esses controles. As verificações passaram
após as correções.

## Auditoria 2 — conteúdo: APROVADA EDITORIALMENTE

`...-conteudo.json` registra 100 pareceres vinculados por hash, com análise das
500 alternativas, resposta correta e justificativa da dificuldade. Revisão
integral pelo assistente, não amostragem nem três especialistas independentes.

Fontes: leitura dos nove arquivos obrigatórios de `references/transpetro/`,
incluindo os DOIS corpus e o edital estruturado. `...-fontes.json` vincula 33
itens ao arquivo/fichas e ao hash da fonte local, incluindo **todos os 30 de
Legislação/NRs**. Foram usadas proposições de NR-01, 04, 05, 06, 07, 09, 10,
11, 12, 13, 15, 16, 17, 20, 26, 29, 30, 32, 34, 35, 37, revogação de NR-02/27,
eSocial e NHOs. A listagem indica as fichas efetivamente usadas, não afirma
cobertura fina de todas as NRs. NR-18/23/33 permanecem possíveis para futuros
lotes, sem inventar requisitos aqui.

Seis tentativas externas (MTE, eSocial, Fundacentro, Planalto e índice MTE
alternativo) foram recusadas pelo proxy antes de acessar o conteúdo.
O corpus auditado foi o **fallback autorizado**, não simples coleção de URLs.
Nenhuma consulta externa bem-sucedida nem atualização normativa independente
é alegada. Detalhes ausentes não foram completados por memória. Não se usaram
cláusulas ISO/ABNT protegidas; a questão sobre edições usa apenas a trava do edital.

`...-calculos.json` registra oito segundas resoluções: conversão molar de gás,
transiente hidráulico, conjuntos mínimos de corte, fronteira de Pareto,
condições de revalidação de PT, vigências, calendário CAT e proporção observada
na amostra dirigida. Dois são cálculos físicos; os outros seis verificam
raciocínios discretos/temporais/quantitativos. Foram examinadas as cinco opções
em código separado da autoria, com unidades e hipóteses; resultados 8/8.
Os 30 recálculos do lote 1 e os 26 do lote 2 também passaram.

A revisão também: aproximou distratores da CIPA, jato hidráulico e selagem
passiva; encurtou respostas corretas que davam pistas por extensão; corrigiu
“futura até” para “vigência em” na data da nova NR-10; e converteu localizadores
parciais de fonte em caminhos existentes, deixando as fichas no registro de
fontes. Após essas mudanças, hashes, estrutura e testes foram reexecutados.

## Auditoria 3 — global: APROVADA EDITORIALMENTE COM LIMITES

`...-similaridade.json`: **44.850 pares** no acumulado: 4.950 novas × novas,
20.000 novas × antigas e 19.900 antigas × antigas. Nenhuma duplicata canônica
ou par final acima dos limiares lexicais. Números são neutralizados e o contexto
compartilhado legítimo é separado da pergunta. O modo `--lote 2` mantém a
regressão histórica de 19.900 pares sem incorporar os itens posteriores.

`...-semantica.json`: inventário dos 200 antigos, operação e confronto editorial
para cada novo. Foram examinados cenário, inferência, condições e distratores,
não apenas igualdade de strings. Quatro rascunhos foram substituídos:

- PORT-0047/0048: restauração/descrição versus prescrição ficou próxima da dupla
  nova sobre distribuição de água; substituída por ironia e efeitos enunciativos.
- ESP-0175: investigação de queda de peça próxima de cenário antigo; substituída
  por contaminação e independência de relatos de testemunhas.
- ESP-0164: falso sinal permissivo próximo do intertravamento antigo; substituído
  por reação axial e caminho de cargas em teste de tubulação.

Nenhuma substituição atingiu os 200 antigos. São quatro questões em três
substituições de cenário, não três questões. Não se identificou duplicidade
relevante remanescente na revisão. Conceitos de língua e SST podem reaparecer
em exercícios distintos; isso não é alegação de conceitos inéditos na disciplina.

Limites: triagem lexical não é embedding nem prova de originalidade semântica;
não houve 24.950 pareceres humanos de pares. O confronto semântico é editorial
pelo mesmo assistente, sujeito a revisão humana. Dificuldade não foi calibrada
psicometricamente. Correção normativa depende das proposições do corpus na
versão registrada; vigência futura demanda nova conferência.

## Testes finais

- Validador parcial: aprovado, 300 itens e auditorias vinculadas.
- Validador integral: **reprovado como esperado**, 300/700; faltam 400.
  A meta/gate de 700 não foi enfraquecida.
- Node: `node --test tests/transpetro.cjs tests/transpetro-bank.cjs`: **72/72**.
- Recálculos: **30 + 26 antigos e 8 novos aprovados**.
- Similaridade global: 44.850 pares; sem alertas acima dos limiares.
- `node --check app.js` e `git diff --check`: aprovados.
- Chromium `transpetro-bank-ui.cjs`: banco real, completo 10/10/50, específico 50,
  PROVA/TREINO, respostas, explicações, mapa, marcações, timer 4h30 e aviso 15min,
  resultado, histórico, erradas com contexto dos três lotes e tela móvel: aprovado.
- Chromium `transpetro-ui.cjs`: critérios e múltiplos motivos, área/assunto,
  isolamento, erradas, modos e timer, usando apenas mocks em memória: aprovado.
- Chromium `multiconcurso.cjs`: oito combinações ALERO Desenhista/Arquiteto ×
  modo × formato, notas comparadas à base, bancos, grupos, navegação, respostas,
  feedback, mapa, erradas, histórico, migração, limpeza e isolamento: aprovado.

`...-motor.json` e `audit-transpetro-lote3-engine.cjs` executam o motor real em
**dez sementes**, quatro provas consecutivas em cada uma: as três primeiras
são inteiramente inéditas, com grupos completos, contíguos e na ordem; a quarta
usa 30 específicas inéditas e 20 já vistas. A capacidade prática confirmada é
**três provas completas inéditas**, não seis: 180 específicas limitam a cota de
50, embora 60 PORT/ING sustentem seis cotas de dez. Teste de dez gerações também
verifica priorização de inéditas e renovação de ciclo, sem alterar o motor.

## Arquivos

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
- `scripts/audit-transpetro-similarity.cjs`
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro.cjs`

Criados:

- `docs/auditorias/transpetro-etapa-1-lote-3-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-motor.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-3-similaridade.json`
- `docs/transpetro-etapa-1-lote-3-relatorio.md`
- `scripts/audit-transpetro-lote3-calculations.cjs`
- `scripts/audit-transpetro-lote3-engine.cjs`

As alterações de código restringem-se a validadores auxiliares/testes e ao modo
histórico da triagem. O carregador, sorteio, temporizador, avaliação e persistência
da aplicação não mudaram. A principal pendência é revisão humana do conteúdo,
distratores e classificação editorial, além dos 400 itens ainda faltantes para
concluir a Etapa 1. Este lote não antecipa o Lote 4.
