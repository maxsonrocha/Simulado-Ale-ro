# Transpetro — Etapa 1, lote 2 concluído: +100, acumulado 200/700

## Base e preservação

Main atualizada e inspecionada em `7a54ee0`, merge do PR #2. O commit `bd7a88e`
e seus 100 itens estavam presentes antes da autoria. Branch criada dessa main:
`feature/transpetro-banco-questoes-etapa-1-lote-2`.

Foram analisados os 100 itens anteriores, seus textos, alternativas, explicações,
competências e modelos de cálculo. A análise prévia conserva os 100 hashes e o
inventário de raciocínios em `auditorias/transpetro-etapa-1-lote-2-previa.json`.
**Nenhum dos 100 itens antigos foi corrigido, substituído, renumerado ou recebeu
metadados novos.** Testes comparam cada arquivo à main de partida e exigem que seu
prefixo antigo seja idêntico objeto a objeto, na mesma ordem. Os quatro arquivos
de auditoria do lote 1 também são preservados byte a byte.

App, HTML, CSS e os sete bancos ALERO estão inalterados. O motor de sorteio,
localStorage, vistas, erradas, histórico, regras e timer não foram modificados.
As pequenas adaptações estão nos validadores, auditorias e expectativas dos testes.

## Quantidades

| Área | Antes | Novas | Acumulado | Novas: média / alta / muito alta |
| --- | ---: | ---: | ---: | --- |
| Português | 20 | 20 | 40 | 4 / 9 / 7 |
| Inglês | 20 | 20 | 40 | 4 / 9 / 7 |
| Específicas | 60 | 60 | 120 | 12 / 27 / 21 |
| **Total** | **100** | **100** | **200** | **20 / 45 / 35** |

No acumulado: **40 médias, 90 altas, 70 muito altas**. A proporção de cada área
e de cada lote é 20%/45%/35%. Nenhuma questão do lote 3 foi criada.

| Assunto específico | Antes | Lote 2 | Acumulado | Meta da Etapa 1 |
| --- | ---: | ---: | ---: | ---: |
| Prevenção e Controle de Riscos | 12 | 2 | 14 | 90 |
| Legislação e NRs | 0 | 0 | 0 | 90 |
| Higiene Ocupacional | 16 | 0 | 16 | 80 |
| Análise/Avaliação/Gerenciamento de Riscos | 12 | 0 | 12 | 60 |
| Gestão de SMS | 4 | 10 | 14 | 40 |
| Acidentes do Trabalho | 4 | 10 | 14 | 40 |
| Emergências | 4 | 10 | 14 | 30 |
| Proteção Contra Incêndio | 2 | 8 | 10 | 24 |
| Ergonomia | 2 | 8 | 10 | 20 |
| Saúde Ocupacional | 2 | 8 | 10 | 16 |
| Desenvolvimento Sustentável | 2 | 4 | 6 | 10 |
| **Total** | **60** | **60** | **120** | **500** |

As novas específicas foram concentradas em matérias menos cobertas no lote 1,
sem repetir sua concentração em higiene, prevenção e gerenciamento.

Gabaritos novos: **20 A, 20 B, 20 C, 20 D, 20 E**; por área, 4 de cada letra em
PORT, 4 em ING e 12 em ESP. Acumulado: 40 de cada letra. O reposicionamento das
alternativas não alterou soluções e não foi aplicado às questões antigas.

Novos grupos: **20**, com duas questões por texto (dez textos de cada língua).
São **40 novas vinculadas e 60 novas independentes**. Acumulado: **40 grupos,
80 vinculadas, 120 independentes**. Todos usam `groupId` e a ordem original no
arquivo; não foi introduzido mecanismo paralelo de contexto ou ordenação.

IDs novos: PORT `0021..0040`, ING `0021..0040`, ESP `0061..0120`, com o prefixo
`TP26-ENGSEG-<ÁREA>-`. Não há colisões ou lacunas nos intervalos novos.

## Auditoria 1 — estrutural: aprovada para o acumulado de 200

Evidência: `auditorias/transpetro-etapa-1-lote-2-estrutura.json`.

Validados todos os 200 itens, campos, tipos, subassuntos, dificuldades, cinco
alternativas distintas, índices, explicações, IDs globais, áreas/arquivos,
assuntos, grupos, ordem, quotas acumuladas e quotas próprias de cada lote.

Não foram encontrados erros de sintaxe JSON, IDs ou gabaritos fora da faixa nos
itens publicados. O validador foi adaptado para unir os pareceres do lote 1 e
lote 2 sem reescrever o arquivo antigo. O plano registra o acumulado em
`loteTotal/loteAreas` e as duas execuções em `lotes`, com quotas independentes.

Um teste novo inicialmente comparava um array produzido no contexto VM com um
array nativo do Node: valores idênticos eram reprovados pelos protótipos distintos.
A asserção foi normalizada com `Array.from`, sem alterar IDs ou enfraquecer a
verificação de sequência. A suíte completa passou após a correção.

O validador sem `--partial` continua reprovando a liberação integral da Etapa 1,
pois faltam **500** questões. Essa falha esperada não impede a conclusão deste
lote de exatamente 100, nem foi transformada em aprovação da etapa inteira.

## Auditoria 2 — conteúdo: aprovada editorialmente para os 100 novos

Evidência: `auditorias/transpetro-etapa-1-lote-2-conteudo.json`, com 100 pareceres,
500 análises de alternativas, justificativa de dificuldade, gabarito e hash por
item. A revisão foi individual, não por amostragem. Foram examinados os textos
comuns e as relações necessárias para responder às dependentes.

`auditorias/transpetro-etapa-1-lote-2-calculos.json` registra **26 resoluções
numéricas/combinatórias/discretas** refeitas em código separado da autoria,
examinando as cinco opções. Também passaram os 30 recálculos preservados do lote 1.

Correções durante a revisão dos rascunhos e dos controles:

- PORT-0027: a intenção de atualizar meses conflitava com “não alterar a duração”.
  Foi esclarecido que se preserva o caráter contínuo da catalogação, não o número
  de meses a atualizar.
- ING-0021: corrigida a construção que falava em substituir o desgaste; o texto
  agora distingue substituir peças por desgaste ordinário de devolver componentes.
- ING-0039: adotado `non-attributable`, evitando associar uma permissão de uso
  anônimo ao rótulo `off the record`, que poderia sugerir uma convenção diferente.
- Melhorados distratores numéricos em ESP-0075, 0095, 0110, 0114 e 0115: omissão
  de horas, perda de pressão, denominadores de métricas diagnósticas e exclusão
  de tempo contribuído passam a corresponder a erros identificáveis.
- O novo script de recálculo inicialmente não representava números por extenso,
  o sinal de uma margem descrita como negativa e a altura de 4 mm mencionada na
  condição alternativa de ESP-0107. Corrigidos esses controles e reexecutadas
  as 26 verificações; os resultados corretos não foram mudados para passar o teste.

As classificações de dificuldade são editoriais e justificadas pela operação
exigida, não pelo comprimento dos textos. Não há calibração psicométrica nem
parecer clínico ou normativo independente.

## Auditoria 3 — qualidade e não repetição: aprovada editorialmente

Evidências: `auditorias/transpetro-etapa-1-lote-2-similaridade.json` e
`auditorias/transpetro-etapa-1-lote-2-semantica.json`.

Comparações textuais:

- novas × novas: **4.950 pares**;
- novas × antigas: **10.000 pares**;
- antigas × antigas: **4.950 pares** adicionais de regressão;
- total acumulado: **19.900 pares**, dos quais **14.950** são os confrontos
  obrigatórios envolvendo as novas.

Nenhuma duplicata canônica nem par final acima dos limiares de triagem lexical
foi encontrado. Contexto comum legítimo é separado da pergunta na comparação,
e números são neutralizados para ajudar a detectar troca superficial de valores.

A análise **semântica é editorial**, por cenário, operação de resolução,
conceito, dados e papel das alternativas, em confronto com o inventário integral
antigo. Há registro de novidade para cada uma das 100 novas e de confrontos
críticos relacionados aos temas antigos. Não foi chamado Jaccard de embedding,
nem se afirma que houve 14.950 pareceres humanos independentes. Similaridade
lexical baixa não foi tratada como prova suficiente de novidade.

Foram descartadas e substituídas **cinco questões candidatas**, antes da versão
final, por proximidade de raciocínio ou cenário:

1. ESP-0081 inicial, recontagem longitudinal de eventos/pessoas/atendimentos:
   próxima de ESP-0074; substituída por inferência de limite de frequência sob
   zero eventos em modelo Poisson.
2. ESP-0090 inicial, designação de equipes por competência: isomorfa ao problema
   de funções distintas de ESP-0072; substituída por estoque com devoluções e
   requisição indivisível.
3. ESP-0092 inicial, caminhos por repetidor com dependência comum: próxima do
   tema antigo de causa comum; substituída por decisão minimax sem probabilidades.
4. ING-0037 e ING-0038 iniciais: edição científica e expansão de siglas próximas
   do texto novo de Português-0025/0026; substituídas por inversão com `Only after`
   e interpretação de tempos sem inferência de imediatismo, em conferência.

Não são paráfrases cosméticas dos candidatos anteriores. Nenhuma substituição
atingiu os 100 itens já incorporados à main. Após as alterações, repetiram-se
estrutura, revisão dos itens afetados, hashes, recálculos e similaridade.

A resposta correta supera a mediana de extensão dos distratores em 9/20 PORT,
9/20 ING e 30/60 ESP novos. A distribuição de letras é equilibrada. Esses
indicadores não substituem o exame editorial de plausibilidade.

## Fontes e limitações

MTE, Planalto e Câmara foram tentados novamente. O **proxy do ambiente recusou
as conexões HTTPS com 403**, impedindo consultar o conteúdo de origem. A evidência
com URLs e resultados está em `auditorias/transpetro-etapa-1-lote-2-fontes.json`.
Não se afirma que os textos oficiais foram consultados ou que os sites estejam
fora do ar. Não se contornou a política de rede.

Assim, **zero novas questões de legislação**, sem inventar itens de NR, prazos,
percentuais, limites legais ou requisitos normativos. Há exercícios técnicos
com parâmetros, critérios internos e modelos explicitados no enunciado; eles
não são apresentados como exigências legais ou valores universais de projeto.

As rodadas foram feitas pelo mesmo assistente com objetivos distintos; não são
três especialistas humanos independentes. A revisão semântica editorial,
linguística e técnica continua sujeita à revisão humana. Ainda faltam 500 itens
para a Etapa 1, inclusive toda a parcela de legislação. Não se iniciou lote 3.

## Testes e regressão

- `node scripts/validate-transpetro.cjs --partial`: **aprovado, 200/200 íntegros**.
- `node scripts/validate-transpetro.cjs`: falha esperada para a meta completa
  de 700; restam 500 e a cobertura integral.
- `node scripts/audit-transpetro-calculations.cjs`: **30/30 antigos passaram**.
- `node scripts/audit-transpetro-lote2-calculations.cjs`: **26/26 novos passaram**.
- `node scripts/audit-transpetro-similarity.cjs`: **19.900 pares, sem alertas finais**.
- `node --test tests/transpetro.cjs tests/transpetro-bank.cjs`: **65 passaram**.
- Chromium: `tests/transpetro-bank-ui.cjs`, `tests/transpetro-ui.cjs` e
  `tests/multiconcurso.cjs`: **passaram**. Incluem banco real, PROVA/TREINO,
  completo/específico, respostas, explicações, mapa, marcações, timer 4h30,
  aprovação/reprovação, histórico e contexto de erradas em grupo antigo e novo.
- ALERO: Desenhista e Arquiteto em oito combinações de modo/formato, timer,
  navegação, respostas, correção, histórico, erradas, grupos, migração e isolamento:
  **passaram**. Bancos e código da aplicação comparados com as bases Git.

O teste de dez gerações consecutivas preservou grupos e priorizou inéditas
sempre que suficientes. O acumulado agora garante **duas provas completas
inteiramente inéditas** por ciclo: na terceira, restam só 20 específicas
inéditas para uma cota de 50. Isso não é tratado como falha do motor nem como
capacidade de dez provas inéditas. O motor permaneceu intocado.

## Arquivos desta alteração

- `MULTICONCURSO.md`
- `data/transpetro/eng_seguranca/acidentes.json`
- `data/transpetro/eng_seguranca/desenvolvimento_sustentavel.json`
- `data/transpetro/eng_seguranca/emergencias.json`
- `data/transpetro/eng_seguranca/ergonomia.json`
- `data/transpetro/eng_seguranca/gestao_sms.json`
- `data/transpetro/eng_seguranca/incendio.json`
- `data/transpetro/eng_seguranca/ingles.json`
- `data/transpetro/eng_seguranca/portugues.json`
- `data/transpetro/eng_seguranca/prevencao_riscos.json`
- `data/transpetro/eng_seguranca/saude_ocupacional.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-2-similaridade.json`
- `docs/transpetro-etapa-1-lote-2-relatorio.md`
- `docs/transpetro-etapa-1-plano.json`
- `scripts/audit-transpetro-lote2-calculations.cjs`
- `scripts/audit-transpetro-similarity.cjs`
- `scripts/validate-transpetro.cjs`
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro.cjs`

Os JSONs de higiene, gerenciamento e legislação permanecem sem alteração, assim
como os 100 objetos originais em todos os arquivos e suas auditorias históricas.
