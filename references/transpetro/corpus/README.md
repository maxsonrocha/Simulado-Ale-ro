# Corpus normativo local

Este diretório existe para permitir autoria e auditoria normativa mesmo quando o ambiente do Codex recebe HTTP 403 ao tentar acessar fontes oficiais.

## Ordem de precedência

1. `../edital_004_2026.json` — trava de edição/escopo expressamente cobrado.
2. Texto oficial vigente ou edição oficial expressamente cobrada, quando acessível.
3. `CORPUS_NORMATIVO_LOCAL.md` — proposições verificadas e fontes oficiais registradas.
4. `../fontes.json` e `../MATRIZ_ASSUNTOS.md` — descoberta/rastreamento de fontes.

## Regra de segurança epistemológica

Uma ficha autoriza apenas o uso das proposições que ela registra. Ausência de um detalhe não autoriza completar por memória.

Exemplo: se a ficha confirma que a NR-35 exige treinamento inicial mínimo de 8 horas, essa informação pode fundamentar uma questão. Se a ficha não registra determinado prazo de uma NR diferente, o autor deve consultar fonte oficial ou escolher outro conteúdo.

## ISO e ABNT

Não armazenar neste repositório cópias integrais não autorizadas de normas ISO/ABNT. O edital fixa as edições relevantes em `../edital_004_2026.json`; cobrança de cláusula/redação exata depende de acesso verificável/licenciado.

## Atualização

Ao ampliar o corpus:

- usar fonte oficial;
- registrar URL e data de verificação;
- distinguir norma vigente de texto futuro/revogado;
- evitar transcrição extensa quando uma proposição factual auditável for suficiente;
- registrar conflitos de vigência explicitamente;
- revisar `CORPUS_NORMATIVO_LOCAL.md` antes de liberar novos lotes de questões.
