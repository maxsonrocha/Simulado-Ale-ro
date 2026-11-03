# Transpetro 2026 — Etapa 1, Lote 5

Branch: `feature/transpetro-banco-questoes-etapa-1-lote-5`.
Base: `9c7d51d`, merge da **PR #7** confirmado no histórico da main atualizada.
Commit de entrega: o commit que contém este relatório; hash informado na entrega/PR.
**Exatamente 100 novas questões: banco 400 → 500. Aguardar auditoria independente antes de integrar.**

## Distribuição e preservação

| Área | Antes | Novas | Acumulado | Média / alta / muito alta no lote |
| --- | ---: | ---: | ---: | --- |
| Português | 80 | 20 | 100 | 4 / 9 / 7 |
| Inglês | 80 | 20 | 100 | 4 / 9 / 7 |
| Específicos | 240 | 60 | 300 | 12 / 27 / 21 |
| Total | 400 | 100 | 500 | 20 / 45 / 35 |

Acumulado: **100 médias, 225 altas, 175 muito altas**.
Gabaritos: 20 A/B/C/D/E no lote e 100 de cada letra no acumulado. Em cada língua,
4 de cada letra; ESP, 12 de cada. A permutação de opções e pareceres manteve a
resposta conceitual correta, sem modificar itens antigos.

| Arquivo/assunto | Antes | Novas | Acumulado | Meta ESP |
| --- | ---: | ---: | ---: | ---: |
| acidentes.json | 20 | 3 | 23 | 40 |
| desenvolvimento_sustentavel.json | 6 | 1 | 7 | 10 |
| emergencias.json | 17 | 2 | 19 | 30 |
| ergonomia.json | 12 | 1 | 13 | 20 |
| gerenciamento_riscos.json | 26 | 9 | 35 | 60 |
| gestao_sms.json | 21 | 6 | 27 | 40 |
| higiene_ocupacional.json | 35 | 11 | 46 | 80 |
| incendio.json | 13 | 2 | 15 | 24 |
| ingles.json | 80 | 20 | 100 | — |
| legislacao_nr.json | 44 | 10 | 54 | 90 |
| portugues.json | 80 | 20 | 100 | — |
| prevencao_riscos.json | 34 | 14 | 48 | 90 |
| saude_ocupacional.json | 12 | 1 | 13 | 16 |

A distribuição foi decidida pelos déficits: Prevenção faltava 56, Legislação 46,
Higiene 45, Gerenciamento 34, SMS 19 e Acidentes 20, além dos demais eixos.
Prevenção recebe 14, Legislação 10, Higiene 11, Gerenciamento 9 e SMS 6; os dez
restantes mantêm cobertura em Acidentes, Emergências, Incêndio, Ergonomia, Saúde
e Sustentabilidade. A escolha inicial de 12 normativas foi reduzida para 10
para não repetir exercícios ou extrapolar fichas; um item foi para Gerenciamento
e outro para SMS. A matriz final de 500 ESP não foi alterada.

**PORT/ING alcançam suas metas de 100 cada. Restam exclusivamente 200 ESP para
700.** Próximos lotes precisam respeitar esses saldos, em vez de acrescentar
automaticamente 20/20/60 novamente. Este trabalho não inicia o Lote 6.

Novos IDs: `TP26-ENGSEG-PORT-0081..0100`, `ING-0081..0100`, `ESP-0241..0300`.
Grupos novos: 20, sufixos 041..050 em cada língua, duas questões por texto.
Novas vinculadas: 40; independentes: 60. Acumulado: 100 grupos, 200 vinculadas,
300 independentes. Contexto na primeira questão e ordenação por `groupId`/posição
original preservados, sem mecanismo paralelo ou corte de grupo.

Os **400 anteriores permanecem integralmente iguais e na mesma ordem**: sem
renumeração, novos metadados ou correção silenciosa. Snapshots Git e hashes
verificam a preservação; arquivos históricos de auditoria e corpus são comparados
byte a byte. Não foi encontrado defeito grave que exigisse mexer nos antigos.
`app.js`, `index.html`, `styles.css` e bancos ALERO permanecem intactos.

## Auditoria 1 — estrutural: APROVADA

Evidências: `auditorias/transpetro-etapa-1-lote-5-estrutura.json` e `...-previa.json`.
Verificados 500 objetos, JSON, identidade concurso/cargo, área/assunto por arquivo,
subassunto, dificuldade, IDs globais/ALERO, cinco alternativas distintas e não
vazias, índice de answer, explicação, grupos contíguos/ordenados e quotas dos
cinco lotes. Os pareceres estão vinculados por hash aos dados atuais.

**Achado corrigido:** no parecer de ESP-0295, duas justificativas de distrator
(Falta4/Falta2) eram curtas demais para o requisito editorial do validador.
Foram explicitadas como zonas não cobertas. Não era erro de gabarito ou do
conjunto de cobertura, e o requisito não foi enfraquecido. Revalidação aprovada.

O validador integral continua reprovando corretamente **500/700**; não se mudou
a meta ou se chamou aprovação parcial de conclusão da Etapa 1.

## Auditoria 2 — editorial e técnica: APROVADA EDITORIALMENTE

`...-conteudo.json` registra 100 pareceres individuais, com análise das **500
alternativas**, gabaritos, explicações, operações e dificuldades. A revisão foi
integral pelo assistente, não amostragem nem parecer de três especialistas humanos.
A dificuldade é editorial, sem calibração psicométrica independente.

Plano, matriz, relatórios e auditorias dos quatro lotes e a base normativa foram
consultados, incluindo ambos os corpus e o edital. `...-fontes.json` identifica
os **10 itens normativos**, arquivos, fichas e hashes, com proposições de NR-01,
05, 06, 07, 17, 35 e início de vigência da nova NR-10, cruzadas com NR-09 e a
trava de edição técnica do edital. Não se substitui ISO 14001:2015 por 2026.

**Limite real de profundidade:** não se criaram novos requisitos finos de NR-12,
13, 18, 20 ou 33 ausentes do corpus. Os casos de máquinas, pressão, materiais e
processos aprofundam engenharia com hipóteses explícitas, sem atribuir suas
fórmulas e valores a exigências dessas normas. Isso não é alegação de ampliação
normativa detalhada de todas as NRs sugeridas. PET, funções, resgate, prazos,
limites de exposição e dimensionamentos não verificados não foram inventados.

Quatro consultas oficiais, incluindo representação alternativa do índice MTE,
foram recusadas pelo **proxy** com 403 antes da leitura do conteúdo. Não se alega
acesso externo bem-sucedido ou indisponibilidade dos sites em si. Usou-se o corpus
auditado autorizado, dentro de suas proposições, sem completá-las por memória.

`...-calculos.json`: **23 segundas resoluções**, 19 numéricas e quatro discretas/
geometria informacional/direção. Conferem modelos de gás, NPSH, ressonância,
localização acústica, tensões/espessura, fadiga, vibração, correlação amostral,
respostas cruzadas, calibração logarítmica, fase temporal, disponibilidade,
diagnóstico sequencial, votação, valor da informação, kappa, multicritério,
recorrência, trajetória, cobertura de bases, pressão entre salas, códigos e estoque.

Métodos independentes incluem bisseção, enumeração de estados/carteiras/coberturas,
simulação de fases, marginais de tabelas e checagem de equações. As cinco opções
foram enfrentadas em cada caso, com unidade, arredondamento e hipóteses. Os
**81 recálculos históricos** (30 + 26 + 8 + 17) também passaram.

**Correção no controle de recálculo:** ESP-0272 tinha resultado efetivo 16, mas a
opção também mencionava as 40 leituras originais. O comparador esperava só um
número e rejeitou a opção correta. Passou a conferir os dois números e seus papéis;
o valor matemático/gabarito não foi alterado para fazer o teste passar.

Outros ajustes: o distrator do índice de vibração passou a 5,5 (a soma simples
real de 1,5 e 4); foram trocados distratores caricatos de flambagem e taxa de dose;
a frase de PORT-0087 passou a explicitar quem preenchia o molde e o suporte em
que os dados eram registrados, evitando ambiguidade de sujeito/referência.
Reexecutados hashes e verificações após mudanças. Respostas longas foram encurtadas
sem apagar condições essenciais; justificativas detalhadas ficaram na explicação.

Correta maior que a mediana dos distratores: PORT 10/20; ING 12/20; ESP 22/60. É indicador de triagem, não prova de ausência de pistas.

## Auditoria 3 — global: APROVADA EDITORIALMENTE COM LIMITES

`...-similaridade.json`: **124.750 pares**, sendo 4.950 novas × novas,
40.000 novas × 400 anteriores e 79.800 antigas × antigas. Trigramas normalizados,
números neutralizados e contexto compartilhado legítimo separado. Nenhuma
duplicata canônica final ou par final acima dos limiares. Essa triagem é lexical,
não prova automática de originalidade semântica.

`...-semantica.json`: inventário dos 400 anteriores, 100 registros de operação,
cenário, condições e confrontos editoriais críticos. Foram procurados isomorfismos,
soluções equivalentes e trocas superficiais de cenário/valores. Conceitos curriculares
podem reaparecer em problemas distintos; não se alegam 44.950 pareceres humanos
nem embeddings independentes. A auditoria do usuário segue necessária.

**Sete rascunhos substituídos:**

- PORT-0084: nova troca de preposição relativa próxima de exercícios anteriores →
  sujeito, antecedente e objeto na oração relativa.
- PORT-0087/0088: atribuição de voz próxima da análise de citação antiga → registro
  de experimento, referência documental e relação temporal no subjuntivo.
- ING-0089/0090: benefício em um regime e limitação em outro próximo de texto antigo →
  contrafactual passado, entrega por rota alternativa e inversão condicional.
- ESP-0267: proteção auditiva versus comunicação próximo de conflito informacional →
  temperatura do ar versus troca radiativa.
- ESP-0287: entrega de tarefa versus aceitação operacional próximo de status de
  reparo/liberação → concordância entre avaliadores corrigida pelo acaso.

Nenhum antigo foi substituído. Após revisões, repetiram-se estrutura, hashes,
recálculos e similaridade. Não se identificou duplicidade relevante remanescente
na revisão editorial; isso não certifica ausência semântica absoluta.

## Testes, regressões e capacidade

- `node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs`:
  **86 passaram, zero falhas finais**.
- Validação parcial: 500/500. Integral: falha esperada, faltam 200 ESP.
- Recálculos: 23/23 novos e 81/81 antigos aprovados.
- `node --check app.js` e `git diff --check`: aprovados.
- Chromium `transpetro-bank-ui.cjs`: banco real 500, completo 10/10/50,
  específico 50, PROVA/TREINO, respostas, feedback, explicações, mapa, marcações,
  timer 4h30/aviso 15min, resultado, histórico, erradas/contexto dos cinco lotes,
  tela móvel: **aprovado**.
- Chromium `transpetro-ui.cjs`: critérios, áreas/assuntos, histórico, modos,
  grupos, erradas e timer com mocks somente em memória: **aprovado**.
- Chromium `multiconcurso.cjs`: oito combinações ALERO (dois cargos × modos ×
  formatos), notas comparadas à base, bancos, timer, navegação, respostas,
  mapa/marcações, grupos, erradas, histórico, migração e isolamento: **aprovado**.

**Falha inicial de ambiente registrada:** as três suítes de navegador receberam
`ERR_EMPTY_RESPONSE` antes de carregar a aplicação pelo servidor antigo (8003).
Foi iniciado novo servidor de desenvolvimento (8005), confirmados HTTP 200 e JSON
real com 100 PORT, e repetidas as três suítes com sucesso. Não se alterou aplicação
para resolver a falha de transporte e não se apresentou a tentativa inicial como
aprovada. Esse servidor de teste não é dependência de produção.

`...-motor.json`: dez sementes, sete provas por semente. O motor real compôs
**seis completas inteiramente inéditas**, sempre com grupos completos e ordenados.
300 ESP sustentam seis cotas de 50; 100 PORT/ING sustentam dez de cada. Na sétima,
ESP renova seu ciclo e repete 50 do histórico de vida, enquanto PORT/ING usam
10 inéditas cada. Não se chamaram repetidas de inéditas só porque o ciclo renovou.
O ciclo por área e o isolamento concurso/cargo foram preservados.

Os testes históricos do Lote 4 foram explicitamente vinculados ao snapshot daquele
lote, como já ocorria com os anteriores. O teste integral continua observando o
saldo atual. Isso muda apenas verificações/expectativas, não sorteio ou aplicação.

## Arquivos e limites da entrega

Modificados:

- `MULTICONCURSO.md`
- `data/transpetro/eng_seguranca/acidentes.json`
- `data/transpetro/eng_seguranca/desenvolvimento_sustentavel.json`
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
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro-lote4.cjs`
- `tests/transpetro.cjs`

Criados:

- `docs/auditorias/transpetro-etapa-1-lote-5-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-motor.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-5-similaridade.json`
- `docs/transpetro-etapa-1-lote-5-relatorio.md`
- `scripts/audit-transpetro-lote5-calculations.cjs`
- `scripts/audit-transpetro-lote5-engine.cjs`
- `tests/transpetro-lote5.cjs`

O projeto segue HTML/CSS/JS puro, sem novas dependências de produção. Interface,
regras, histórico, localStorage e motor não foram alterados. As mudanças de código
estão nos testes/scripts de auditoria. O conteúdo e a classificação devem passar
pela auditoria independente do usuário antes da integração. Sem merge e sem Lote 6.
