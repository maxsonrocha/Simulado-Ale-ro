# Corpus normativo local

Este diretório permite autoria e auditoria normativa mesmo quando o ambiente do Codex recebe HTTP 403 ao acessar fontes oficiais.

## Arquivos obrigatórios

- `CORPUS_NORMATIVO_LOCAL.md` — fichas detalhadas iniciais, eSocial e Fundacentro.
- `CORPUS_NORMATIVO_COMPLEMENTAR.md` — cobertura das demais NRs prioritárias, relações entre normas e reforço de legislação/eSocial.

Os dois arquivos formam uma única base. O Codex deve ler AMBOS antes de criar questões normativas.

## Ordem de precedência

1. `../edital_004_2026.json` — trava de edição/escopo expressamente cobrado.
2. Texto oficial vigente ou edição oficial expressamente cobrada, quando acessível.
3. Os dois arquivos do corpus — proposições verificadas e fontes oficiais registradas.
4. `../fontes.json` e `../MATRIZ_ASSUNTOS.md` — descoberta/rastreamento.

## Cobertura

Todas as NRs prioritárias do projeto possuem cobertura local: NR-01, 04, 05, 06, 07, 09, 10, 11, 12, 13, 15, 16, 17, 18, 20, 23, 26, 29, 30, 32, 33, 34, 35 e 37. NR-02 e NR-27 são registradas como revogadas.

Também há cobertura para eSocial S-2210/S-2220/S-2230/S-2240, Fundacentro/NHOs, legislação trabalhista/previdenciária em nível seguro de escopo e política de ISO/ABNT.

## Regra de segurança epistemológica

Uma ficha autoriza somente as proposições que registra. Ausência de detalhe não autoriza completar por memória. Para artigo, item, prazo, limite, valor, dimensionamento, exceção, periodicidade ou requisito fino, usar proposição explicitamente registrada ou consultar texto oficial acessível.

## ISO e ABNT

Não armazenar cópias integrais não autorizadas. O edital fixa as edições em `../edital_004_2026.json`; cláusula/redação exata depende de acesso verificável/licenciado.

## Significado de “completo”

Completo para autoria offline controlada significa cobertura de todos os eixos normativos prioritários suficiente para selecionar proposições verificadas sem recorrer à memória. Não significa reprodução integral das normas nem autorização para inferir detalhes ausentes.

## Atualização

Ao ampliar o corpus: usar fonte oficial; registrar URL/data; distinguir vigente/futuro/revogado; evitar transcrição extensa; registrar conflitos de vigência; revisar ambos os arquivos antes de liberar novos lotes.