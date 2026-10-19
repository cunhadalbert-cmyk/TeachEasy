## ATUALIZAÇÃO — Auditoria automática integral executada em 19/10/2026

- GitHub Actions: **248 testes aprovados, zero falhas**.
- Scanner específico percorreu **100 coleções / 5.000 atividades**.
- **4.468 atividades sem figura vinculada** (`NO_LINKED_FIGURE`).
- **4.900 atividades com ilustração marcada `producao-visual-pendente`**.
- O scanner não encontrou bloqueios de contagem de questões, gabarito vazio, arquivo JSON inválido ou texto completamente vazio nas 100 coleções. Isto NÃO atesta correção didática.
- O teste automatizado não abre as 5.000 imagens para validar coerência visual/semântica, nem verifica a validade individual de cada habilidade BNCC.
- Correção técnica adicional: ampliadas as respostas 3 e 7 da atividade piloto de alfabeto; CI voltou a passar.
- **Publicação bloqueada** até conclusão da produção visual, correção semântica e aprovação pedagógica.
- Execução: https://github.com/cunhadalbert-cmyk/TeachEasy/actions/runs/39320152299
- PR em rascunho: https://github.com/cunhadalbert-cmyk/TeachEasy/pull/211

# Auditoria pedagógica e visual — Ensino Fundamental 1º ao 5º ano
Data: 19/10/2026
Branch de trabalho: `audit/coerencia-fundamental-1a5-out2026`
Fonte: JSON canônicos da branch `main`. **Não publicar sem revisão e testes.**

## Escopo
- Inventário da árvore Git: **100 coleções canônicas** do 1º ao 5º ano (5 anos × 4 bimestres × 5 disciplinas).
- Inspeção de conteúdo executada: **30 coleções (1.500 atividades)**: 25 coleções do 1º bimestre, todas as disciplinas e anos; mais cinco coleções de Língua Portuguesa do 2º bimestre.
- **1.350 das 1.500 atividades inspecionadas não têm figura vinculada** (`figuras: []`). Dessas, 1.100 pertencem às 25 coleções do primeiro bimestre e 250 à Língua Portuguesa do segundo bimestre.
- Nas 30 coleções verificadas os metadados `producaoVisual` e `revisaoPedagogicaHumana` estão como `pendente`.
- As outras 70 coleções ainda precisam de leitura individual. Não extrapolar o número de imagens ausentes para elas.

## Separação dos achados
**CONFIRMADO — produção visual ausente:** 1.350 atividades sem figuras vinculadas, nos arquivos efetivamente lidos. Não é sinônimo de arquivo de imagem inexistente em todo o repositório; pode existir arte fora da associação canônica.

**CONFIRMADO — exemplo editorial inadequado:** `data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/lingua-portuguesa.json`, atividade `efi-1ano-b1-lingua-portuguesa-01-leitura-e-compreensao-alfabeto`: texto abstrato e repetitivo para início de alfabetização; solicitações genéricas não sustentadas por texto concreto; respostas genéricas. Necessita reescrita integrada ao desenho.

**PENDENTE — inspeção visual:** ver imagem realmente produzida, corrigir sua relação com texto, perguntas e gabarito; checar personagens, referências culturais, legibilidade e layout impresso.

**PENDENTE — execução da suíte e revisão pedagógica:** relatórios existentes são históricos e não atestam conferência visual individual. O arquivo `docs/estado-projeto.md` declara explicitamente essas pendências.

## Lotes inspecionados — figuras ausentes / 50 atividades
| Ano | 1º bi — Ciências | 1º bi — Geografia | 1º bi — História | 1º bi — Português | 1º bi — Matemática | 2º bi — Português |
|---|---:|---:|---:|---:|---:|---:|
| 1º | 50 | 50 | 50 | 50 | 20 | 50 |
| 2º | 50 | 50 | 50 | 50 | 20 | 50 |
| 3º | 50 | 50 | 50 | 50 | 20 | 50 |
| 4º | 50 | 50 | 50 | 50 | 20 | 50 |
| 5º | 50 | 50 | 50 | 50 | 20 | 50 |

## Próximos passos e critérios de aprovação
1. Completar as 70 coleções restantes com inventário por ID.
2. Para cada atividade: verificar título ↔ texto ↔ comandos ↔ respostas e habilidade BNCC.
3. Gerar ou associar imagem correta; **inspecionar a imagem realmente renderizada**, não aprovar pelo nome do arquivo.
4. Corrigir apenas atividades com achados confirmados em branch de trabalho; não sobrescrever acertos.
5. Executar `npm run validate`, testes Word/PDF/A4 e aprovação pedagógica antes de qualquer PR à main.
6. Manter a `main` e a implantação de produção intactas até aprovação explícita.

Status: **auditoria parcial, sem aprovação final**.
