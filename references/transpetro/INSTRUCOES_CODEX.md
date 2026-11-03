# Protocolo Codex — questões normativas Transpetro

Este arquivo deve ser lido junto com `README.md` e `fontes.json` antes de gerar ou revisar questões de Engenharia de Segurança do Trabalho.

## 1. Ordem de trabalho

1. Identifique `area`, `assunto` e `subassunto` da questão pretendida.
2. Consulte `fontes.json` e selecione as fontes de maior prioridade no `mapaAssuntos`.
3. Verifique o texto oficial vigente.
4. Só então redija enunciado, alternativas, gabarito e explicação.
5. Registre no relatório do lote a fonte oficial usada nas questões normativas, ao menos por bloco/assunto.

## 2. Proibição de preenchimento por memória

Não use memória do modelo para completar:
- números de itens ou artigos;
- prazos;
- limites de exposição;
- periodicidades;
- dimensionamentos;
- requisitos de capacitação;
- obrigações de empregador ou trabalhador;
- exceções;
- vigências;
- classificações legais;
- campos ou prazos do eSocial.

Se não for verificável, mude o foco da questão ou não a gere.

## 3. Tratamento de HTTP 403

403 significa falha de acesso naquele ambiente, não autorização para contornar proteção do servidor.

Procedimento:
1. tente o índice oficial do órgão;
2. tente outra representação oficial publicamente acessível do mesmo conteúdo;
3. consulte as referências oficiais já registradas neste diretório;
4. se a proposição específica continuar sem verificação, abandone aquela questão;
5. registre a pendência no relatório.

Não mascarar user-agent, burlar WAF, CAPTCHA, autenticação ou restrição de acesso.

## 4. Vigência

A data de referência do projeto é 2026. Antes de usar uma norma, confira se o texto consultado é vigente para essa data.

Atenções:
- NR-2: revogada;
- NR-27: revogada;
- NR-1/GRO/PGR: conferir a redação vigente em 2026 e o material oficial de interpretação do MTE;
- não assumir que um PDF antigo no acervo representa a redação mais recente apenas pelo nome do arquivo.

## 5. Questões quantitativas

Para cálculos de higiene ocupacional, risco ou engenharia:
1. identifique a fonte do método;
2. copie apenas os dados necessários, sem reproduzir material protegido extensamente;
3. resolva a questão;
4. faça uma segunda resolução independente;
5. confira unidade, conversão e arredondamento;
6. confirme que somente uma alternativa coincide com o resultado defensável.

## 6. eSocial/SST

Trate como eventos SST centrais:
- S-2210 — Comunicação de Acidente de Trabalho;
- S-2220 — Monitoramento da Saúde do Trabalhador;
- S-2240 — Condições Ambientais do Trabalho / agentes nocivos.

S-2230 corresponde a afastamento temporário e não deve ser apresentado como um dos três eventos SST centrais.

Qualquer prazo, regra de obrigatoriedade ou campo deve ser conferido na documentação vigente.

## 7. ISO e ABNT

Não adicionar ao repositório cópias não autorizadas de ISO, ABNT ou outro material protegido.

Para ISO 45001, ISO 14001 e ISO 19011:
- conceitos gerais podem ser cobrados quando verificáveis;
- não inventar número de cláusula;
- não reproduzir trechos extensos;
- questões dependentes de redação/cláusula exata exigem fonte licenciada disponível no ambiente.

## 8. Distratores

Distrator difícil deve ser plausível e conceitualmente próximo, mas inequivocamente incorreto à luz da fonte.

Permitido:
- conceito vizinho aplicado ao contexto errado;
- procedimento correto em etapa inadequada;
- erro de cálculo plausível;
- troca entre responsabilidades realmente distintas;
- interpretação incompleta de cenário.

Proibido:
- ambiguidade normativa;
- duas respostas defensáveis;
- detalhe omitido necessário para decidir;
- pegadinha puramente linguística;
- alternativa absurda apenas para completar cinco opções.

## 9. Auditoria obrigatória

Para cada lote:

### Auditoria estrutural
- JSON válido;
- IDs únicos;
- cinco alternativas;
- answer válido;
- metadados exigidos;
- grupos ligados íntegros e ordenados.

### Auditoria de conteúdo
- revisar 100% das questões novas;
- revisar 100% das alternativas;
- conferir fontes normativas;
- recalcular questões quantitativas;
- procurar dupla resposta defensável.

### Auditoria global
- comparar novas questões entre si;
- comparar novas contra todo o banco existente;
- detectar paráfrases, cenários equivalentes e simples troca de números/nomes;
- verificar pistas de tamanho/forma da alternativa correta;
- preservar regressão ALERO e regras do motor de não repetição.

## 10. Registro recomendado no relatório

Para cada área normativa, registrar:
- quantidade de questões;
- fontes oficiais consultadas;
- data da consulta quando relevante;
- pontos que ficaram sem questão por falta de verificação;
- correções feitas durante auditoria;
- cálculos refeitos;
- eventuais limitações de acesso.

A meta de quantidade nunca supera a exigência de correção.