# Transpetro 2026 — Etapa 1, Lote 6

Branch: `feature/transpetro-banco-questoes-etapa-1-lote-6`.
Base: `538307c`, main atualizada com merge do Lote 5. A referência
`refs/pull/8/head` aponta para `bd276e158ce3dbeb944d4da57c16d70e41454d24`,
ancestral da base. Assim foi confirmada a integração da PR #8.
O commit da entrega é o commit que adiciona este relatório, consultável no histórico da branch.

## Quantidade e preservação

**500 → 600 questões: exatamente +100 ESP**, IDs `TP26-ENGSEG-ESP-0301` até
`TP26-ENGSEG-ESP-0400`. Nenhuma questão de PORT ou ING adicionada.
Os 500 objetos anteriores, sua ordem e seus metadados foram comparados com a base.
Os dois arquivos de línguas, todos os bancos ALERO, `app.js`, `index.html`,
`styles.css`, corpus e auditorias anteriores continuam idênticos à base.
Não houve correção de item antigo, alteração do motor, interface ou aprovação.

A distribuição proposta foi mantida: todos os quantitativos cabem nos saldos
reais da matriz de 500 ESP, sem ultrapassar qualquer meta. O arquivo prévia
registra a contagem inicial e hashes dos arquivos anteriores.

| Arquivo/assunto | Antes | Novas | Agora | Meta Etapa 1 | Saldo |
|---|---:|---:|---:|---:|---:|
| `acidentes.json` | 23 | 6 | 29 | 40 | 11 |
| `desenvolvimento_sustentavel.json` | 7 | 1 | 8 | 10 | 2 |
| `emergencias.json` | 19 | 4 | 23 | 30 | 7 |
| `ergonomia.json` | 13 | 3 | 16 | 20 | 4 |
| `gerenciamento_riscos.json` | 35 | 15 | 50 | 60 | 10 |
| `gestao_sms.json` | 27 | 7 | 34 | 40 | 6 |
| `higiene_ocupacional.json` | 46 | 17 | 63 | 80 | 17 |
| `incendio.json` | 15 | 3 | 18 | 24 | 6 |
| `ingles.json` | 100 | 0 | 100 | 100 | 0 |
| `legislacao_nr.json` | 54 | 20 | 74 | 90 | 16 |
| `portugues.json` | 100 | 0 | 100 | 100 | 0 |
| `prevencao_riscos.json` | 48 | 22 | 70 | 90 | 20 |
| `saude_ocupacional.json` | 13 | 2 | 15 | 16 | 1 |

Acumulado: **100 PORT +100 ING +400 ESP =600**. Faltam exclusivamente 100 ESP
para a Etapa 1 de 700; esse saldo é planejamento, não autoria de um próximo lote.

| Dificuldade | Lote 6 | Acumulado ESP | Acumulado geral |
|---|---:|---:|---:|
| media |20|80|120|
| alta |45|180|270|
| muito_alta |35|140|210|

Gabaritos novos: **20A /20B /20C /20D /20E**. Acumulado:120 de cada letra;
ESP possui 80 de cada. Houve permutação de alternativas junto com seus pareceres,
sem alterar a resposta tecnicamente correta para alcançar a distribuição.

Novos grupos: `TP26-ESP-001` (0315/0316, dilatação e reação) e
`TP26-ESP-002` (0383/0384, cronologia e hipótese causal): quatro vinculadas e
96 independentes. Acumulado:102 grupos,204 vinculadas,396 independentes.
Usa-se somente `groupId` e ordem de arquivo já suportados pelo motor; contexto
no primeiro item acompanha a dependente no caderno, com o grupo completo.
A correta companheira não passa a constar dos IDs errados por esse motivo.

## Auditoria 1 — estrutural: APROVADA

Validadas as 600 com o carregador real: JSON, campos e tipos, identidade,
IDs globais inclusive contra ALERO, assunto/arquivo, subassunto, dificuldade,
cinco opções não vazias e distintas, índice de resposta, explicação, fontes,
contagens por lote/área/assunto, grupos contíguos e ordenados e contexto.
Os 100 pareceres novos contêm 500 justificativas e hashes do conteúdo final.

Achados corrigidos:

- ESP0307: alternativas diferentes só pelo sinal tornavam-se iguais após
  normalização; compressão e tração passaram a ser explicitadas por palavras.
- ESP0321: relações escritas apenas com símbolos ficavam iguais no normalizador;
  a ordem dos três casos foi escrita por extenso.
- O primeiro teste novo de IDs comparou arrays de contextos JavaScript distintos.
  Foi corrigido com `Array.from`, sem mudar o banco ou enfraquecer a comparação.
- A mensagem de sucesso do teste de navegador ainda dizia 500, apesar de já
  verificar 600; o texto foi atualizado.

A validação parcial passa. A integral **reprova corretamente 600/700**, com
metas 700/100PORT/100ING/500ESP e matriz final preservadas. Nenhum limiar ou
critério do validador foi relaxado para aprovar um acumulado incompleto.

## Auditoria 2 — técnica/editorial/normativa: APROVADA NA REVISÃO AUTORAL

Foram revisados individualmente 100 enunciados,500 alternativas,100 gabaritos e
100 explicações. O arquivo de conteúdo registra justificativas separadas por
alternativa na ordem final, operação e fundamento editorial da dificuldade.
Não equivale à futura auditoria humana independente do usuário.

**65 segundas resoluções quantitativas/discretas passaram**, selecionando uma
única alternativa do banco real em cada verificação. O script separado da autoria
usa, entre outros, enumeração de estados, balanços, programação de tarefas,
propagação de unidades e reconstrução temporal. Também foram executadas novamente
as 104 verificações históricas:169 verificações aprovadas no conjunto.

Escopos recalculados: atrito, alcance, polígono de apoio, impulso com rebote,
compressão/flexão, torque, corrosão/calendário, histerese, dilatação/reação,
engrenagens, jato reverso, acúmulo térmico, ultrassom, isolamento cilíndrico,
circuito de falta; alocação autorizada e formação por disponibilidade; orçamento
médico; pressão parcial, capacidade analítica, recuperação, intensidade sonora,
filtração com fuga, vazão padrão, transientes, contribuição por tarefa,
incerteza/resolução/covariância, média móvel, diluição, amostragem estratificada;
probabilidades por modo, decisão lexicográfica, mecanismos competitivos,
missão, tentativa tardia, informação imperfeita, cortes sobrepostos, estados
absorventes, ambiente compartilhado, cauda e sensibilidade; compromissos,
estoque, caminho crítico, metas locais, episódios, relógios, taxas pendentes,
diferenças em diferenças, bateria, prazos de missão, janelas de detecção,
balanços acoplados, ajustes bidimensionais, apontamento, métodos clínicos e
reciclagem. Resultados, hipóteses e unidades constam do arquivo de cálculos.

O primeiro verificador de 0316 procurava a frase “não atende”, enquanto o item
correto diz “não é atendido”. A conta já retornava 150MPa/30kN; foi corrigido o
reconhecimento textual, não o gabarito. Não foi encontrado erro aritmético final.
Em 0393, foi identificada ambiguidade entre janela fixa e móvel. O enunciado
passou a dizer explicitamente “qualquer janela móvel”, condição usada pela
resolução independente e pelas cinco alternativas.
Foram encurtadas respostas que se destacavam pela extensão (0307,0313,0332,
0335,0342,0347,0381,0386); a solução completa permanece na explicação.

### Fundamentação normativa e limites

Os 20 itens de Legislação possuem fontes por item, fichas identificadas e SHA256
dos arquivos consultados. Foram usados os dois corpus locais e o edital para
S-2230. A vigência da NR10 e as edições ISO do edital permanecem as da base;
nenhuma cláusula ISO foi criada ou reproduzida.

As quatro tentativas em representações oficiais do MTE, incluindo índice
alternativo, retornaram **403 no túnel do ambiente**. Os endereços e erros reais
estão em `-fontes.json`. Não houve contorno do bloqueio, consulta oficial
bem-sucedida nova, download de texto integral ou acesso licenciado ISO.
O fallback foi exclusivamente o corpus auditado autorizado.

Aprofundamento possível: interfaces de inventário/plano/PCMSO; CA e seleção
participativa; autorizações por atividade; formação antes do serviço; limites da
evidência por fase de máquina; identidade de equipamento; prevenção versus
conclusão jurídica; medidas ergonômicas conjuntas; construção, espaços confinados
e máquina no cronograma; evidências de capacitação; distinção de fatos eSocial.

**Limitação efetiva:** o corpus não sustenta cobrança fina de itens, periodicidades,
limites ou procedimentos completos de várias NRs, inclusive NR13/15/18/23/33.
Esses detalhes não foram inventados. Parte dos exercícios normativos concentra-se
em aplicação documental, interfaces e restrições internas expressamente dadas,
em vez de aprofundamento integral de todas as NRs desejadas. Dados internos,
modelos físicos e índices dos enunciados não são apresentados como limites legais.

## Auditoria 3 — global/regressão: APROVADA EDITORIALMENTE COM LIMITES

Triagem lexical com números neutralizados e contexto comum excluído:

- Novas × novas:4.950 pares.
- Novas × anteriores:50.000 pares.
- Anteriores × anteriores:124.750 pares.
- **Total 179.700; nenhum alerta no limiar existente**, que não foi alterado.

Isso não prova ausência absoluta de duplicidade semântica. A análise editorial
complementar considerou cenário, operação, dados e papel dos distratores;
cada item tem contraste dirigido registrado com IDs do inventário dos 500.
Não se alegam embeddings ou 54.950 pareceres humanos independentes.

Foram substituídos integralmente **23 rascunhos** antes da gravação final, sem
modificar antigos:0329–0336,0338–0342,0343,0352,0365,0366,0368,0371,0381,
0386,0397 e 0398 (lista exata com motivos em `-substituicoes.json`). Exemplos:
Bayes repetido virou competição entre mecanismos; cobertura de conjuntos virou
propagação de estados; levantamento de taxas padronizadas virou diferenças em
diferenças; reação em dois apoios virou comparação de apontamento. Outros
rascunhos normativos foram refeitos para evitar simples repetição de escopo,
vigência ou modalidade. Não se encontraram duplicatas literais finais.

O par novo de maior escore lexical,0348/0357, foi reexaminado:0348 tem um filtro
com desvio paralelo;0357 acrescenta estágio obrigatório antes da divisão, que
altera ambas as rotas e sua composição. A estrutura física e o raciocínio adicional
ficam explícitos. Conceitos do programa podem reaparecer em exercícios diferentes;
a calibração de originalidade e dificuldade ainda merece a revisão independente.

### Testes executados

- Suíte Node: **93/93**, sem falha, skip ou teste pendente.
- Seis scripts de cálculos:169/169 verificações aprovadas (65 novas).
- Validação parcial:600 íntegras; integral:reprovação esperada 600/700.
- Similaridade:179.700 pares, sem alertas finais no limiar.
- Motores históricos dos Lotes 3/4/5 e novo Lote 6:aprovados.
- `transpetro-bank-ui.cjs`:aprovado com 600 JSONs reais, completa 10/10/50,
  específico 50, PROVA/TREINO, respostas, mapa, marcações, explicações, correção,
  resultado, histórico, timer 270min/aviso 15min e celular 390px.
- Contexto no navegador:caderno de grupos antigos PORT e novos ESP0315/0316,
  0383/0384, com ordem e explicação preservadas.
- `transpetro-ui.cjs`:aprovado, cenários de cortes/notas zero, banco vazio ou
  insuficiente, modos e formatos; usa exclusivamente fixtures de teste em memória.
- `multiconcurso.cjs`:aprovado,oito combinações ALERO (dois cargos×dois formatos×
  dois modos), feedback, navegação, grupos, resultado, migração/histórico,
  troca de concurso/cargo, isolamento de armazenamento, limpeza, timer e celular.
- `node --check app.js` e `git diff --check`:aprovados.

Os testes históricos do Lote 5 foram fixados no snapshot de 500 e em `--lote5`,
seguindo o padrão já adotado para lotes anteriores. Asserções do acumulado atual
foram atualizadas para 600. Não se removeram verificações históricas.

### Capacidade prática

O motor real confirmou **oito provas completas inteiramente inéditas** em cada
uma de dez sementes:80PORT/80ING/400ESP usados nas primeiras oito, sem repetir
IDs e sem separar ou inverter grupos. A nona usa 10PORT/10ING ainda inéditas e
renova ESP, que já esgotou 400; suas 50ESP repetidas não são chamadas de inéditas.
A contagem usa o histórico global da execução, não só o ciclo que se reinicia.
Os grupos novos não reduziram a capacidade teórica de 400/50=8 neste teste real.

## Arquivos da entrega

- `MULTICONCURSO.md`
- `data/transpetro/eng_seguranca/acidentes.json`
- `data/transpetro/eng_seguranca/desenvolvimento_sustentavel.json`
- `data/transpetro/eng_seguranca/emergencias.json`
- `data/transpetro/eng_seguranca/ergonomia.json`
- `data/transpetro/eng_seguranca/gerenciamento_riscos.json`
- `data/transpetro/eng_seguranca/gestao_sms.json`
- `data/transpetro/eng_seguranca/higiene_ocupacional.json`
- `data/transpetro/eng_seguranca/incendio.json`
- `data/transpetro/eng_seguranca/legislacao_nr.json`
- `data/transpetro/eng_seguranca/prevencao_riscos.json`
- `data/transpetro/eng_seguranca/saude_ocupacional.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-motor.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-similaridade.json`
- `docs/auditorias/transpetro-etapa-1-lote-6-substituicoes.json`
- `docs/transpetro-etapa-1-lote-6-relatorio.md`
- `docs/transpetro-etapa-1-plano.json`
- `scripts/audit-transpetro-lote6-calculations.cjs`
- `scripts/audit-transpetro-lote6-engine.cjs`
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro-lote4.cjs`
- `tests/transpetro-lote5.cjs`
- `tests/transpetro-lote6.cjs`
- `tests/transpetro.cjs`

## Entrega e revisão

Commit de conteúdo e auditorias: `87134b3`, publicado na branch remota.
A tentativa real de `gh pr create` falhou com
`Post "https://api.github.com/graphql": Forbidden` (HTTP403).
A PR **não foi criada** pelo ambiente. Link de abertura manual:
https://github.com/maxsonrocha/Simulado-Ale-ro/pull/new/feature/transpetro-banco-questoes-etapa-1-lote-6

Nenhum merge foi executado. O Lote7 não foi iniciado. A aprovação acima descreve a revisão autoral e as evidências executadas;
a auditoria independente técnica/editorial do usuário permanece necessária antes
da integração. O site em main não recebe estes 100 itens até o merge autorizado.
