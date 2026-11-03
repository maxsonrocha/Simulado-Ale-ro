# Transpetro 2026 — Etapa 1: lote parcial 100/700

**A ETAPA 1 NÃO ESTÁ CONCLUÍDA. FALTAM 600 QUESTÕES.**

Base inspecionada: `feature/transpetro-estrutura-prova`, commit `e9c9ef6`, ainda
não integrado à main no início deste trabalho. Nova branch:
`feature/transpetro-banco-questoes-etapa-1`. Não houve trabalho direto na main.
A inspeção cobriu HTML, CSS, app, bancos ALERO, carregador, validação, histórico,
vistas/ciclo, grupos e testes. `groupId` e a ordem dos JSONs foram reutilizados;
nenhuma parte do motor de sorteio foi substituída.

## Quantidades e cobertura

| Área | Criadas | Meta da etapa | Faltam | Média / alta / muito alta |
| --- | ---: | ---: | ---: | --- |
| Português | 20 | 100 | 80 | 4 / 9 / 7 |
| Inglês | 20 | 100 | 80 | 4 / 9 / 7 |
| Específicos | 60 | 500 | 440 | 12 / 27 / 21 |
| **Total** | **100** | **700** | **600** | **20 / 45 / 35** |

A proporção 20%/45%/35% é respeitada em **cada área deste lote**. Não se afirma
que foram atingidas as contagens finais 140/315/245 da etapa inteira.

| Assunto específico | Criadas | Meta da etapa | Faltam |
| --- | ---: | ---: | ---: |
| Prevenção e Controle de Riscos | 12 | 90 | 78 |
| Legislação e Normas Regulamentadoras | 0 | 90 | 90 |
| Higiene Ocupacional | 16 | 80 | 64 |
| Análise e Gerenciamento de Riscos | 12 | 60 | 48 |
| Gestão de SMS | 4 | 40 | 36 |
| Acidentes do Trabalho | 4 | 40 | 36 |
| Emergências | 4 | 30 | 26 |
| Proteção Contra Incêndio | 2 | 24 | 22 |
| Ergonomia | 2 | 20 | 18 |
| Saúde Ocupacional | 2 | 16 | 14 |
| Desenvolvimento Sustentável | 2 | 10 | 8 |
| **Total ESP** | **60** | **500** | **440** |

Português e Inglês usam respectivamente `compreensao_textual` e
`leitura_interpretacao`, com subassuntos individuais. Foram escritos dez textos
autorais por língua, com duas questões por texto: **20 grupos, 40 questões
vinculadas e 60 independentes**. Específicas deste lote são independentes,
com seus dados no próprio enunciado. O escopo integral de subassuntos do pedido
não está coberto: caldeiras, NRs, legislação e outros tópicos ainda precisam de
lotes próprios com fontes verificadas.

| Gabarito | PORT | ING | ESP | Total |
| --- | ---: | ---: | ---: | ---: |
| A | 4 | 4 | 12 | 20 |
| B | 4 | 4 | 12 | 20 |
| C | 4 | 4 | 12 | 20 |
| D | 4 | 4 | 12 | 20 |
| E | 4 | 4 | 12 | 20 |

IDs: `TP26-ENGSEG-PORT-0001..0020`, `TP26-ENGSEG-ING-0001..0020`,
`TP26-ENGSEG-ESP-0001..0060`. Novos lotes devem continuar sem reutilizar IDs.

## Três rodadas executadas

As rodadas têm objetivos distintos; foram feitas pelo mesmo assistente, **não
por três revisores humanos independentes**. Foram revisados os **100 itens
presentes**, não 700. Classificações de dificuldade são julgamentos editoriais
justificados por item, sem calibração psicométrica.

### 1. Estrutura — aprovada para o lote parcial

Arquivo: `auditorias/transpetro-etapa-1-estrutura.json`. Verificados campos,
tipos, IDs globais e colisão ALERO, assunto/arquivo, subassuntos, dificuldades,
alternativas, gabaritos, explicações, grupos, ordem, contagens e carregamento.

Correções/adequações: o cadastro tinha dez assuntos; foi acrescentado
Desenvolvimento Sustentável com seu arquivo. O runtime não tinha enum de
dificuldade da Transpetro; foram adicionados os três valores, sem alterar os
números da ALERO. Os testes de banco vazio passaram a usar fixtures em memória,
para não exigir que os bancos reais continuassem vazios.

A liberação integral **permanece reprovada por quantidade e cobertura**. O
comando sem `--partial` retorna código 1, como deve ocorrer com 100/700.

### 2. Conteúdo — aprovada editorialmente para os 100 itens

Arquivo: `auditorias/transpetro-etapa-1-conteudo.json`: parecer por ID, hash do
item, gabarito, exame individual das cinco alternativas e justificativa da
dificuldade. Foram resolvidas as questões e verificadas suas explicações.

`auditorias/transpetro-etapa-1-calculos.json` registra **30 resoluções numéricas
refeitas por script separado da autoria**, confrontando todas as alternativas.
Cada caso encontrou uma alternativa numérica correspondente, coincidente com o
gabarito. Questões não numéricas foram avaliadas editorialmente, não por um
suposto verificador automático de significado.

Problemas corrigidos antes de aprovar:

- ESP-0027 descrevia uma taxa em W como “calor por minuto”; a redação agora é taxa
  de armazenamento de energia térmica, consistente com a equação e as unidades.
- ESP-0044 tinha percentuais exatos incompatíveis com contagens inteiras de ações.
  O exemplo agora usa 90/100 e 40/50, com 45 e 36 verificações de eficácia;
  alternativas, explicação e parecer foram reconferidos após a mudança.
- O script de recálculo inicialmente interpretava separador de milhar como
  decimal e tinha tolerância que confundia 0,010396 com 0,010400. Corrigidos o
  parser e a tolerância; todos os 30 casos foram reexecutados, sem alterar seus
  resultados corretos para forçar aprovação.

Não se incluíram limites legais, itens de normas, artigos ou prescrições
normativas não verificados. Os parâmetros numéricos são dados dos enunciados e
não são apresentados como limites legais de exposição ou de projeto.

### 3. Qualidade global — aprovada editorialmente para o lote parcial

Arquivo: `auditorias/transpetro-etapa-1-similaridade.json`. Comparados os **4.950
pares** de questões por trigramas dos enunciados e alternativas, neutralizando
números e excluindo o contexto comum legítimo dos grupos. Nenhum par final
ultrapassou o limiar de triagem; nenhuma duplicata canônica foi encontrada.
Os maiores escores eram alternativas numéricas de mesma unidade, com problemas
distintos: soma sonora versus controle parcial, união de falhas versus causa
comum, concentração por branco versus mistura de correntes. Esses pares foram
reexaminados, sem redução a mudança de números do mesmo problema.

Correções: dois textos iniciais de Inglês se aproximavam de cenários de
Português. Foram substituídos por cenários de referência temporal/rastreabilidade
e de transferência de competência após revisão de procedimento. Foi reduzida a
pista sistemática de resposta mais longa: a correta supera a mediana dos
quatro distratores em 12/20 PORT, 9/20 ING e 30/60 ESP. A maior sequência de uma
mesma letra é de três itens. Essas métricas são triagem, não prova de qualidade
ou ausência de toda paráfrase semântica.

Após as substituições, repetiram-se estrutura, revisão dos itens afetados,
recálculos e similaridade. Os hashes do parecer correspondem aos JSONs finais.

## Fontes e limitações

Em 03/11/2026, o ambiente retornou `403 Forbidden` para os acessos ao portal
oficial de NRs do MTE e à CLT no Planalto. Nenhuma consulta bem-sucedida à versão
vigente desses textos é alegada. Por esse motivo, o banco de legislação ficou
vazio; não foi preenchido a partir de memória do modelo. Também não foram
inventados limites de exposição ou números de itens para completar as metas.

As questões são autorais e os textos não foram copiados de provas. Fundamentos
matemáticos e hipóteses de cálculo estão expressos nos casos. A revisão editorial
não substitui parecer de especialista em SST, revisão linguística humana ou
calibração empírica de dificuldade. A cobertura normativa e o conteúdo restante
continuam pendentes. **Não é uma entrega completa da Etapa 1.**

## Testes e integração

- `node --test tests/transpetro.cjs tests/transpetro-bank.cjs`: **61 passaram**.
  Incluem testes negativos de corrupção e garantia de que a liberação integral
  falhe com 100 itens, além de comparação byte a byte dos sete bancos ALERO.
- `node scripts/validate-transpetro.cjs --partial`: aprovado para 100 itens.
- `node scripts/validate-transpetro.cjs`: **reprovado intencionalmente**;
  faltam 600 e a matriz integral. Esse resultado não foi ocultado nem relaxado.
- `node scripts/audit-transpetro-calculations.cjs`: 30/30, aprovados.
- `node scripts/audit-transpetro-similarity.cjs`: 4.950 pares, sem alertas finais.
- Chromium, `tests/transpetro-bank-ui.cjs`: JSONs reais, prova 10/10/50,
  específico 50, PROVA/TREINO, respostas, explicações, mapa, marcações, contexto,
  timer de 4h30, resultado, histórico e caderno de erradas: aprovado.
- Chromium, `tests/multiconcurso.cjs`: oito combinações ALERO (dois cargos ×
  dois modos × dois formatos), navegação, correção comparada ao original,
  marcação/mapa, timer, histórico, erradas, migração, isolamento e banco vazio
  simulado em memória: aprovado.
- Chromium, `tests/transpetro-ui.cjs`: regressões de critérios, resultados e
  timer Transpetro com mocks somente na memória: aprovado.

### Não repetição

O teste executou dez gerações consecutivas com o banco real. Verificou cotas,
IDs únicos em cada prova, ordem/contiguidade dos grupos e prioridade das inéditas
sempre que suficientes. **Não foram obtidas dez provas sem repetição.**

A primeira usa 10/10/50 inéditas. Na segunda, Português e Inglês ainda têm dez
inéditas cada, mas ESP só tem dez inéditas: o motor utiliza essas dez e completa
com quarenta vistas, preservando sua regra de cauda. Quando uma área esgota, seu
ciclo é renovado independentemente. O lote garante somente **uma prova completa
inédita**; a capacidade de dez fica pendente das 700. Não se alterou o motor para
esconder essa limitação.

## Arquivos

Modificados: `app.js`, `MULTICONCURSO.md`, `tests/transpetro.cjs`,
`tests/multiconcurso.cjs` e os 11 JSONs antes vazios:
`portugues.json`, `ingles.json`, `prevencao_riscos.json`,
`gerenciamento_riscos.json`, `gestao_sms.json`, `emergencias.json`,
`incendio.json`, `acidentes.json`, `higiene_ocupacional.json`,
`saude_ocupacional.json`, `ergonomia.json`, em `data/transpetro/eng_seguranca/`.

Criados:

- `data/transpetro/eng_seguranca/desenvolvimento_sustentavel.json`;
- `scripts/lib/runtime.cjs`;
- `scripts/validate-transpetro.cjs`;
- `scripts/audit-transpetro-calculations.cjs`;
- `scripts/audit-transpetro-similarity.cjs`;
- `tests/transpetro-bank.cjs`;
- `tests/transpetro-bank-ui.cjs`;
- `docs/transpetro-etapa-1-plano.json`;
- `docs/transpetro-etapa-1-relatorio.md`;
- `docs/auditorias/transpetro-etapa-1-estrutura.json`;
- `docs/auditorias/transpetro-etapa-1-conteudo.json`;
- `docs/auditorias/transpetro-etapa-1-calculos.json`;
- `docs/auditorias/transpetro-etapa-1-similaridade.json`.

`legislacao_nr.json` permanece `[]`. HTML, CSS e os sete JSONs ALERO não foram
alterados. Os scripts de autoria temporários não integram o site nem geram
questões em execução. O simulador continua estático, sem build ou dependências
em produção. Nenhuma questão das Etapas 2 e 3 foi criada.
