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
- Revisão pedagógica humana individual e produção visual definitiva continuam pendentes onde os JSONs assim indicam.

## Quarto bimestre V2

- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. A revisão pedagógica humana e a produção visual definitiva permanecem pendentes.
- História do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos foram conferidos contra a BNCC oficial do MEC; revisão pedagógica humana e produção visual definitiva permanecem pendentes.
- Geografia do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos foram conferidos contra a BNCC oficial do MEC; revisão pedagógica humana e produção visual definitiva permanecem pendentes.
- Língua Portuguesa do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. O conteúdo passou pela validação automática; a revisão pedagógica humana e a produção das imagens definitivas permanecem identificadas nos JSONs.
- Matemática do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas organizadas por domínio matemático. A revisão pedagógica humana e a produção das imagens definitivas permanecem identificadas nos JSONs.

## Primeiro ao terceiro bimestre V2

- 1º, 2º e 3º bimestres foram migrados integralmente para V2: 135 coleções, 6.750 atividades, 54.000 questões e 54.000 respostas.
- A migração preserva conteúdo específico aproveitável e substitui resíduos genéricos incompatíveis com o validador V2.
- Os códigos BNCC já associados às coleções foram preservados; esta migração automática não equivale a uma nova revisão humana individual de cada habilidade.
- O 4º bimestre não foi alterado por esta migração.

## Pendente editorial — não confundir com ausência de arquivo

- Conferir pedagogicamente, uma a uma, as habilidades BNCC; presença de código no JSON e validação automática não equivalem a revisão humana concluída.
- Produzir e aprovar as imagens relacionadas ao texto onde os metadados ainda não possuem arquivo visual definitivo.
- Conferir os documentos Word exportados; `exports/` não é a fonte da Biblioteca e não substitui o JSON canônico.

## Regra de manutenção

Nenhuma nova coleção deve ser criada como arquivo `extra`, lote paralelo ou exportação Word isolada. A alteração deve entrar no JSON canônico indicado pelo catálogo e passar pela suíte de testes antes de publicação.
