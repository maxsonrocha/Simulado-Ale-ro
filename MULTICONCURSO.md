# Simulados por concurso

A página inicia em concurso → cargo → configuração. O botão “Trocar concurso”
permite voltar sem recarregar. Durante uma prova, informa que o resultado em
andamento será descartado. Os resultados já salvos permanecem no navegador.

## Configuração

`CONCURSOS`, no início de `app.js`, concentra nomes, banca, cargos, caminhos
relativos dos bancos, áreas, formatos/quantidades, regras, função de avaliação,
limite e aviso do cronômetro. Os cards, cabeçalho, título, tipos de simulado e
regras da configuração usam esse cadastro.

ALERO mantém os sete JSON em seus caminhos originais. Cada cargo carrega seu
específico e os cinco bancos gerais. As quantidades continuam PORT 12, RLM 6,
INFO 6, LEG 8, HGR 8 e ESP 40; o específico tem 40 e o caderno limita a 80.
O algoritmo de sorteio e a preservação dos grupos de Português continuam iguais.
As vistas continuam sendo registradas na finalização e não excluem questões dos
sorteios, como na versão anterior.

`computeScore` contabiliza respostas e delega a aprovação a `avaliar`.
`evaluateAlero` preserva os mínimos proporcionais, arredondados para cima:
30% gerais, 40% específico e 40% total. Os dois modos continuam com quatro horas,
aviso aos quinze minutos finais e finalização automática. O aviso agora é
reiniciado a cada simulado.

Transpetro possui apenas nome, banca e cargo. Banco, avaliação e tempo estão
pendentes; não são herdados da ALERO. A configuração mostra “Banco de questões
da Transpetro em preparação.” e desabilita gerar simulado. Não há JSON fictício.
Para habilitar futuramente, fornecer bancos oficiais (por exemplo em
`data/transpetro/`), áreas, formatos/quantidades, regras, função de avaliação e
tempo. Se os módulos/regras oficiais diferirem dos da ALERO, adaptar também a
apresentação do resumo de aprovação; o componente atual apresenta dois módulos.
O formato atual das questões utiliza cinco alternativas e gabarito de 0 a 4.

## Armazenamento e migração

Chaves: `simulado_<CONCURSO>_<CARGO>_history`, `_wrong` e `_seen`.
Exemplos: `simulado_ALERO_DES_history`, `simulado_ALERO_ARQ_wrong`,
`simulado_TRANSPETRO_ENG_SEG_seen`. Histórico e estatísticas consultam apenas a
seleção atual. Cada novo resultado registra concurso, cargo, data, total,
acertos, percentual, tempo e detalhamento. Limpar histórico remove histórico,
erradas e vistas somente da seleção atual.

A migração copia, sem apagar as originais, as chaves antigas
`simulado_history_v1__<CARGO>`, `simulado_wrong_ids_v1__<CARGO>` e
`simulado_seen_ids_v1__<CARGO>`, aceitando DES/DESENHISTA e ARQ/ARQUITETO.
Usa um marcador `<nova-chave>_migrated_v1` por conjunto para não reimportar dados
depois de uma limpeza. Não mistura cargos nem atribui dados sem identificação.

**Limitação do legado:** a versão anterior declarava `role` duas vezes e nunca
chamava `setRoleStorageKeys`. Assim, podia gravar os três tipos de dados na mesma
chave literal `undefined`, sobrescrevendo conteúdo. Essa chave é preservada
intacta; não há informação suficiente para recuperar ou separar automaticamente
seu conteúdo com segurança. Chaves antigas sem cargo também permanecem intactas.

## Funções

Novas: `currentContest`, `currentRole`, `selectionLabel`, `evaluateAlero`,
`migrateLegacyStorage`, `renderChoices`, `selectContest`, `selectRole`,
`changeContest`.

Alteradas: `showView`, `computeScore`, `saveResults`, `timerStart`, `timerReset`,
`loadQuestionsBank`, `validateQuestion`, `generateExam`, `renderModulesSummary`,
`renderResult`, `setRoleStorageKeys`, `readConfig`, inicialização e eventos de
início, limpeza e repetição de erradas. Durante o carregamento, ações de troca e
inícios repetidos ficam bloqueados para evitar mudança de seleção assíncrona.

## Validação

A aplicação continua HTML/CSS/JS puro, sem dependências em execução, backend ou
etapa de build. GitHub Pages continua usando os mesmos caminhos relativos.
O comportamento offline-friendly anterior é preservado; não foi adicionado
service worker e os JSON precisam estar acessíveis como antes.

Testes de navegador em `tests/multiconcurso.cjs` usam Playwright **somente como
ferramenta de desenvolvimento**; Node/Playwright não são necessários para usar
ou publicar o simulador. Com essa ferramenta disponível externamente:

```sh
python -m http.server 8000 --bind 127.0.0.1
# Em outro terminal, na raiz do repositório:
node --check app.js
node tests/multiconcurso.cjs
```

O script usa `/usr/bin/chromium` por padrão; aceita `CHROMIUM_PATH` e
`SIMULADO_URL`. Cria um contexto de navegador isolado e não acessa os dados
pessoais do navegador do usuário. Compara sorteios e pontuação ao código
original do commit `74e41d2`, disponível no histórico Git.

Cobertura: dois cargos × dois modos × dois formatos; quantidades, IDs únicos,
grupos completos, equivalência de sorteios com sementes controladas, equivalência
de pontuação, feedback imediato, resultados, histórico, erradas e correção do
caderno; migração idempotente; limpeza sem reimportação e sem afetar outro cargo;
Transpetro bloqueada sem requisições de banco; isolamento entre concursos;
aviso, expiração e reinicialização do cronômetro; troca durante a prova;
layout inicial em 390 px; ausência de erros JavaScript e de respostas HTTP de
erro nos recursos usados. IDs HTML/JS, caminhos dos JSON e diff também revisados.
