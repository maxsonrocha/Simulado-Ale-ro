# Transpetro — Etapa 2 / lote 1

Branch: `feature/transpetro-etapa-2-lote-1`. Base: `1cfabbf`, merge da PR #12.
Entrega para auditoria independente, sem merge e sem início do lote 2.

## Resultado e preservação

Antes: 700 questões regulares e 20 pilotos separados. Depois: **820 questões
únicas no banco regular: 100 PORT, 100 ING e 620 ESP**.

- Os 700 itens, os 20 pilotos e os SVG anteriores permanecem byte a byte iguais
  à main de partida. IDs, ordem nos JSON, alternativas, gabaritos, explicações,
  referências e metadados não foram alterados.
- A opção **Piloto visual (20)** saiu da configuração. O arquivo piloto original
  é carregado uma única vez junto dos demais em FULL/ESP/ERRADAS, sem cópia ou
  renumeração. O marcador de origem da questão foi preservado.
- Os 100 novos estão exclusivamente em `data/transpetro/etapa2/lote1.json`, IDs
  `TP26-E2L1-ESP-0001` a `0100`, com `etapa:2`, `lote:1` e `formato_recurso`.
- O código de boas-vindas permanece presente e desativado; index.html e styles.css
  não foram modificados. Bancos ALERO intactos.
- Nenhuma mudança no motor, seleção por blocos, ordem de grupos, critérios,
  correção, timer ou chaves de localStorage. A única mudança de aplicação é
  configuração de fontes/formatos e remoção do carregamento especial VISUAIS.

## Distribuição

Novas: 55 textuais/estudos de caso; 20 com gráficos/tabelas (**5 gráficos e 15
tabelas**); 15 com diagramas/plantas/esquemas; 10 com ilustrações técnicas.
45 SVG novos, mais 20 preservados. Os 100 novos são independentes; os grupos
anteriores não foram alterados. Figuras necessárias à resolução: dados completos
ficam no recurso visual e na descrição equivalente, não repetidos no enunciado.

Dificuldades novas: **39 médias, 47 altas, 14 muito altas**. Esta solicitação não
fixa quota numérica de dificuldade; a classificação foi feita por exercício,
sem elevar nível apenas para atingir a proporção de lotes anteriores. Não há
calibração psicométrica externa. São 20 gabaritos de cada letra A/B/C/D/E.

| Assunto ESP | Adicionado | Acumulado regular |
|---|---|---|
| acidentes | 5 | 48 |
| desenvolvimento_sustentavel | 4 | 15 |
| emergencias | 5 | 37 |
| ergonomia | 5 | 26 |
| gerenciamento_riscos | 14 | 77 |
| gestao_sms | 7 | 49 |
| higiene_ocupacional | 22 | 106 |
| incendio | 5 | 30 |
| legislacao_nr | 0 | 90 |
| prevencao_riscos | 30 | 122 |
| saude_ocupacional | 3 | 20 |

A matriz oficial da prova permanece **10 PORT + 10 ING + 50 ESP**, 70 pontos,
4h30 e os critérios originais. A matriz fechada da Etapa 1 continua com 500 ESP;
a tabela acima é a disponibilidade ampliada, não uma nova composição oficial.

### Quantidade por arquivo

| Arquivo | Questões |
|---|---:|
| data/transpetro/eng_seguranca/acidentes.json | 40 |
| data/transpetro/eng_seguranca/desenvolvimento_sustentavel.json | 10 |
| data/transpetro/eng_seguranca/emergencias.json | 30 |
| data/transpetro/eng_seguranca/ergonomia.json | 20 |
| data/transpetro/eng_seguranca/gerenciamento_riscos.json | 60 |
| data/transpetro/eng_seguranca/gestao_sms.json | 40 |
| data/transpetro/eng_seguranca/higiene_ocupacional.json | 80 |
| data/transpetro/eng_seguranca/incendio.json | 24 |
| data/transpetro/eng_seguranca/ingles.json | 100 |
| data/transpetro/eng_seguranca/legislacao_nr.json | 90 |
| data/transpetro/eng_seguranca/portugues.json | 100 |
| data/transpetro/eng_seguranca/prevencao_riscos.json | 90 |
| data/transpetro/eng_seguranca/saude_ocupacional.json | 16 |
| data/transpetro/etapa2/lote1.json | 100 |
| data/transpetro/pilotos_visuais.json | 20 |

## Auditoria 1 — estrutural

Aprovada nos controles executados: **820 IDs globais únicos**, 100 novos, JSON
válidos, validação pelo mesmo carregador da aplicação, área/cargo/concurso,
assunto/subassunto, dificuldade, cinco alternativas distintas, índice de gabarito,
explicação, referência e arquivos das figuras. Os 65 SVG foram analisados como
XML. Fontes e recursos locais existem; SVG sem scripts, eventos, foreignObject
ou chamadas a recursos externos.

A comparação com `git show 1cfabbf` preserva os arquivos anteriores de data/ e
assets/. O gate antigo continua aprovando exatamente a Etapa 1 de 700. O gate
novo valida estritamente o banco atual de 820; não se enfraqueceu a meta anterior.

O primeiro ensaio identificou alternativas 0,5/−0,5 que a normalização antiga
tratava como iguais; o distrator foi substituído por −1,5, compatível com erro de
selecionar somente valores negativos. A validação final passou.

## Auditoria 2 — editorial, técnica e fontes

Revisados 100 enunciados, 500 alternativas, 100 respostas e explicações.
[Índice individual](transpetro-etapa2-lote1-editorial.md) e hashes em
[JSON de auditoria](transpetro-etapa2-lote1-auditoria.json).

O auditor JavaScript, separado do builder Python, executa **71 verificações de
modelos e resoluções**, incluindo casos lógicos/topológicos, não apenas cálculos
numéricos. Usa os dados brutos das 45 figuras e resolve de novo os problemas
quantitativos textuais. Exemplos: balanço de energia regenerativa, autorretenção,
compartilhamento de carga em capacitores, estabilidade térmica, probabilidade,
latência, difusão, diluição, aproximação relativa, umidade de resíduo, som em
escala logarítmica, incerteza correlacionada, equilíbrio e interseção de trajetória.
Resultados explícitos constam no JSON, com unidades e hipóteses nos exercícios.
Não se apresenta o script como segunda revisão humana independente.

As 45 figuras foram renderizadas em Chromium e inspecionadas em cinco catálogos.
Foram corrigidos contato/posição dos apoios, circuito elétrico sem retorno,
ângulo de lingas, envelope de altura sob a viga, sobreposição de personagem com
título e rótulos de ventilação. Diagramas qualitativos são identificados como
modelos; cotas e equações prevalecem. Os 20 SVG piloto não foram retocados.

Os dois arquivos do corpus local, protocolo, matriz, edital e registros anteriores
foram lidos. As proposições normativas disponíveis já tinham extensa cobertura;
14 candidatos normativos muito próximos de questões antigas foram substituídos
por problemas novos de engenharia, em vez de inventar detalhes legais.
Assim, este lote **não adiciona questões dependentes de requisito normativo fino**;
a cobertura anterior de Legislação/NRs permanece íntegra.

As questões citam [bibliografia e modelos](../references/transpetro/etapa2-lote1.md):
OpenStax, NIST/SEMATECH, OIT, CCPS, Bird/Stewart/Lightfoot, Rosen e Cover/Thomas,
conforme o fundamento. MTE, NIST e OpenStax tentados retornaram **403 do túnel**;
[evidências](transpetro-etapa2-lote1-fontes.json). Não se alega consulta externa
bem-sucedida a páginas/cláusulas ou conferência de edição. A bibliografia é
identificável para verificação humana. Dados e critérios são hipóteses expressas,
sem atribuição de limite legal. Não foram usados PDFs não autorizados.

## Auditoria 3 — originalidade e integração

**76.950 pares** examinados por TF/IDF e cosseno sobre enunciados normalizados:
72.000 novas × 720 anteriores e 4.950 internas. Nenhum alerta acima de 0,65.
Os três vizinhos lexicais mais próximos de cada questão estão registrados.
A triagem lexical **não prova originalidade semântica**; houve revisão editorial
de mecanismos, hipóteses e soluções, inclusive comparando os subassuntos e as
respostas antigas. Compartilhar lei física ou assunto não foi considerado,
sozinho, duplicação; cenário e decisão exigidos também foram examinados.

Candidatos substituídos na autoria incluem os IDs finais 0001–0016, 0018, 0025, 0046, 0050, 0053, 0054,
0072, 0099 e 0100. Os primeiros drafts desses IDs não são questões antigas do
banco: nenhuma das 720 anteriores foi substituída. Mudanças importantes:
repetição de CIPA/NR/EPI → aplicação de engenharia; junta por temperatura →
relaxação viscoelástica; abrigo por fluxo → aproximação relativa; recuperação →
secagem; grafo de dreno → fluxo em material poroso; queda horizontal → contato
com plano inclinado; sistemas de dois sensores → informação de testes diagnósticos.
A revisão substituiu esses candidatos por raciocínios diferentes, não paráfrases.

### Testes executados

- Suíte Node: **111/111 aprovados**, zero falha/skip na execução final.
- Gates: Etapa 1/700, 20 pilotos preservados e Etapa 2/820 aprovados.
- Dez provas completas inteiramente inéditas em **dez sementes** com o motor
  real, mantendo blocos/ordem e 10/10/50. Na 11ª, PORT/ING renovam seus ciclos;
  os 50 ESP ainda são inéditos. O limite de completas inteiramente inéditas
  continua dez pelos 100 PORT/100 ING, não 820/70. ESP permite doze de 50 com
  inéditas, com capacidade residual 20, exercitada também no teste visual.
- Chromium: 1280 px desktop e 390 px móvel emulado com toque. **65 imagens**
  carregadas em cada viewport, zoom 200%, rolagem, retorno de foco, teclado,
  respostas, marcação, descrições, legendas, PNG/JPEG/WebP, múltiplas figuras,
  404 tratado e expiração do timer com diálogo aberto.
- Fluxo visual verifica histórico antigo `type:VISUAIS`, IDs de piloto no
  caderno regular e dois recursos visuais na revisão. Testes Node preservam
  bytes das chaves anteriores ao carregar, inclusive vistos/errados/histórico.
- `transpetro-bank-ui.cjs`: banco real820, FULL70, ESP50, PROVA/TREINO,
  4h30/aviso, mapa, navegação, respostas, resultado, histórico e grupos nas erradas.
- `transpetro-ui.cjs`: critérios de aprovação/reprovação e timer com mocks apenas
  em memória. As novas fontes recebem arrays vazios nessa fixture, evitando
  misturar dados reais e respostas controladas do teste.
- `multiconcurso.cjs`: oito combinações ALERO, cargos, bancos, correção, grupos,
  migração, isolamento, caderno, timer e celular aprovados.
- Prefixo estático `/Simulado-Ale-ro/` testado localmente. Sem erro JavaScript
  não tratado ou erro inesperado de console no roteiro visual. O 404 deliberado
  é esperado e não foi apresentado como carregamento HTTP bem-sucedido.

Falhas iniciais de teste foram corrigidas: expectativas antigas 700/13 fontes,
fixtures misturando as novas fontes reais e snapshots históricos filtrando apenas
lote (Etapa 2 também tem lote1). Agora snapshots usam etapa e origem; a prova
real continua sem filtro adicional. Um roteiro expirava o timer antes de clicar
na ampliação; a ordem foi corrigida e reexecutada. O percurso determinístico de 65 imagens agora ajusta também o
contador/mapa da fixture, evitando captura enganosa 65/50. Não houve correção do motor.

## Arquivos e reprodução

Aplicação: somente `app.js` (fontes/formatos). Documentação atualizada em
MULTICONCURSO.md e docs/QUESTOES_VISUAIS.md. Novos dados em etapa2/lote1.json;
45 novos SVG em assets/transpetro/etapa2-lote1/. Builder Python stdlib, auditor
Node, novos arquivos de documentação/auditoria, referências e capturas
de QA em docs/etapa2-preview/. Scripts históricos e testes foram ajustados
apenas para escopo e expectativas; evidências históricas não foram reescritas.
A lista exata está no diff da branch.

```sh
node --check app.js
node scripts/validate-transpetro.cjs
node scripts/validate-transpetro-visuais.cjs
node scripts/audit-transpetro-etapa2-lote1.cjs
node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs tests/transpetro-lote6.cjs tests/transpetro-lote7.cjs tests/transpetro-visuais.cjs tests/transpetro-etapa2-lote1.cjs
# Com Playwright como ferramenta de teste e servidor local ativo:
# SIMULADO_URL=http://127.0.0.1:8008/Simulado-Ale-ro/
node tests/transpetro-etapa2-ui.cjs
node tests/transpetro-bank-ui.cjs
node tests/transpetro-ui.cjs
node tests/multiconcurso.cjs
```

## Limitações e parecer

Pronto para **auditoria independente da branch**, sem merge autorizado.
Não foram verificados Safari, Firefox, aparelhos físicos, leitor de tela ou
GitHub Pages de produção desta branch. Não há certificação de acessibilidade,
calibração psicométrica ou parecer externo de especialista. As fontes externas
continuam pendentes de conferência pelo revisor. Algoritmos de similaridade
não garantem inexistência absoluta de equivalência semântica.

O aplicativo continua estático e sem dependência de produção; Python e
Playwright são ferramentas de autoria/teste. Não se adicionou backend ou
service worker, e não se promete primeira carga offline sem arquivos/cache.
Não se iniciou o lote2 nem se alterou a composição oficial de prova.
