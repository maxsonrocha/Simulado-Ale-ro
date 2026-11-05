# Questões com recursos visuais

## JSON e caminhos

`imagens` é opcional. Questões sem esse campo continuam textuais. O campo aceita
uma lista ordenada de objetos; cada figura aparece depois do enunciado e antes
das alternativas, inclusive na revisão de erros. Exemplo de campo do piloto 01:

```json
"imagens": [
  {
    "src": "assets/transpetro/visuais/piloto-01.svg",
    "alt": "Barras: 70 dB por 2 h; 80 dB por 3 h; 90 dB por 1 h. Eixo vertical: duração em horas, origem zero.",
    "legenda": "Distribuição temporal de níveis sonoros",
    "largura": 900,
    "altura": 500
  }
]
```

- `src`: caminho relativo ao **index.html**, não à pasta do JSON. SVG, PNG,
  JPG/JPEG e WebP locais. Use nomes sem espaços/acentos, segmentos alfanuméricos,
  hífen, sublinhado ou ponto; não use URLs externas, `..`, parâmetros ou fragmentos.
- `alt`: obrigatório e não vazio; descrever todos os dados necessários para
  resolver a questão. Não revelar a alternativa correta.
- `legenda`: texto opcional. Sem legenda, a interface numera as figuras.
- `largura` e `altura`: inteiros positivos opcionais; reservar a proporção
  original reduz deslocamentos durante o carregamento.

A ordem da lista é a ordem de apresentação. O campo legado `image` continua
aceitando o nome relativo a `assets/`, inclusive o prefixo já usado pelo projeto.
Quando `imagens` existe como lista, tem precedência; `[]` significa nenhuma figura.
Não inserir SVG/HTML como texto no JSON. O SVG deve ser um arquivo revisado,
sem scripts, eventos, recursos externos ou `foreignObject`.

## Leitura e ampliação

As imagens usam carregamento preguiçoso e decodificação assíncrona. O tamanho
acompanha a largura disponível. Clicar/tocar abre um diálogo nativo com zoom
entre 100% e 400% da largura ajustada e rolagem para detalhes. Fechar ou Escape
restaura o foco. Setas não navegam no simulado enquanto a figura está ampliada.
Mudança de tela, inclusive término do tempo, fecha a ampliação.

A descrição textual também fica disponível em um painel expansível. Se o arquivo
falhar, o painel abre automaticamente e surge “Figura indisponível”. Não se inicia
outra requisição em ciclo. Legendas e descrições são inseridas como texto, não HTML.
O diálogo requer navegador moderno com suporte a `<dialog>`.

## Grupos, correção e persistência

O agrupamento existente não muda. Se uma dependente usar o contexto da questão
base, esse contexto leva também as figuras da base. As imagens próprias e as
herdadas são preservadas no caderno de erradas e na revisão do resultado.
IDs, ordem de grupos, sorteio, regras, timer e chaves de localStorage permanecem.
Não há um segundo mecanismo de grupos ou um novo tipo de pontuação.

## Integração dos 20 pilotos ao banco regular

A opção independente VISUAIS foi retirada na Etapa 2/lote 1. O arquivo
`data/transpetro/pilotos_visuais.json` permanece intacto, carregado uma única vez
junto dos bancos regulares em FULL, ESP e ERRADAS. IDs `TP26-VIS-ESP-0001` a
`0020`, figuras e metadados originais continuam válidos. O indicador de origem
na questão continua disponível; não há formato separado para iniciá-las.

O lote novo está em `data/transpetro/etapa2/lote1.json`: 100 ESP, das quais
45 têm imagens. O lote2 acrescenta100ESP em `data/transpetro/etapa2/lote2.json`,45 com imagens.
O banco atual tem920:100PORT,100ING e720ESP, com110 recursos visuais.
A completa continua 10/10/50 e o específico 50; duração continua 270 minutos.
Os resultados antigos com `type: "VISUAIS"` não são reescritos. O caderno encontra
os mesmos IDs antigos no carregamento regular. Não há migração destrutiva,
renumeração ou cópia de questões entre arquivos.

As fontes adicionais possuem `etapa: 2` na configuração do carregador. O validador
histórico da Etapa 1 mantém seu snapshot estrito de 700; o auditor da Etapa 2
valida seu snapshot de820. O auditor do lote2 valida o banco regular atual920. Não se alteraram quotas históricas para
ocultar uma contagem incorreta. Ver o [relatório da integração](transpetro-etapa2-lote1-relatorio.md).

## Manutenção e verificações

`python scripts/build-transpetro-visuals.py` reproduz apenas os 20 SVG, o JSON
piloto e o manifesto de dados. Python é ferramenta opcional de autoria; a aplicação
publicada continua HTML/CSS/JavaScript, sem backend ou dependência de produção.

```sh
node scripts/validate-transpetro-visuais.cjs
node --test tests/transpetro-visuais.cjs
# Com servidor na raiz /workspace, fornecendo o prefixo do projeto:
SIMULADO_URL=http://127.0.0.1:8008/Simulado-Ale-ro/ node tests/transpetro-visuais-ui.cjs
```

Os dados são hipotéticos, com critérios internos explícitos. Não representam
limites legais, laudos ou liberação operacional. Ver [fundamentos e limitações](../references/transpetro/visuais.md)
e [relatório de validação](transpetro-visuais-relatorio.md).
