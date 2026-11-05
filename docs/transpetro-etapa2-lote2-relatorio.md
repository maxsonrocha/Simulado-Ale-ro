# Transpetro — Etapa2 / lote2

Branch: `feature/transpetro-etapa-2-lote-2`.
Base: main `18d1aa8`, merge da PR#13 (Etapa2/lote1).
Entrega para auditoria independente; sem merge e sem início do lote3.

## Entrega e preservação

**820 → 920 questões únicas**, sendo100 PORT,100 ING e720 ESP.
Adicionadas exatamente100 ESP em `data/transpetro/etapa2/lote2.json`, IDs
`TP26-E2L2-ESP-0001` a `0100`. As820 anteriores e seus recursos foram preservados
byte a byte. O auditor compara os87 arquivos anteriores de data/ e assets/ com
a base. Nenhuma questão antiga foi corrigida, renumerada ou reclassificada.

A única alteração da aplicação foi acrescentar a fonte do lote2 à configuração.
Nada foi reescrito no motor, pontuação, agrupamento, timer ou persistência.
ALERO, HTML/CSS e código de boas-vindas desativado permanecem intactos.
Não há aba/formato novo e **não foi implementada regra de máximo45% de repetição**.

## Distribuições obrigatórias

| Assunto ESP | Lote2 | Acumulado regular |
|---|---:|---:|
| legislacao_nr | 20 | 110 |
| gerenciamento_riscos | 15 | 92 |
| higiene_ocupacional | 10 | 116 |
| prevencao_riscos | 10 | 132 |
| gestao_sms | 10 | 59 |
| emergencias | 8 | 45 |
| acidentes | 7 | 55 |
| ergonomia | 6 | 32 |
| incendio | 6 | 36 |
| saude_ocupacional | 5 | 25 |
| desenvolvimento_sustentavel | 3 | 18 |

- Dificuldade: **20 médias /45 altas /35 muito altas**.
- Gabaritos: **20 A /20 B /20 C /20 D /20 E**.
- Recursos: **55 textuais,20 gráficos/tabelas,15 diagramas,10 ilustrações**.
-45 SVG autorais:3 gráficos,17 tabelas técnicas,15 diagramas e10 ilustrações.
-100 questões novas independentes, nenhum grupo novo; todos os grupos anteriores
  e sua ordem permanecem. Há110 SVG de questões no banco atual,65 anteriores+45.

A dificuldade foi revista pelo raciocínio, não pelo comprimento. Casos inicialmente
marcados muito altos mas resolvidos por uma única inferência foram rebaixados;
outros foram efetivamente reescritos com covariância, versões de protocolo,
incerteza de pesos, arrependimento e unidades funcionais antes de classificá-los.
A distribuição foi validada novamente. A classificação é editorial; não houve
calibração psicométrica ou validação externa por banca/especialista.

## Auditoria1 — estrutura

**Aprovada nos controles executados.**

920 IDs únicos no carregador real;100 novos sequenciais; JSON válidos;
concurso/cargo/área e assuntos válidos; metadados, explicações, fontes e cinco
alternativas distintas; gabaritos no intervalo; quotas exatas;45 caminhos de
imagens existentes. Todos os110 SVG foram analisados como XML. Figuras têm
viewBox/dimensões, título, descrição e texto equivalente; nenhum script, evento,
foreignObject ou referência externa foi introduzido.

[Auditoria JSON](transpetro-etapa2-lote2-auditoria.json) contém hashes por questão,
figura e fonte. [Manifesto](transpetro-etapa2-lote2-modelos.json) registra os dados
brutos e resultados para76 verificações, das quais45 associadas às figuras.
O script novo exige o banco atual920, sem filtro para ocultar total divergente.
O auditor histórico do lote1 passou a isolar explicitamente seu snapshot820;
sua saída continua idêntica ao relatório já integrado. O gate da Etapa1 continua
estritamente700 e o dos20 pilotos continua aprovando seu conteúdo preservado.

Falhas estruturais de desenvolvimento: uma asserção copiada ainda esperava820
IDs únicos apesar de carregar920; foi corrigida nos testes do banco atual.
Uma invocação inicial tentou abrir o arquivo de teste novo antes de criá-lo;
o harness foi corrigido e a suíte final passou. Nenhuma mudança de dados antigos.

## Auditoria2 — técnica, editorial e normativa

**Revisão interna concluída, com os limites de fonte abaixo.**

[Revisão individual](transpetro-etapa2-lote2-editorial.md):100 enunciados,
500 alternativas,100 gabaritos e100 explicações. Auditor JavaScript separado do
builder Python refaz76 modelos e resoluções, inclusive casos lógicos; não se
apresenta o código como segunda equipe humana independente.

Casos incluem: média da cauda fracionada, cadeias absorventes, limites de
probabilidade com dependência desconhecida, estimador correlacionado com peso
negativo, volume seco, exposição integrada, energia/tempo de atuação, estabilidade,
protocolo de unidades, fluxo de duas etapas, prontidão condicional, custo robusto,
amostragem com probabilidades diferentes, análise circular de horários, incerteza
preditiva, decisão multicritério e balanços de radiação, pó e equivalentes químicos.

### Correções antes da versão final

- Substituídos candidatos próximos de exercícios antigos: seleção/CA de EPI,
  método/enquadramento, escopo NR-09, dispensa e revalidação. A nova versão usa
  objetos documentais distintos, calibração de bomba versus detector, informação
  biológica não numérica, identidade da organização e evidência da equipe.
- A ilustração de reação de apoio foi substituída por selo líquido, evitando
  repetição de uma questão antiga de equilíbrio com números diferentes.
- A prontidão de dois recursos passou a incluir informação condicional, e o
  problema circular passou a três horários assimétricos, em vez de mera simetria.
- Corrigidas geometria da rota (3/4), continuidade do fluido no U, raios visuais
  diante da parede e cobertura que sombreia somenteB. Setas das redes passaram
  a terminar na borda correta dos nós. Todos os45 SVG foram renderizados em
  Chromium e inspecionados em cinco catálogos, inclusive após as correções.
- Acrescentadas premissas visíveis nas figuras: normalização de probabilidades,
  unidade da constante do detector, posterior e média Beta e repetição até sucesso.
- Explicitadas validade temporal no caso da PT, exigência dos dois recursos,
  pesos iguais para horário circular e referência do teste de dupla tarefa.
- Corrigido intervalo de média censurada para `[3;4,5)` e limiar de rotação
  aproximado2864,78rpm. Valores hipotéticos não foram convertidos em limites legais.
- Encurtadas alternativas corretas que denunciavam o gabarito por detalhamento.
  Na versão final,3 corretas são estritamente as mais longas e16 estritamente as
  mais curtas; os demais casos incluem comprimentos intermediários/empates.
  Isso é triagem editorial, não prova automática de qualidade dos distratores.

### Fontes dos20 itens normativos

| IDs novos | Base local conferida |
|---|---|
|0001,0006,0011,0016|NR-06: CA, produto, seleção e participação|
|0002,0007,0019|NR-07: riscos do PGR, elaboração/implantação e custeio|
|0003|NR-13: escopo, sem extrapolar enquadramento específico|
|0004|Fundacentro/NHO07: objeto da calibração de bombas|
|0005,0015,0018,0020|NR-01 e interfaces registradas com NR-06/07|
|0008|NR-17: adaptação e organização do trabalho|
|0009|Corpus complementar: NR-18/34/29 e campos setoriais|
|0010|NR-20: modalidades condicionadas, sem inventar requisitos|
|0012|NR-09: exposições físicas, químicas e biológicas|
|0013|eSocial: finalidades distintas dos eventos do edital|
|0014,0017|NR-35: autorização e condições registradas de revalidação|

Os dois arquivos do corpus auditado, protocolo e trava do edital foram usados
como fallback local. Índice MTE, PDF oficial alternativo NR-06 e eSocial retornaram
403; OpenStax e NIST tentados também retornaram403. Ver
[evidências de consulta](transpetro-etapa2-lote2-fontes.json).
**Não houve conferência externa bem-sucedida de vigência nesta execução.**
Os itens não dependem de citação literal, item/artigo não conferido ou requisito
ausente das fichas. Preços, restrições de projeto e parâmetros são hipóteses
internas explícitas, não normas. Não se afirma que o corpus substitui texto oficial.

[Referências técnicas](../references/transpetro/etapa2-lote2.md) identificam
OpenStax (física/química/estatística), NIST, OIT, CCPS, Rosen, Cover/Thomas,
Ross e Pearl como apoio. Não se alega leitura de página/cláusula externa,
acesso licenciado ou reprodução de norma protegida. A verificação bibliográfica
externa e revisão jurídica/técnica de vigência permanecem para auditoria humana.

## Auditoria3 — originalidade, integração e regressão

**Aprovada nos testes executados; revisão humana independente pendente.**

TF/IDF/cosseno: **86.950 pares**, sendo82.000 novas×820 anteriores e4.950 internas.
Nenhum alerta acima de0,65; três vizinhos lexicais por item registrados no JSON.
Isso não prova originalidade semântica absoluta. A revisão editorial examinou
mecanismos, dados e operações dos candidatos e dos pares mais próximos.

Pares críticos discutidos:

- Novo0028 versus antigo0462: limite agudo de ao menos dois eventos, com
  distribuições que atingem as bordas, em vez da união de ao menos um.
- Novo0048 versus E2L1-0021: duas evidências de sentidos opostos, com independência
  condicional e posterior final, em vez de uma atualização isolada.
- Novo0058 versus antigo0365: pior esperança sob probabilidades acopladas,
  em vez de ordenar perdas por regra lexicográfica.
- Novo0059 versus piloto0018: minimização contínua com derivada e fronteira do
  domínio, em vez de comparar limiares discretos por soma ponderada.
- Novo0079 versus novo0098: partição de equilíbrio em duas fases versus
  ressuspensão e cenários espaciais; compartilhar concentração/massa não foi
  tratado sozinho como identidade de exercício.
- Novo0081 versus antigo0490: geometria de rolamento com componente tangencial
  e vínculo sem deslizamento versus advecção de frente. Compartilham composição
  de velocidades, mas não apenas números, objeto e mesma pergunta.

Esses pareceres são editoriais, não uma garantia por embeddings nem revisão
semântica manual de todos os86.950 pares. O revisor independente pode discordar
sobre proximidade de uma família; os vizinhos e dados foram mantidos para isso.

### Resultados dos testes

- **117/117 Node aprovados**, sem falhas ou skips na execução final.
- Gates Etapa1/700, pilotos20, snapshot lote1/820 e banco atual920 aprovados.
- Dez completas inteiramente inéditas em dez sementes:70=10/10/50, com grupos
  juntos e ordenados. Na11ª PORT/ING renovam ciclo, mas ESP ainda tem inéditas.
- Quatorze específicos de50 inéditos em cinco sementes:700 ESP usados sem
  repetição; há20 restantes. O limite de completas inteiramente inéditas continua
  dez pelos100 PORT/100 ING, não `floor(920/70)`.
- Testes novos de caderno: IDs reais do lote2, imagens, correção, remoção de
  acertos do caderno e agregação por assunto. Histórico antigo VISUAIS e vistos
  do piloto permanecem; isolamento por concurso/cargo continua testado.
- Chromium1280px e390px com toque:110 imagens carregadas em cada viewport,
  legendas/descrições, zoom200%, rolagem, foco, respostas, marcações, erro404
  tratado, PNG/JPEG/WebP e timer com diálogo aberto. A galeria de cobertura
  temporária usa questões reais em memória; não é novo formato do aplicativo.
- Roteiro visual seleciona explicitamente questões do lote2 para revisão e
  caderno. Prova gerada antes da galeria mantém ESP50.
- `transpetro-bank-ui.cjs`: banco real920, FULL70, ESP50, PROVA/TREINO, mapa,
  respostas/navegação, grupos,15min finais/4h30, resultado, histórico e erradas.
- `transpetro-ui.cjs`: critérios, contexto e timer com mocks somente em memória;
  fontes extras interceptadas como vazias para manter a fixture controlada.
- `multiconcurso.cjs`: oito combinações ALERO, cargos, correção, grupos, migração,
  isolamento, histórico/caderno, timer e celular aprovados.
- Sem erro JavaScript não tratado ou erro inesperado de console no roteiro
  visual. O404 deliberado foi observado/tratado, não contado como recurso válido.
- Prefixo `/Simulado-Ale-ro/` servido localmente: caminhos Pages funcionaram.
  Não houve teste/publicação do domínio de produção desta branch.

## Arquivos e reprodução

Aplicação: apenas uma linha em app.js para cadastrar lote2. Atualizados os testes
que carregam o banco atual e o escopo da auditoria histórica820, sem mudar suas
resoluções ou resultados. Documentação atualizada em MULTICONCURSO.md e
QUESTOES_VISUAIS.md. Criados: lote2.json,45 SVG, builder, auditor, testes específicos,
modelos, evidência de fontes, índice editorial, este relatório, referência técnica
e capturas de QA em docs/etapa2-lote2-preview/. Nenhum banco anterior foi alterado.

```sh
node scripts/validate-transpetro.cjs
node scripts/validate-transpetro-visuais.cjs
node scripts/audit-transpetro-etapa2-lote1.cjs
node scripts/audit-transpetro-etapa2-lote2.cjs
node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs tests/transpetro-lote6.cjs tests/transpetro-lote7.cjs tests/transpetro-visuais.cjs tests/transpetro-etapa2-lote1.cjs tests/transpetro-etapa2-lote2.cjs
# Playwright como ferramenta de desenvolvimento; servidor estático ativo.
# SIMULADO_URL=http://127.0.0.1:8008/Simulado-Ale-ro/
node tests/transpetro-etapa2-lote2-ui.cjs
node tests/transpetro-bank-ui.cjs
node tests/transpetro-ui.cjs
node tests/multiconcurso.cjs
```

## Limitações e parecer de entrega

Pronto para auditoria independente da branch; sem merge autorizado. Fontes
oficiais online e calibração de dificuldade permanecem pendentes de revisão
externa. Não foram testados Safari, Firefox, aparelhos físicos, leitor de tela
ou primeira carga offline sem cache. Não há certificação de acessibilidade ou
laudo de segurança das situações hipotéticas. O aplicativo continua estático,
sem dependência de produção, backend ou novo service worker. Python/Playwright
são ferramentas de autoria e QA. O lote3 não foi iniciado.
