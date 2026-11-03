# Auditoria tripla — Base normativa Transpetro 2026

Data de referência: 03/11/2026.

Arquivos auditados:
- `README.md`
- `fontes.json` (schemaVersion 2)
- `INSTRUCOES_CODEX.md`
- `MATRIZ_ASSUNTOS.md`
- `AUDITORIA_3X.md`

## Auditoria 1 — Estrutura e consistência interna

**Resultado final: APROVADO APÓS CORREÇÕES.**

Foram conferidos IDs, mapa de assuntos, 11 blocos, NRs prioritárias, regras de 403, eSocial, ISO/ABNT e proteção contra preenchimento por memória.

### Erro encontrado e corrigido
A auditoria anterior ainda mencionava `schemaVersion: 1`, enquanto `fontes.json` já havia evoluído para `schemaVersion: 2`. Este relatório foi atualizado.

Também foi reforçada em README, protocolo e matriz a precedência do edital sobre atualizações posteriores de normas técnicas.

## Auditoria 2 — Conferência normativa e aderência ao edital

**Resultado final: APROVADO APÓS CORREÇÃO MATERIAL IMPORTANTE.**

### Achado crítico
A atualização anterior cadastrou corretamente ISO 14001:2026 e ISO 19011:2026 como edições internacionais atuais, mas isso criava risco de o Codex substituir as versões expressamente cobradas no Edital 004/2026.

O conteúdo programático da Ênfase 21 cobra:
- ISO 45001:2018;
- ABNT NBR ISO 14001:2015;
- ABNT NBR ISO 19011:2018.

Portanto, ISO 14001:2026 e ISO 19011:2026 ficam apenas como referências de atualização/contexto. **Não devem substituir as edições do edital na geração das questões deste concurso.**

Foi confirmado nas páginas oficiais da ISO que:
- ISO 14001:2026 é edição 4, publicada em abril de 2026, substituindo internacionalmente ISO 14001:2015;
- ISO 19011:2026 é edição 4, publicada em maio de 2026, substituindo internacionalmente ISO 19011:2018;
- ISO 45001:2018 permanece publicada/corrente em 2026, enquanto sua revisão está em desenvolvimento para substituição posterior.

A consulta ABNT/Confea/Crea/Mútua foi confirmada como acesso de visualização online ilimitada para usuários autorizados, sem permissão de impressão segundo a página do convênio.

### Segundo erro/risco encontrado e corrigido
O protocolo anterior tratava S-2210, S-2220 e S-2240 como os três eventos SST centrais e alertava para não confundir S-2230. Isso era conceitualmente útil, mas podia levar o gerador a **deixar S-2230 de fora**, embora o Edital 004/2026 cite expressamente S-2210, S-2220, S-2230 e S-2240.

A regra foi corrigida: os quatro eventos pertencem ao universo de cobrança; S-2230 continua corretamente identificado como Afastamento Temporário e não deve ter sua finalidade confundida com as dos demais.

## Auditoria 3 — Revisão cruzada dos arquivos e risco de geração

**Resultado final: APROVADO APÓS CORREÇÕES.**

Cruzamento realizado entre README, `fontes.json`, protocolo Codex, matriz e este relatório.

Verificado após as correções:
- edital tem precedência para delimitar edição normativa cobrada;
- legislação/NR com atualizações deve ser conferida conforme regra do edital e vigência aplicável;
- ISO 14001:2026 e ISO 19011:2026 não podem substituir silenciosamente 2015/2018;
- S-2230 não pode ser excluído do banco;
- fontes protegidas ISO/ABNT não são autorizadas a ser redistribuídas integralmente;
- acesso licenciado é permitido somente dentro dos termos e por usuário autorizado;
- preview oficial sustenta somente o conteúdo efetivamente visível;
- fonte secundária não autoriza inventar cláusula/redação normativa;
- questões quantitativas continuam exigindo segunda resolução independente;
- fontes inacessíveis não podem ser substituídas por memória do modelo;
- regras de dificuldade e auditoria do banco não são afetadas por esta base.

## Ressalva sobre `fontes.json`

O JSON mantém páginas das edições ISO 2026 porque elas são úteis para controle de atualização. Para o simulado, porém, sua interpretação é subordinada à regra explícita de precedência do edital definida em `README.md`, `INSTRUCOES_CODEX.md` e `MATRIZ_ASSUNTOS.md`. Em futura revisão de schema, é recomendável marcar diretamente no JSON cada ISO como `edicaoCobradaNoEdital` ou `somenteContextoAtualizacao` para eliminar qualquer ambiguidade de máquina.

## Conclusão

A auditoria tripla desta atualização **encontrou dois problemas reais de risco de geração e um problema documental**, e eles foram corrigidos:
1. risco de usar ISO 14001:2026/ISO 19011:2026 no lugar das versões expressas do edital;
2. risco de omitir S-2230;
3. relatório anterior desatualizado em relação ao `schemaVersion`.

Com essas correções, a base fica aprovada para orientar os próximos lotes, mantendo a condição de que URL cadastrada não equivale, sozinha, a conteúdo normativo verificado.