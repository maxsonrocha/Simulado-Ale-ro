# Auditoria tripla — Base normativa Transpetro 2026

Data de referência: 03/11/2026.

Arquivos auditados:
- `README.md`
- `fontes.json`
- `INSTRUCOES_CODEX.md`
- `MATRIZ_ASSUNTOS.md`

## Auditoria 1 — Estrutura e consistência interna

Resultado: APROVADO.

Verificações realizadas:
- estrutura do `fontes.json` revisada e coerente com `schemaVersion: 1`;
- IDs de fontes e referências em `mapaAssuntos` conferidos entre si;
- os 11 blocos específicos estão representados no mapa/matriz;
- NRs prioritárias são coerentes entre README, JSON e matriz;
- NR-02 e NR-27 estão marcadas como revogadas, sem tratamento como normas vigentes;
- regras de 403, vigência, ISO/ABNT, eSocial e auditoria não se contradizem entre os arquivos;
- não foram encontrados comandos que autorizem preenchimento normativo por memória do modelo.

## Auditoria 2 — Conferência normativa em fontes oficiais

Resultado: APROVADO COM RESSALVA OPERACIONAL DE ACESSO.

Pontos conferidos em fontes oficiais:
- MTE: índice de NRs vigentes e títulos das NRs prioritárias;
- MTE: NR-02 revogada integralmente em 2019;
- MTE: NR-27 revogada integralmente em 2008;
- MTE: nova redação do capítulo 1.5 da NR-1 em vigor desde 26/05/2026;
- MTE: existência do Manual de interpretação e aplicação do capítulo 1.5 da NR-1 de 2026;
- Fundacentro: repositório oficial das Normas de Higiene Ocupacional (NHO);
- eSocial: documentação técnica S-1.3 em 2026;
- eSocial: S-2210 = Comunicação de Acidente de Trabalho;
- eSocial: S-2220 = Monitoramento da Saúde do Trabalhador;
- eSocial: S-2230 = Afastamento Temporário;
- eSocial: S-2240 = Condições Ambientais do Trabalho - Agentes Nocivos;
- Planalto: Lei 8.213/1991 localizada em texto compilado oficial.

Ressalva operacional:
- alguns endpoints do Planalto e do acervo IBAMA/CONAMA podem bloquear determinados ambientes automatizados. Isso não invalida a referência, mas impede que o Codex trate o simples URL cadastrado como prova suficiente do conteúdo. Quando houver bloqueio, permanece obrigatória a regra de não criar requisito, prazo, limite, artigo, item ou exceção sem acesso verificável a uma representação oficial.

## Auditoria 3 — Revisão cruzada e risco de erro de geração

Resultado: APROVADO.

Verificações realizadas:
- cruzamento `README.md` x `fontes.json` x `INSTRUCOES_CODEX.md` x `MATRIZ_ASSUNTOS.md`;
- nenhuma fonte protegida ISO/ABNT é autorizada a ser copiada integralmente;
- nenhuma cláusula ISO pode ser inventada quando não houver fonte licenciada/verificável;
- a matriz não transforma todas as NRs em assuntos de peso igual;
- questões quantitativas exigem resolução e segunda resolução independente;
- questões normativas exigem fonte vigente e verificação de exceções;
- regras do eSocial são consistentes nos arquivos;
- desenvolvimento sustentável permanece tratado de forma conservadora, sem inventar obrigação normativa específica;
- fontes inacessíveis não podem ser substituídas por memória do modelo;
- o protocolo exige auditoria estrutural, de conteúdo e global de cada lote de questões.

## Conclusão

A base normativa está aprovada para orientar geração e auditoria de questões, com uma condição obrigatória: cadastro de URL não equivale a validação do conteúdo. Toda afirmação normativa decisiva da questão deve ser efetivamente conferida em fonte oficial vigente e acessível no momento da criação/revisão.

Nenhum erro factual objetivo foi identificado nas afirmações verificadas durante estas três passagens. A base deve ser revisada novamente sempre que houver atualização normativa ou mudança relevante na documentação oficial durante a construção do banco.