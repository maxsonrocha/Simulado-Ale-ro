# Simulados por concurso

Fluxo: concurso → cargo → configuração. “Trocar concurso” preserva dados salvos;
durante uma prova, pede confirmação para encerrar a tentativa sem resultado.
A aplicação continua HTML/CSS/JS puro, sem dependências em execução ou backend.
Os caminhos relativos são compatíveis com GitHub Pages; os JSONs continuam
precisando estar acessíveis como antes (não há service worker).

## Configuração e regras

`CONCURSOS`, no início de `app.js`, concentra cargos, bancos, áreas válidas,
formatos/quantidades, avaliação, resumo de resultados e cronômetro.

| Concurso | Completo | Específico | Erradas | Duração / aviso |
| --- | --- | --- | --- | --- |
| ALERO — FGV | PORT 12, RLM 6, INFO 6, LEG 8, HGR 8, ESP 40 | ESP 40 | até 80, grupos inteiros | 4h / 15min |
| Transpetro 2026 — Fundação Cesgranrio | PORT 10, ING 10, ESP 50 | ESP 50 | grupos com erradas, sem limite adicional | 4h30 / 15min |

PROVA e TREINO compartilham o mesmo sorteio e cronômetro configurado do concurso,
inclusive nos formatos parciais, seguindo o comportamento anterior.

ALERO mantém os sete JSONs e todos os caminhos originais. `evaluateAlero` preserva
os mínimos proporcionais com arredondamento para cima: 30% gerais, 40% específico
e 40% total. Sua situação continua OK/ELIMINADO.

`evaluateTranspetro` é independente: a prova completa vale 70 pontos (1 por
questão, cinco alternativas, uma correta) e exige simultaneamente ESP ≥ 25/50,
PORT + ING ≥ 10/20, PORT > 0 e ING > 0. Retorna APROVADO/REPROVADO e todos os
motivos de reprovação. Nos formatos específico/erradas, informa “NÃO APLICÁVEL
(simulado parcial)”: não inventa cortes proporcionais ou aprovação oficial.
O resumo apresenta Português, Inglês, Gerais, Específicos, total, percentual,
erros, tempo e situação. As estratégias de avaliação/resumo são configuráveis.

## Bancos e assuntos da Transpetro

Os 13 arquivos em `data/transpetro/eng_seguranca/` contêm a **Etapa 1 com
700 questões** (100 PORT, 100 ING, 500 ESP), em sete lotes de 100, para revisão independente.
Legislação/NRs possui 90 questões fundamentadas no corpus local auditado.
A matriz de 500 ESP foi fechada sem alterar os itens anteriores. Relatórios: [lote 1](docs/transpetro-etapa-1-relatorio.md),
[lote 2](docs/transpetro-etapa-1-lote-2-relatorio.md),
[lote 3](docs/transpetro-etapa-1-lote-3-relatorio.md)
[lote 4](docs/transpetro-etapa-1-lote-4-relatorio.md)
[lote 5](docs/transpetro-etapa-1-lote-5-relatorio.md)
[lote 6](docs/transpetro-etapa-1-lote-6-relatorio.md)
e [encerramento/Lote 7](docs/transpetro-etapa-1-lote-7-relatorio.md).

Arquivos:

- `portugues.json` (PORT), `ingles.json` (ING);
- ESP: `prevencao_riscos.json`, `gerenciamento_riscos.json`, `legislacao_nr.json`,
  `gestao_sms.json`, `emergencias.json`, `incendio.json`, `acidentes.json`,
  `higiene_ocupacional.json`, `saude_ocupacional.json`, `ergonomia.json`,
  `desenvolvimento_sustentavel.json`.

`ASSUNTOS_ENG_SEG` mapeia esses identificadores aos onze nomes completos dos grupos
de conhecimentos específicos. O cadastro do cargo aponta para todos os arquivos.
Não há preenchimento automático ou questões de teste nos bancos reais.
O motor, os grupos e o armazenamento permanecem os da infraestrutura anterior.

Futuras questões devem informar `id` único, `concurso: "TRANSPETRO"`,
`cargo: "ENG_SEG"`, `area`, `assunto`, `statement`, cinco strings em `options`,
`answer` inteiro de 0 a 4 e `explanation` string. O lote acrescenta `subassunto`,
`difficulty` (`media`, `alta`, `muito_alta`) e `etapa: 1`. A validação editorial
exige explicação não vazia. Os números de dificuldade da ALERO são preservados. Em ESP, `assunto` deve ser o
identificador cadastrado e corresponder ao arquivo. Em PORT/ING, é um texto
não vazio para o assunto, sem inventar um programa de tópicos nesta etapa.
O carregador aceita arrays e o envelope legado `{ "questions": [...] }`.
ALERO continua aceitando `topic` e não precisa de novos campos de identidade.

O lote já permite prova completa 10/10/50 e específico 50. Permite **dez**
provas completas inteiramente inéditas por ciclo, confirmadas no motor real
com grupos íntegros e dez sementes. A próxima geração renova os ciclos esgotados. O botão de gerar permite configurar e iniciar.
Banco vazio/insuficiente mantém a configuração visível e informa, por disciplina,
disponíveis e necessárias. Nenhuma prova vazia é iniciada, nenhum timer é
acionado e nenhum banco alheio completa a quantidade. Basta adicionar questões
válidas e suficientes aos arquivos para habilitar os sorteios, sem alterar o motor.

## Sorteio, vistas e grupos

**Diagnóstico da main anterior (`c706018`):** vistas eram acumuladas somente ao
finalizar, mas não eram consultadas pelo sorteio; não havia ciclo de não repetição.
Grupos `groupId` eram preservados na prova completa apenas em Português; o
caderno de erradas sorteava questões isoladas. Não foi presumida a existência
dessas funcionalidades: os comportamentos abaixo foram implementados nesta etapa.

O motor reutiliza `shuffle` entre blocos e `groupToBlocks`, mantendo `groupId`
e `_ord` (posição no arquivo carregado). Não foi introduzido `groupOrder`.
A ordem dos arquivos configurados resolve grupos que atravessam arquivos.
Grupos são delimitados também por área, permanecem completos, contíguos e em
ordem interna. Isso vale em PORT, ING, ESP e nas demais áreas da ALERO.

A seleção por área utiliza uma combinação de blocos de tamanho exato que maximiza
questões inéditas no ciclo, com desempate aleatório entre blocos. Isso evita a
falha de uma escolha gulosa quando existem grupos de tamanhos diferentes.
Enquanto uma combinação inteiramente inédita for possível, não há repetição.
Na cauda do banco, se não houver inéditas suficientes/compatíveis para a quantidade
exata, usa o máximo possível de inéditas e completa com vistas, sem cortar grupos.
Se nem uma combinação com vistas for possível, informa insuficiência por grupos.

A área renova seu ciclo somente quando todos os blocos aplicáveis já foram
utilizados. Grupos maiores que a quantidade do formato não são aplicáveis nesse
formato. Outros cargos, concursos e áreas não são reiniciados. O sorteio só grava
ciclo/vistas depois de obter a prova inteira; tentativas insuficientes não os
alteram. A emissão da prova já reserva as questões, mesmo se ela for abandonada.
Não há persistência de uma prova em andamento; respostas e marcações continuam
em memória, como antes.

O caderno seleciona blocos com pelo menos uma questão errada e inclui seus
companheiros para preservar contexto, podendo ficar abaixo do limite para não
cortar um grupo na ALERO. A Transpetro não recebe um limite de erradas não
especificado: usa os grupos com erros disponíveis. Companheiros corretos não são inseridos automaticamente na lista
de IDs errados; quando respondidos na revisão, todos são corrigidos normalmente.
A revisão não avança nem reinicia o ciclo normal. A tela e o relatório também
reapresentam o enunciado/imagem da questão-base nas dependentes. Isso permite
entender o contexto mesmo ao navegar diretamente pelo mapa.

## Persistência e estatísticas

Prefixo `simulado_<CONCURSO>_<CARGO>`: `_history`, `_wrong`, `_seen` e `_cycle`.
Exemplos: `simulado_ALERO_DES_cycle`, `simulado_ALERO_ARQ_history`,
`simulado_TRANSPETRO_ENG_SEG_wrong`. `_seen` é acumulado; `_cycle` controla o ciclo
corrente por área. Na primeira utilização, vistas antigas alimentam o ciclo.
Limpar histórico apaga os quatro conjuntos apenas da seleção atual.

Cada nova tentativa salva concurso, cargo, data, modo, tipo, total, acertos, erros,
pontos, percentual, tempo, situação, aprovação quando aplicável, motivos, `byArea`,
`bySubject` (área → assunto → acertos/total) e `byTopicEsp` legado.
`aggregateHistory` agrega áreas, tópicos e assuntos somente da seleção atual.
O resumo existente de tópicos específicos usa os assuntos da Transpetro;
nenhum dashboard temático adicional foi criado.

A migração anterior permanece: copia chaves `simulado_*_v1__<CARGO>` identificadas
como DES/DESENHISTA ou ARQ/ARQUITETO e usa marcadores por conjunto para não reimportar
após uma limpeza. Não apaga originais. A chave antiga `undefined`, consequência
de chaves não inicializadas antes da primeira etapa, permanece intacta: não há
identidade confiável para separá-la automaticamente.

## Testes

```sh
node --check app.js
node --test tests/transpetro.cjs
# Para os testes de navegador, servir a raiz em outro terminal:
python -m http.server 8000 --bind 127.0.0.1
node tests/multiconcurso.cjs
node tests/transpetro-ui.cjs
```

Os testes de lógica usam somente módulos nativos do Node. Playwright é ferramenta
externa de desenvolvimento para os testes de navegador, não dependência do site.
Os scripts aceitam `CHROMIUM_PATH` (padrão `/usr/bin/chromium`) e `SIMULADO_URL`.
Executam em contextos isolados; mocks são exclusivos da memória dos testes e das
requisições interceptadas no navegador. Nenhum mock vai para os JSONs reais.

Cobertura: configuração, cortes e notas zero, múltiplos motivos, bancos vazios e
insuficientes, validação retrocompatível, isolamento, ciclo/renovação, grupos e
contexto, estatísticas/histórico, ambos os cargos ALERO e modos/formatos,
mapa/navegação/marcação, feedback, erradas e timers. A pontuação da ALERO é
comparada com a implementação original do commit `74e41d2`; o sorteio não é mais
comparado questão a questão, pois agora considera as vistas e todos os grupos.

## Validação do banco — Etapa 1 com 700 itens

```sh
node scripts/validate-transpetro.cjs
node scripts/audit-transpetro-calculations.cjs
node scripts/audit-transpetro-lote2-calculations.cjs
node scripts/audit-transpetro-lote3-calculations.cjs
node scripts/audit-transpetro-lote3-engine.cjs
node scripts/audit-transpetro-lote4-calculations.cjs
node scripts/audit-transpetro-lote4-engine.cjs
node scripts/audit-transpetro-lote5-calculations.cjs
node scripts/audit-transpetro-lote6-calculations.cjs
node scripts/audit-transpetro-lote7-calculations.cjs
node scripts/audit-transpetro-lote5-engine.cjs
node scripts/audit-transpetro-lote6-engine.cjs
node scripts/audit-transpetro-lote7-engine.cjs
node scripts/audit-transpetro-similarity.cjs
node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs tests/transpetro-lote6.cjs tests/transpetro-lote7.cjs
# Com o servidor local e Playwright disponível:
node tests/transpetro-bank-ui.cjs
```

`node scripts/validate-transpetro.cjs` aprova as 700 questões e a matriz completa;
continua reprovando bases incompletas, inclusive o snapshot de 600 dos testes.
A opção parcial não altera a meta: exige as quantidades acumuladas declaradas
no plano, quotas de cada lote, proporções de dificuldade e pareceres individuais.
Os pareceres antigos não são reescritos; `auditoriasConteudo` lista os sete arquivos.
`--structure-only` isola a primeira rodada estrutural, sem substituir a revisão
de conteúdo exigida por padrão.

Os arquivos em `docs/auditorias/` registram estrutura, cálculos, triagem lexical e
parecer sobre as cinco alternativas de cada item. O hash de cada questão impede
reutilizar um parecer após mudar seu conteúdo. Esses controles não constituem
prova automática de unicidade semântica nem calibração psicométrica: a revisão
editorial e a revisão humana de domínio continuam distintas dos testes.

O corpus em `references/transpetro/corpus/` é o fallback normativo autorizado.
Cada questão normativa nova aponta para o arquivo usado; as auditorias dos lotes 3/4/5/6/7
identificam as fichas e hashes. Fichas de escopo não autorizam completar limites,
prazos ou requisitos ausentes por memória. As edições ISO/ABNT seguem o edital.

PORT/ING atingiram suas metas de 100 itens no Lote 5; os Lotes 6 e 7 adicionaram
somente ESP. A Etapa 1 não possui saldo pendente de questões. A revisão humana
independente e o merge autorizado são etapas de integração. A Etapa 2 não foi iniciada.
