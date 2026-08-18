# Estado do projeto TeachEasy

Atualizado em 18 de agosto de 2026.

## Fonte oficial da Biblioteca

- O catálogo canônico é `library-catalog.js`.
- Escopo obrigatório: 1º ao 9º ano, quatro bimestres e cinco disciplinas.
- Disciplinas: Língua Portuguesa, Matemática, Ciências, História e Geografia.
- Total estrutural: 180 combinações únicas (100 dos Anos Iniciais e 80 dos Anos Finais).
- Cada combinação aponta para exatamente um JSON canônico.
- O carregamento das coleções ocorre somente em `biblioteca.js`. `biblioteca-fixes.js` não possui mais um segundo carregador.

## Consolidação concluída

- Os arquivos `*-extra.json` de Ciências, Matemática e Língua Portuguesa do 4º ano/3º bimestre foram incorporados aos respectivos arquivos canônicos.
- Os três lotes separados de Geografia V2 do 4º ano/3º bimestre foram incorporados a `geografia.json`.
- Inglês e Arte foram retirados do escopo da Biblioteca do Ensino Fundamental.
- A validação automatizada impede combinações ausentes, caminhos duplicados, IDs repetidos e coleções sem BNCC ou gabarito.
- O padrão visual existente preserva folha A4, margens e moldura preta.

## Conteúdo confirmado no repositório

- Anos Iniciais: 5.000 atividades canônicas; todas as 100 coleções possuem 50 atividades.
- Anos Finais: 4.000 atividades canônicas; todas as 80 coleções possuem 50 atividades.
- Geografia do 4º ano/3º bimestre: 20 atividades V2, oito questões e oito respostas por atividade.
- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos e o pertencimento ao ano/disciplina foram validados automaticamente contra a BNCC oficial do MEC; a revisão pedagógica humana e a produção das imagens definitivas permanecem pendentes.
- História do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos foram conferidos contra a BNCC oficial do MEC; revisão pedagógica humana e produção visual definitiva permanecem pendentes.
- Geografia do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos foram conferidos contra a BNCC oficial do MEC; revisão pedagógica humana e produção visual definitiva permanecem pendentes.
- Língua Portuguesa do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. O conteúdo passou pela validação automática; a revisão pedagógica humana e a produção das imagens definitivas permanecem identificadas nos JSONs.
- Matemática do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas organizadas por domínio matemático. A revisão pedagógica humana e a produção das imagens definitivas permanecem identificadas nos JSONs.

- Ensino Fundamental totaliza 9.000 atividades canônicas nas 180 combinações oficiais do catálogo.

- 1º, 2º e 3º bimestres também migrados integralmente para V2: 135 coleções, 6.750 atividades, 54.000 questões e 54.000 respostas.
- Todas as 180 coleções do Ensino Fundamental permanecem com 50 atividades; revisão pedagógica humana e produção visual seguem pendentes onde indicado.

## Pendente editorial — não confundir com ausência de arquivo

- Migrar as demais coleções dos Anos Iniciais do schema 1.0 (seis questões) para o V2 (oito questões).
- Conferir pedagogicamente, uma a uma, as habilidades BNCC; presença de código no JSON não equivale a revisão humana concluída.
- Produzir e aprovar as imagens relacionadas ao texto onde os metadados ainda não possuem arquivo visual definitivo.
- Conferir os documentos Word exportados, inclusive História do 4º ano/4º bimestre, porque `exports/` não é a fonte da Biblioteca e não substitui o JSON canônico.

## Regra de manutenção

Nenhuma nova coleção deve ser criada como arquivo `extra`, lote paralelo ou exportação Word isolada. A alteração deve entrar no JSON canônico indicado pelo catálogo e passar pela suíte de testes antes de publicação.
