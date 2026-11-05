# Relatório — recursos visuais e 20 pilotos Transpetro

Branch: `feature/transpetro-questoes-visuais-piloto`. Base: `3869ce2`.
Entrega para revisão; sem merge e sem início de expansão de 500 questões.

## Escopo e preservação

Infraestrutura genérica para imagens locais, zoom e descrição equivalente,
e exatamente **20 questões ESP / 20 SVG originais**, em formato piloto separado.
Os **700 itens anteriores (100 PORT, 100 ING, 500 ESP)** e os bancos ALERO estão
inalterados byte a byte. Os pilotos não entram em FULL/ESP nem na matriz da
Etapa 1. Somente o caderno de erradas carrega os pilotos adicionais quando necessário.
A mensagem de boas-vindas continua desativada; seu HTML foi preservado.

Não foram alteradas as funções de sorteio, agrupamento, avaliação ou timer.
O score passa a transportar imagens e identificação do piloto para a revisão.
O histórico usa o formato VISUAIS e a mesma separação concurso/cargo. Estatísticas
incluem o parcial visual no cargo, como já ocorre com outros formatos parciais.

## Conteúdo e distribuição

20 independentes, nenhum novo grupo; contexto visual em grupos foi testado
com objetos somente em memória. Quatro médias, nove altas e sete muito altas;
quatro gabaritos de cada letra A–E. Dificuldade é juízo editorial, sem calibração
psicométrica. Todos exigem os dados do recurso; a descrição equivalente assegura
acesso a esses dados quando a figura não pode ser vista.

| ID final | Assunto | Dificuldade | Gabarito | Arquivo em assets/transpetro/visuais/ |
|---|---|---|---|---|
| 0001 | higiene_ocupacional | media | B | piloto-01.svg |
| 0002 | saude_ocupacional | media | A | piloto-02.svg |
| 0003 | acidentes | media | B | piloto-03.svg |
| 0004 | prevencao_riscos | media | C | piloto-04.svg |
| 0005 | higiene_ocupacional | alta | B | piloto-05.svg |
| 0006 | higiene_ocupacional | alta | B | piloto-06.svg |
| 0007 | gerenciamento_riscos | alta | C | piloto-07.svg |
| 0008 | gerenciamento_riscos | alta | E | piloto-08.svg |
| 0009 | gestao_sms | alta | D | piloto-09.svg |
| 0010 | gestao_sms | alta | A | piloto-10.svg |
| 0011 | acidentes | alta | A | piloto-11.svg |
| 0012 | emergencias | alta | C | piloto-12.svg |
| 0013 | prevencao_riscos | muito_alta | E | piloto-13.svg |
| 0014 | higiene_ocupacional | muito_alta | C | piloto-14.svg |
| 0015 | emergencias | muito_alta | E | piloto-15.svg |
| 0016 | incendio | muito_alta | D | piloto-16.svg |
| 0017 | acidentes | muito_alta | E | piloto-17.svg |
| 0018 | ergonomia | muito_alta | A | piloto-18.svg |
| 0019 | desenvolvimento_sustentavel | muito_alta | D | piloto-19.svg |
| 0020 | gerenciamento_riscos | alta | D | piloto-20.svg |

## Auditoria estrutural

Aprovada nos controles executados: JSON, validação pelo carregador, 20 IDs únicos
sem colisão com os 700 anteriores, cinco alternativas distintas, gabarito válido,
metadados, alt/legenda, caminhos existentes, SVG com title/desc e sem conteúdo
ativo/externo. Os 20 XML também foram analisados pelo parser padrão Python.
Hashes de questão, figura e manifesto constam em
[transpetro-visuais-auditoria.json](transpetro-visuais-auditoria.json).

O validador integral da Etapa 1 continua exigindo exatamente os 700 originais.
Testes históricos que congelavam app.js/index.html/styles.css foram ajustados
para permitir esta alteração autorizada; bancos continuam congelados e funções
centrais de motor/avaliação/timer/storage são comparadas com a base 3869ce2.
Não se removeu proteção de conteúdo para acomodar os pilotos.

## Auditoria editorial e técnica

Revisados os 20 enunciados, 100 alternativas, gabaritos, explicações e descrições.
As 20 figuras foram inspecionadas visualmente em catálogos renderizados. O manifesto
[de dados](transpetro-visuais-dados.json) transcreve os modelos usados.
O validador JavaScript recalcula os modelos a partir dos dados brutos, separado
do builder Python: fração temporal; IQR; sequência acima de referência; distâncias;
proporcionalidade; domínio; corte dirigido; probabilidade condicional; contagem de
responsáveis; comparação de indicadores; reclassificação; união de retângulos;
Euler; integral por trapézios; comprimentos de rota; energia/área; posições da
mediana; custo ponderado; balanço de água; amplitude de sensibilidade.

Correções durante a elaboração: domínio e posição do alvo de calibração foram
compatibilizados; rótulos sobrepostos foram reposicionados; sentidos de fluxo e
fronteira externa ficaram explícitos; massa de combustível foi distinguida da
massa do recipiente; a distribuição de afastamentos foi alterada para não
confundir classe modal com mediana; distratores de associação, média temporal,
rotas e mediana foram revistos. Na revisão final, foram normalizados os espaços entre
palavras, valores e unidades e preenchidos subassuntos descritivos; as asserções
textuais dos testes foram atualizadas após a mudança editorial e a suíte passou
novamente. Nenhum item anterior foi modificado.

Referências bibliográficas identificáveis estão em
[references/transpetro/visuais.md](../references/transpetro/visuais.md).
NIST e duas representações OpenStax tentadas retornaram **403 do túnel**;
[evidência das tentativas](transpetro-visuais-fontes.json). Não houve leitura
externa bem-sucedida nesta execução. Não se alega conferência de página, edição
ou cláusula externa. Foram escolhidos modelos expressamente definidos e
resolúveis com os dados fornecidos, sem requisitos finos de NR/ISO nem limites legais.
A verificação bibliográfica externa permanece para a revisão humana. O corpus
normativo anterior não foi alterado.

## Auditoria global e testes

Triagem lexical: **14.190 comparações** (20 × 700 + 190 internas), nenhum alerta
acima do limiar Jaccard 0,60 sobre palavras de mais de três letras. Houve revisão
editorial dirigida dos modelos e distratores. Isso **não prova originalidade
semântica absoluta** nem substitui revisão independente. Nenhuma substituição
foi motivada por alerta de duplicidade.

Resultados efetivamente obtidos:

- **107/107 testes Node aprovados**, incluindo sete novos casos visuais e os
  testes multiconcurso/Transpetro/lotes anteriores. Sem falhas ou skips.
- Validador integral da Etapa 1: 700 itens e matriz original preservados.
- `tests/transpetro-visuais-ui.cjs`: Chromium em 1280 e 390 px, último com toque,
  emulação móvel e escala 2. Os 20 SVG carregaram nos dois tamanhos; zoom 200%,
  rolagem, fechamento, foco, teclado e navegação conferidos. PNG/JPEG/WebP reais
  gerados em memória, múltiplas imagens, legado, ausência de arquivo, contexto de
  grupo, caderno, resultado, histórico e expiração do timer também passaram.
- `tests/transpetro-bank-ui.cjs`: banco real, FULL 70 = 10/10/50, ESP 50,
  PROVA/TREINO, mapa, marcações, 4h30, resultado, histórico, erradas e contexto.
- `tests/transpetro-ui.cjs`: critérios e fluxos com fixtures em memória; aprovado.
- `tests/multiconcurso.cjs`: regressão de navegador ALERO: oito combinações,
  cargos, correção, agrupamento, migração, isolamento, timer e celular aprovados.

- Sem erro JavaScript não tratado ou erro inesperado de console nos testes
  visuais. O 404 deliberado foi observado e tratado, não ocultado como sucesso HTTP.
- Prefixo `/Simulado-Ale-ro/` servido localmente: caminhos relativos aprovados.
  Não houve publicação nem teste do domínio GitHub Pages de produção desta branch.

Problemas de implementação corrigidos: estilos de botão/tag sobrepunham a
ocultação; setas do modal navegavam no simulado ao fundo; término de tempo podia
manter a ampliação sobre o resultado. Os três têm verificação de regressão.
Na montagem inicial dos testes, comandos de navegador apontaram para servidor
inativo e um cenário tentou voltar à configuração antes de finalizar a revisão;
as invocações/fluxo do teste foram corrigidos e reexecutados com sucesso.

## Arquivos

Modificados: app.js, index.html, styles.css, MULTICONCURSO.md;
tests/transpetro-bank.cjs, tests/transpetro-lote6.cjs,
tests/transpetro-lote7.cjs (proteções de regressão descritas acima).

Criados: data/transpetro/pilotos_visuais.json; 20 arquivos
assets/transpetro/visuais/piloto-01.svg a piloto-20.svg;
scripts/build-transpetro-visuals.py; scripts/validate-transpetro-visuais.cjs;
tests/transpetro-visuais.cjs; tests/transpetro-visuais-ui.cjs;
references/transpetro/visuais.md; docs/QUESTOES_VISUAIS.md;
docs/transpetro-visuais-dados.json; docs/transpetro-visuais-auditoria.json;
docs/transpetro-visuais-fontes.json; este relatório;
docs/visuais-preview/desktop.png e mobile.png (capturas de QA).

## Limitações e parecer

Pronto para revisão do piloto, sem autorização para ampliar o banco.
Revisão humana técnica e bibliográfica externa pendente. Não foram testados
Firefox, Safari, aparelho físico, leitor de tela ou comportamento offline sem
cache prévio; não foi adicionado service worker. A aplicação permanece estática,
sem recurso externo necessário ao carregamento. Suporte de acessibilidade foi
implementado, mas não constitui certificação. Apenas Chromium foi automatizado.
Os valores e figuras são didáticos e não servem como laudo, dimensionamento ou
critério legal de segurança.

## Comandos reproduzíveis

```sh
node --check app.js
node scripts/validate-transpetro.cjs
node scripts/validate-transpetro-visuais.cjs
node --test tests/transpetro.cjs tests/transpetro-bank.cjs tests/transpetro-lote4.cjs tests/transpetro-lote5.cjs tests/transpetro-lote6.cjs tests/transpetro-lote7.cjs tests/transpetro-visuais.cjs
# Playwright instalado como ferramenta de desenvolvimento; servidor local ativo.
# Definir SIMULADO_URL=http://127.0.0.1:8008/Simulado-Ale-ro/ em cada execução:
node tests/transpetro-visuais-ui.cjs
node tests/transpetro-bank-ui.cjs
node tests/transpetro-ui.cjs
node tests/multiconcurso.cjs
```
