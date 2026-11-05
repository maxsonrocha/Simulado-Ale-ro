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

## Piloto separado do banco regular

Transpetro → Engenharia de Segurança do Trabalho → **Piloto visual (20)**.
São 20 ESP em `data/transpetro/pilotos_visuais.json`, com
`piloto_visual: true` e IDs `TP26-VIS-ESP-0001` a `0020`.

- FULL/ESP continuam carregando somente os 700 itens anteriores.
- VISUAIS carrega apenas os 20 pilotos. Não conta como expansão da Etapa 1/2.
- ERRADAS busca também o arquivo piloto quando há um ID de piloto salvo.
- Os IDs diferentes preservam ciclos de seleção independentes dentro do mesmo
  concurso/cargo; renovar o conjunto visual não apaga IDs vistos do banco regular.
- Histórico registra o formato `VISUAIS`; assim como outros parciais, participa
  das estatísticas do cargo. Não recebe aprovação de prova completa.
- O timer continua usando os 270 minutos já configurados para Transpetro,
  inclusive nos parciais; não foi inventada duração oficial de uma prova de 20.

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
