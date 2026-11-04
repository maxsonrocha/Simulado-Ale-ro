# Transpetro 2026 — Encerramento da autoria da Etapa 1 / Lote 7

Branch: `feature/transpetro-banco-questoes-etapa-1-lote-7`.
Base atualizada: `673ebc6`, merge da **PR #9**, que integrou o Lote 6.
A preparação confirmou **600 questões:100 PORT,100 ING,400 ESP**.
O commit da entrega é o que adiciona este relatório, consultável no histórico da branch.

## 1. Fechamento exato

**+100 ESP**, IDs `TP26-ENGSEG-ESP-0401` até `TP26-ENGSEG-ESP-0500`.
Nenhuma questão de Português ou Inglês adicionada ou alterada.
Resultado na branch: **700 =100 PORT +100 ING +500 ESP**.

Os déficits foram calculados a partir dos objetos existentes, não de uma distribuição
arbitrária. Todos eram não negativos e somavam 100; todos foram atendidos.
O arquivo `-previa.json` registra base, contagens e hashes anteriores.

| Arquivo/assunto | Antes | Lote 7 | Final | Meta | Saldo |
|---|---:|---:|---:|---:|---:|
| `acidentes.json` | 29 | 11 | 40 | 40 | 0 |
| `desenvolvimento_sustentavel.json` | 8 | 2 | 10 | 10 | 0 |
| `emergencias.json` | 23 | 7 | 30 | 30 | 0 |
| `ergonomia.json` | 16 | 4 | 20 | 20 | 0 |
| `gerenciamento_riscos.json` | 50 | 10 | 60 | 60 | 0 |
| `gestao_sms.json` | 34 | 6 | 40 | 40 | 0 |
| `higiene_ocupacional.json` | 63 | 17 | 80 | 80 | 0 |
| `incendio.json` | 18 | 6 | 24 | 24 | 0 |
| `ingles.json` | 100 | 0 | 100 | 100 | 0 |
| `legislacao_nr.json` | 74 | 16 | 90 | 90 | 0 |
| `portugues.json` | 100 | 0 | 100 | 100 | 0 |
| `prevencao_riscos.json` | 70 | 20 | 90 | 90 | 0 |
| `saude_ocupacional.json` | 15 | 1 | 16 | 16 | 0 |

| Dificuldade | Lote 7 | ESP final | Global final |
|---|---:|---:|---:|
| media |20|100|140|
| alta |45|225|315|
| muito_alta |35|175|245|

PORT e ING conservam, cada um,20 médias/45 altas/35 muito altas.
Gabaritos do Lote 7: **20A/20B/20C/20D/20E**.
Global: **140 de cada letra**; ESP:100 de cada; cada língua:20 de cada.
A distribuição foi obtida permutando alternativas e seus pareceres juntos,
sem tornar falsa uma resposta para ajustar a estatística.

Novo grupo `TP26-ESP-003`:0419/0420, expansão do acumulador e trabalho líquido.
São duas vinculadas e 98 independentes novas. Banco final: **103 grupos,
206 vinculadas e 494 independentes**. Mantém `groupId` e ordem de arquivo;
não se introduziu mecanismo paralelo de ordenação.

## 2. Preservação e escopo

Os 600 objetos anteriores, sua ordem e todos os metadados foram comparados com
`673ebc6`. Nenhuma questão anterior foi corrigida, renumerada ou substituída.
PORT/ING, bancos ALERO, `app.js`, `index.html`, `styles.css`, corpus e auditorias
anteriores permanecem idênticos à base nos testes de preservação.
Não houve alteração do motor, armazenamento, interface ou critérios de aprovação.

O plano registra 700 e a matriz final, mantendo metas e quotas de todos os lotes.
Seu estado `completa_em_revisao` identifica o fechamento da autoria aguardando
revisão independente e integração; não publica nada na main automaticamente.

## 3. Auditoria 1 — estrutural: APROVADA INTEGRAL

O validador original, **sem enfraquecimento**, aprova 700 em modo integral e sem
avisos: sintaxe, tipos, IDs globais inclusive contra ALERO, identidade concurso/cargo,
áreas, assunto/arquivo, subassuntos, dificuldades, cinco alternativas distintas,
answer, explicação, fontes, proporções, matriz e grupos/contexto/ordem.
Os sete pareceres somam 700 registros de conteúdo com hashes do objeto correspondente.

O snapshot anterior de 600 **continua reprovando** no mesmo validador integral.
Os testes históricos dos lotes foram fixados nos próprios snapshots; suas cotas
antigas não foram alteradas para fingir que já tinham 700. O teste do acumulado
atual passou de 600 para 700, com nova asserção negativa sobre a base incompleta.

Não houve erro estrutural final. Os primeiros 100 testes de lógica executados
passaram; novas correções editoriais tiveram hashes e validações regenerados,
com 100/100 aprovados na versão final.

## 4. Auditoria 2 — conteúdo/técnica/normativa: APROVADA NA REVISÃO AUTORAL

Foram revistos **100 enunciados,500 alternativas,100 gabaritos e 100 explicações**.
O parecer por item apresenta as cinco justificativas na ordem final, operação,
dificuldade e SHA256. Trata-se de revisão do assistente autor, não de especialista
humano independente ou certificação da banca.

### Resoluções independentes

**51 verificações quantitativas/discretas novas aprovadas**, com uma única
alternativa correspondente em cada caso. O código de conferência foi escrito
separadamente do rascunho de autoria e lê o banco real. Há enumerações de estados,
balanços, somas por faixas, reconstrução de unidades e busca numérica, além de
resoluções algébricas. Os 169 casos históricos também passaram: **220 no conjunto**.

Exemplos: esforço de vento 960N; hidrostática 22,5kN; lastro submerso 4/3m³;
expansão do acumulador 50kPa manométricos/1L e trabalho líquido 107,9J;
custeio marginal 243 procedimentos:R$20.000 sem ônus aos empregados;
combustão com O2 limitante:82/3≈27,33mol finais; ramais acoplados 5,55/2,77;
balanços de água/sal:purga 1m³/h e reposição 5m³/h.

Todos os resultados pertencem aos modelos/hipóteses dados; não são limites
legais, projetos completos, laudos de exposição ou prescrições operacionais.
Os 51 IDs, métodos, valores e identificação da alternativa estão em `-calculos.json`.

### Erros e ambiguidades encontrados e corrigidos

1. **0415:** a redação afirmava vaporização positiva embora o modelo de volumes
   fixos só admitisse vapor zero; passou a apresentar a tentativa de modelagem
   cuja consistência deve ser examinada, sem afirmar o resultado impossível.
2. **0416:** um distrator comparava 160 como superior a 170; corrigido para uma
   comparação coerente, mantendo o erro de superposição como seu problema.
3. **0449:** comparar quantidade por volume em temperaturas diferentes exigiria
   explicitar base adicional. A pergunta passou a pedir a redução da **pressão
   parcial**, que é determinada pelos dados, mantendo o resultado 44,44%.
4. **0471:** mortes/acidentes foi precisado como **razão**, não proporção de
   acidentes fatais ou letalidade por pessoa; várias mortes podem ocorrer no
   mesmo acidente. O gabarito não passou a inferir incidência por trabalhador.
5. **0482:** “volume útil” poderia sugerir obstáculos já descontados. Foi
   explicitado **volume geométrico**, antes de descontar ocupação e chuva.
6. **0492:** a primeira alternativa dizia 30mol, embora a própria resolução
   fornecesse 82/3; corrigida para 27,33mol e conferida por balanço independente.

Treze respostas foram encurtadas para não se destacarem pela extensão
(0405,0424,0427,0435,0436,0451,0459,0463,0469,0475,0480,0487,0498).
Seis distratores fracos foram reformulados (0412,0437,0445,0464,0496,0499).
Na triagem final, nenhuma correta supera 1,6vez a mediana de extensão dos quatro
distratores; é heurística editorial, não prova de ausência de pistas.

### Fontes e limites normativos

Os 16 itens de Legislação possuem fonte por questão, ficha identificada e hash
do arquivo consultado. Foram usados os dois corpus locais e o edital. As edições
expressamente cobradas continuam 45001:2018/14001:2015/19011:2018; não houve
acesso licenciado novo nem criação de cláusula ISO/ABNT.

As três novas consultas oficiais (texto NR33, legislação previdenciária e índice
alternativo MTE) retornaram 403 no túnel do ambiente. Endereços e erros estão
em `-fontes.json`. Não foi alegada consulta oficial bem-sucedida nem houve
contorno do bloqueio. O corpus auditado de 03/11/2026 foi o fallback autorizado.

Não se inventaram artigos, prazos, limites, tabelas de dimensionamento ou obrigações
finas ausentes. A cobertura normativa nova é de aplicação das proposições disponíveis:
origem/unidade dos dados de SESMT, registro de atividades/EPI, finalidade e custeio
do PCMSO, evidência de levantamento e dispensa, autorização/PT, relações
inventário/plano, comunicação/CAT/benefício, assinatura eletrônica e edição do edital.

**Limite real:** as fichas não sustentam aprofundamento integral de todos os itens
de NR13/15/18/23/33 e de outras normas. Esses detalhes dependem de acesso oficial
ou ampliação verificada do corpus. Os modelos, preços e critérios internos de
exercícios são identificados como tais, sem transformá-los em obrigação legal.
A dificuldade é atribuição editorial, não calibração psicométrica em candidatos.

## 5. Auditoria 3 — global e regressão: APROVADA EDITORIALMENTE COM LIMITES

Foram comparados lexicalmente **244.650 pares**:

- Novas × novas:4.950.
- Novas × anteriores:60.000.
- Anteriores × anteriores:179.700.

Não houve alerta no limiar existente, que não foi alterado. O resultado não prova
originalidade semântica absoluta. A revisão editorial dirigida considerou cenário,
operação, dados, dependências e papel dos distratores. O inventário preserva 600
IDs/hashes e há 100 contrastes específicos com itens anteriores ou outros novos.
Não se alegam embeddings ou 64.950 pareceres humanos independentes.

**14 rascunhos foram substituídos integralmente** antes da versão final:
0423,0425,0431,0432,0434,0436,0451,0472,0474,0475,0477,0481,0487,0488.
O registro `-substituicoes.json` identifica os anteriores e os novos focos.

Exemplos de achados: a questão cognitiva 0423 era excessivamente próxima de 0133;
virou distinção entre empregados e equivalentes de jornada. A delegação de 0431
se aproximava de 0180; virou tarifa marginal em três faixas e custeio. Treinamento
por soma de horas, regra ordinal, material sem lesão e escolha minimax foram
substituídos por reconciliação de comunicações/decisões, testabilidade, mediana de
custos, previsão sob prevenção, atraso de notificação, admissão de ar em abrigo,
mensagens fora de ordem e termografia, conforme os registros individuais.

Não foram encontradas duplicatas literais finais. Os conceitos comuns ao programa
não foram declarados inéditos em si: o contraste examina o exercício e sua operação.
A auditoria independente deverá avaliar também esses julgamentos editoriais.
Os 600 antigos não receberam nova autoria nem correção silenciosa; sua preservação
e as evidências históricas foram mantidas durante a regressão global.

### Testes executados e resultados

- **100/100 testes Node**, sem falha, skip ou pendência.
- **220 verificações de cálculos/discretas** dos sete lotes,51 novas, aprovadas.
- Validador integral:**700/700**, matriz fechada, sem erros/avisos.
- Caso negativo:**600/700** continua falhando sem alterar a meta.
- Similaridade:244.650 pares, sem alertas lexicais finais.
- Motores históricos 3/4/5/6 e motor 7:aprovados nas respectivas capacidades.
- Navegador com **700 JSONs reais**:completa 10PORT/10ING/50ESP, específico 50,
  PROVA/TREINO, respostas, navegação, mapa, marcações, explicações, correção,
  aprovação/resultado, histórico, timer 270min, aviso 15min e celular 390px.
- Caderno no navegador:cinco grupos PORT e três ESP, incluindo 0419/0420;
  contexto/ordem/explicação preservados. O teste de lógica confirma que incluir
  a companheira correta não altera IDs errados nem avança o ciclo.
- Navegador Transpetro com fixtures:critérios mínimos, notas zero e motivos,
  vazio/insuficiência, modos/formatos, assuntos/histórico/contexto/timer:PASS.
- Navegador ALERO:**oito combinações** (dois cargos×dois modos×dois formatos),
  bancos, pontuação, navegação, feedback, grupos, resultado, histórico/migração,
  troca/isolamento/limpeza, timer e celular:PASS.
- `node --check app.js`, scripts novos e `git diff --check`:PASS.

Reprodução principal (Node nativo; navegador requer Playwright/Chromium já usados
pelo projeto e servidor local; testes de preservação requerem histórico Git):

```sh
node scripts/validate-transpetro.cjs
node scripts/audit-transpetro-lote7-calculations.cjs
node scripts/audit-transpetro-lote7-engine.cjs
node scripts/audit-transpetro-similarity.cjs
node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs tests/transpetro-lote6.cjs tests/transpetro-lote7.cjs
node tests/transpetro-bank-ui.cjs
node tests/transpetro-ui.cjs
node tests/multiconcurso.cjs
```

### Capacidade real de simulados

Com armazenamento de teste inicialmente vazio, o motor real gerou **dez completas
consecutivas inteiramente inéditas** em cada uma de dez sementes, preservando
os grupos:100PORT/100ING/500ESP. Na décima primeira, todas as áreas renovaram
os ciclos, e as 70 questões são corretamente registradas como repetidas na vida
da execução. A contagem usa conjunto de IDs global, não chama repetidas de
inéditas após reiniciar o ciclo. Grupos não reduziram a capacidade neste banco.
Isso não promete dez novas provas a um perfil que já utilizou parte das questões;
o histórico existente e seus ciclos continuam respeitados.

## 6. Parecer e pendências da próxima etapa

O fechamento **numérico, estrutural e funcional** da Etapa 1 está demonstrado.
A autoria dos sete lotes está entregue para revisão independente; a aprovação
editorial/normativa acima é autoral e limitada às fontes verificadas. Não é
homologação profissional externa nem autorização para merge automático.
Nenhum critério automático obrigatório conhecido permanece falhando.

Antes de integrar:revisão independente do usuário, com atenção à correção técnica,
originalidade dos contrastes e calibração de dificuldade. Para futura Etapa 2:
aceitar esta base, planejar novas quotas sem duplicação, ampliar/verificar fontes
quando forem necessários detalhes normativos ausentes e manter testes/históricos.
O validador permanece específico da Etapa 1 (700 e `etapa:1`); uma futura Etapa 2
precisará versionar a validação por etapa, preservando o snapshot deste encerramento.
**Nenhuma questão ou implementação da Etapa 2 foi iniciada.**

## 7. Arquivos da entrega

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
- `docs/auditorias/transpetro-etapa-1-lote-7-calculos.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-conteudo.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-estrutura.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-fontes.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-motor.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-previa.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-resumo.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-semantica.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-similaridade.json`
- `docs/auditorias/transpetro-etapa-1-lote-7-substituicoes.json`
- `docs/transpetro-etapa-1-lote-7-relatorio.md`
- `docs/transpetro-etapa-1-plano.json`
- `scripts/audit-transpetro-lote7-calculations.cjs`
- `scripts/audit-transpetro-lote7-engine.cjs`
- `tests/transpetro-bank-ui.cjs`
- `tests/transpetro-bank.cjs`
- `tests/transpetro-lote4.cjs`
- `tests/transpetro-lote5.cjs`
- `tests/transpetro-lote6.cjs`
- `tests/transpetro-lote7.cjs`
- `tests/transpetro.cjs`

## 8. Publicação

Commit/push e abertura da PR serão tentados após esta revisão; o resultado efetivo
será registrado na entrega. Nenhum merge será executado. Até integração autorizada,
a main/site continua com a base anterior; os 700 pertencem a esta branch de revisão.
