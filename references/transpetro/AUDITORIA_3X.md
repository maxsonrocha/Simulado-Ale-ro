# Auditoria tripla — Base normativa e corpus local Transpetro 2026

Data de referência: 03/11/2026.

Arquivos auditados: `README.md`, `fontes.json`, `INSTRUCOES_CODEX.md`, `MATRIZ_ASSUNTOS.md`, `edital_004_2026.json`, `corpus/README.md`, `corpus/CORPUS_NORMATIVO_LOCAL.md` e `corpus/CORPUS_NORMATIVO_COMPLEMENTAR.md`.

## Auditoria 1 — estrutura e cobertura

**APROVADO.**

A base cobre os 11 blocos do conteúdo específico e todas as NRs prioritárias do projeto: NR-01, 04, 05, 06, 07, 09, 10, 11, 12, 13, 15, 16, 17, 18, 20, 23, 26, 29, 30, 32, 33, 34, 35 e 37. NR-02 e NR-27 permanecem explicitamente revogadas.

O corpus foi dividido em arquivo principal + complementar para evitar um arquivo excessivamente grande. `corpus/README.md` e `INSTRUCOES_CODEX.md` obrigam a leitura de ambos. A cobertura complementar eliminou a lacuna anteriormente registrada para NR-04, 09, 11, 15, 16, 18, 23, 26, 29, 30, 32, 33, 34 e 37.

## Auditoria 2 — conferência normativa e temporal

**APROVADO COM LIMITES EXPLÍCITOS.**

A conferência externa usou fontes oficiais do Ministério do Trabalho e Emprego, eSocial, Fundacentro e legislação federal cadastrada em `fontes.json`.

Verificações críticas:
- o índice oficial do MTE identifica NR-02 e NR-27 como revogadas e lista as demais NRs usadas pelo corpus;
- o repositório oficial do MTE disponibiliza os textos das NRs prioritárias, inclusive NR-04, 09, 15, 16, 18, 23, 26, 29, 30, 32, 33, 34 e 37;
- a página oficial da NR-04 confirma o vínculo com o art. 162 da CLT, a lógica de SESMT ligada a empregados/risco e a Portaria MTP 2.318/2022 como última modificação indicada;
- a página oficial da NR-09 confirma o foco atual em avaliação e controle das exposições ocupacionais a agentes físicos, químicos e biológicos;
- a documentação oficial do eSocial em 2026 mantém leiautes S-1.3 e identifica S-2210, S-2220, S-2230 e S-2240 com suas finalidades próprias;
- o Manual WEB Geral identifica S-2210, S-2220 e S-2240 como eventos do módulo SST, enquanto S-2230 é Afastamento Temporário;
- a Fundacentro mantém oficialmente o catálogo de NHOs como instrumentos técnicos de Higiene Ocupacional.

Mantida a trava temporal da NR-10: a nova redação publicada em 2026 não deve ser tratada como vigente antes da data de entrada em vigor registrada na base.

## Auditoria 3 — risco de geração e consistência cruzada

**APROVADO.**

Foi verificado que:
- o edital continua prevalecendo para versões expressamente cobradas;
- ISO 45001:2018, ABNT NBR ISO 14001:2015 e ABNT NBR ISO 19011:2018 permanecem como edições de prova;
- edições ISO posteriores não substituem silenciosamente as do edital;
- o corpus não reproduz integralmente normas ISO/ABNT protegidas;
- o Codex não pode completar lacunas por memória;
- indisponibilidade de rede não obriga abandonar toda a autoria normativa quando houver proposição local verificada;
- uma ficha de escopo não autoriza inventar prazo, limite, artigo, percentual, dimensionamento ou exceção;
- questões quantitativas continuam exigindo segunda resolução independente;
- a base normativa não altera o motor, os bancos de questões ou a ALERO.

## Achados e correções desta rodada

1. A primeira versão do corpus não cobria suficientemente 14 NRs prioritárias. Foi criado `CORPUS_NORMATIVO_COMPLEMENTAR.md` cobrindo todas elas em nível seguro para autoria offline.
2. O protocolo lia apenas o corpus principal. Foi corrigido para exigir os dois arquivos.
3. O conceito de “corpus completo” foi delimitado: completo para autoria offline controlada, não reprodução integral das normas.
4. Mantida a separação correta entre S-2230 e os eventos do módulo SST do Manual WEB Geral.
5. Mantida a precedência das edições ISO/ABNT do edital.

## Limitações deliberadas

O corpus não pretende substituir integralmente textos normativos. Para cobrança fina de item, artigo, prazo, limite de tolerância, dimensionamento, periodicidade, percentual, campo ou exceção, o dado precisa estar explicitamente registrado ou ser conferido na fonte oficial. Essa limitação é intencional e impede falsa precisão.

## Conclusão

**AUDITORIA GERAL APROVADA PARA MERGE.**

A base está apta a sustentar o Lote 3, inclusive as 30 questões de Legislação/NRs, sem exigir que o Codex abandone a matéria quando seu ambiente não acessar diretamente uma página oficial. O Codex deve escolher apenas proposições efetivamente cobertas e substituir qualquer questão cujo detalhe decisivo não possa ser verificado.