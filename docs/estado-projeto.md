# Estado do projeto TeachEasy

Atualizado em 18 de agosto de 2026.

## Biblioteca canônica — Ensino Fundamental

- Catálogo único para as 180 combinações oficiais do 1º ao 9º ano, quatro bimestres e cinco disciplinas: Língua Portuguesa, Matemática, Ciências, História e Geografia.
- Todas as 180 coleções possuem exatamente 50 atividades.
- Anos Iniciais: 100 coleções, 5.000 atividades.
- Anos Finais: 80 coleções, 4.000 atividades.
- Ensino Fundamental: 9.000 atividades canônicas.
- Todos os quatro bimestres estão no padrão `teacheasy-v2`, com oito questões e oito respostas por atividade.
- Total do Ensino Fundamental em V2: 72.000 questões e 72.000 respostas.

## Auditoria editorial assistida

- A auditoria automática/assistida percorre as 180 coleções e as 9.000 atividades usando o validador pedagógico V2 e verificações adicionais de unicidade, encoding, BNCC por disciplina e exposição de códigos ao aluno.
- Após as correções encontradas pela auditoria, o resultado é: 180 coleções, 9.000 atividades, 72.000 questões e 72.000 respostas, com zero bloqueios e zero avisos editoriais automáticos.
- Ciências do 4º bimestre recebeu correções de metadados V2 em 450 atividades: título do texto de apoio, verbo central da habilidade BNCC e objetivo pedagógico da ilustração; um texto de apoio curto foi completado sem alteração do código BNCC.
- A atividade de Geografia `efi-4ano-b3-geo-v2-11-materia-prima-ao-produto` foi corrigida para remover duplicação de título/perguntas e tornar texto, questões, gabarito e ilustração específicos ao percurso do algodão até a camiseta.
- Esta auditoria **não é registrada como revisão pedagógica humana**. As 9.000 atividades continuam com revisão humana individual pendente até que um revisor humano efetivamente as confira.

## Produção visual

- As 9.000 atividades continuam com produção visual pendente até que a imagem definitiva seja gerada, conferida e aprovada.
- Existe uma fila canônica por lotes de até 10 atividades, filtrável por ano, bimestre e disciplina, preparada a partir do próprio JSON V2.
- O gerador de lote continua exigindo a referência visual oficial do elenco TeachEasy e não deve sobrescrever imagens existentes sem uso explícito de `--force`.
- Gerar uma imagem não equivale a aprová-la: identidade do elenco, interação com a cena, coerência pedagógica e preservação histórica/cultural ainda precisam de conferência visual.

## Word

- A prontidão de fonte para Word foi auditada nas 180 coleções e 9.000 atividades.
- As coleções canônicas declaram A4, margens de 1 cm, moldura preta e gabarito separado; os metadados ausentes encontrados em coleções antigas de Português/Matemática foram completados.
- O gerador `scripts/generate-fundamental-word.ps1` exporta os cinco componentes do 1º ao 9º ano e os quatro bimestres usando apenas os JSONs canônicos V2.
- A inspeção visual final dos `.docx` ainda precisa ser feita em Windows com Microsoft Word, pois a exportação usa Word COM e os arquivos de `exports/` não são a fonte versionada da Biblioteca.

## Quarto bimestre V2

- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas.
- História do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas.
- Geografia do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas.
- Língua Portuguesa do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas.
- Matemática do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas.

## Primeiro ao terceiro bimestre V2

- 1º, 2º e 3º bimestres foram migrados integralmente para V2: 135 coleções, 6.750 atividades, 54.000 questões e 54.000 respostas.
- A migração preserva conteúdo específico aproveitável e substitui resíduos genéricos incompatíveis com o validador V2.
- Os códigos BNCC já associados às coleções foram preservados; a validação automática não equivale a uma nova revisão humana individual de cada habilidade.

## Pendências que exigem execução humana ou serviço externo

- Revisão pedagógica humana individual das 9.000 atividades e habilidades BNCC.
- Geração e aprovação visual das ilustrações definitivas ainda pendentes.
- Geração e conferência visual dos documentos Word exportados em Windows/Microsoft Word.

## Regra de manutenção

Nenhuma nova coleção deve ser criada como arquivo `extra`, lote paralelo ou exportação Word isolada. A alteração deve entrar no JSON canônico indicado pelo catálogo e passar pela suíte de testes antes de publicação.
