# Protocolo Codex — questões normativas Transpetro

Este arquivo deve ser lido junto com `README.md`, `fontes.json`, `MATRIZ_ASSUNTOS.md`, `AUDITORIA_3X.md`, `edital_004_2026.json` e `corpus/CORPUS_NORMATIVO_LOCAL.md` antes de gerar ou revisar questões de Engenharia de Segurança do Trabalho.

## 1. Regra máxima: o edital define o conteúdo cobrado

Para o simulado Transpetro 2026, a versão expressamente indicada no Edital 004/2026 prevalece como objeto de cobrança, mesmo que uma edição internacional posterior já tenha sido publicada.

Portanto, para a Ênfase 21 — Engenharia de Segurança do Trabalho:
- ISO 45001:2018 — usar como versão do edital;
- ABNT NBR ISO 14001:2015 — usar como versão do edital;
- ABNT NBR ISO 19011:2018 — usar como versão do edital;
- não substituir automaticamente ISO 14001:2015 por ISO 14001:2026;
- não substituir automaticamente ISO 19011:2018 por ISO 19011:2026.

As páginas das edições ISO posteriores registradas em `fontes.json` servem para controle de vigência e contexto editorial, não para alterar unilateralmente o conteúdo programático do concurso.

## 2. Ordem de trabalho

1. Identifique `area`, `assunto` e `subassunto`.
2. Confira primeiro o conteúdo programático do Edital 004/2026.
3. Consulte `fontes.json` e `MATRIZ_ASSUNTOS.md`.
4. Consulte `corpus/CORPUS_NORMATIVO_LOCAL.md` para proposições já verificadas e utilizáveis offline.
5. Para legislação/NR com indicação de atualizações no edital, confira o texto vigente aplicável quando acessível.
6. Para norma técnica citada com edição específica no edital, use aquela edição como objeto da questão.
7. Só então redija enunciado, alternativas, gabarito e explicação.
8. Registre no relatório do lote as fontes usadas.

## 3. Proibição de preenchimento por memória

Não use memória do modelo para completar números de itens/artigos, cláusulas, prazos, limites de exposição, periodicidades, dimensionamentos, requisitos de capacitação, obrigações, exceções, vigências, classificações legais ou campos/prazos do eSocial.

Uma ficha do corpus autoriza apenas as proposições que registra. Se um detalhe não estiver registrado e a fonte oficial estiver inacessível, mude o foco da questão.

## 4. Tratamento de HTTP 403 e corpus local

403 significa falha de acesso naquele ambiente, não autorização para contornar proteção do servidor e também não significa que toda autoria normativa precise ser abandonada.

Procedimento:
1. tente índice, preview ou representação oficial alternativa;
2. consulte referências já registradas;
3. consulte `corpus/CORPUS_NORMATIVO_LOCAL.md`;
4. se a proposição necessária estiver explicitamente registrada no corpus, ela pode fundamentar a questão e deve ser citada no relatório como fallback local auditado, junto da URL oficial registrada;
5. quando permitido, use acesso licenciado autorizado;
6. fonte técnica secundária confiável pode sustentar somente o conceito que efetivamente documenta, nunca redação/cláusula normativa não verificada;
7. se continuar sem verificação, abandone aquela questão e escolha outra proposição verificável.

Não mascarar user-agent, burlar WAF, CAPTCHA, autenticação ou restrição de acesso.

## 5. Vigência

- NR-2: revogada;
- NR-27: revogada;
- NR-1/GRO/PGR: conferir a redação vigente em 2026 e o material oficial do MTE;
- NR-10: distinguir a redação vigente até 31/05/2027 da nova redação publicada em 2026 com vigência em 01/06/2027;
- não assumir que PDF antigo representa a redação mais recente;
- para ISO/ABNT com versão expressa no edital, não confundir `edição atualmente publicada` com `edição cobrada pelo edital`.

## 6. Questões quantitativas

1. identifique a fonte do método;
2. use apenas os dados necessários;
3. resolva a questão;
4. faça segunda resolução independente;
5. confira unidade, conversão e arredondamento;
6. confirme uma única alternativa defensável.

## 7. eSocial/SST

O edital da Ênfase 21 cita expressamente quatro eventos, portanto todos podem ser cobrados:
- S-2210 — Comunicação de Acidente de Trabalho;
- S-2220 — Monitoramento da Saúde do Trabalhador;
- S-2230 — Afastamento Temporário;
- S-2240 — Condições Ambientais do Trabalho / agentes nocivos.

Não apresentar S-2230 como se tivesse a mesma finalidade dos três eventos descritos pelo Manual WEB Geral como eventos do módulo SST, mas também não excluí-lo do banco, pois ele consta expressamente do edital.

Qualquer prazo, obrigatoriedade ou campo deve ser conferido na documentação vigente ou estar explicitamente registrado no corpus local.

## 8. ISO e ABNT

Não adicionar ao repositório cópias não autorizadas de ISO, ABNT ou outro material protegido.

- acesso ABNT/Confea/Crea/Mútua pode ser usado somente por usuário autorizado e dentro dos termos do serviço;
- previews oficiais ISO podem sustentar apenas o conteúdo efetivamente exibido;
- conceitos podem ser cobrados quando verificáveis;
- não inventar número de cláusula;
- não reproduzir trechos extensos;
- redação/cláusula exata exige acesso verificável/licenciado à edição cobrada pelo edital.

## 9. Distratores

Distrator difícil deve ser plausível e conceitualmente próximo, mas inequivocamente incorreto.

Permitido: conceito vizinho no contexto errado; procedimento correto em etapa inadequada; erro de cálculo plausível; troca entre responsabilidades distintas; interpretação incompleta de cenário.

Proibido: ambiguidade normativa; duas respostas defensáveis; omissão de dado necessário; pegadinha puramente linguística; alternativa absurda.

## 10. Auditoria obrigatória de cada lote

### Estrutural
JSON válido; IDs únicos; cinco alternativas; `answer` válido; metadados; grupos ligados íntegros e ordenados.

### Conteúdo
Revisar 100% das questões e alternativas; conferir fontes; recalcular quantitativas; procurar dupla resposta; conferir aderência à versão normativa indicada pelo edital.

### Global
Comparar novas entre si e contra o banco; detectar paráfrases/cenários equivalentes; verificar pistas de gabarito; preservar regressão ALERO e motor de não repetição.

## 11. Registro no relatório

Registrar quantidade, fontes, edição normativa usada, data de consulta quando relevante, uso do corpus local como fallback, pendências de acesso, correções e cálculos refeitos.

A meta de quantidade nunca supera a correção e a aderência ao edital.