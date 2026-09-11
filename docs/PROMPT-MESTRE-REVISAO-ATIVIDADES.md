# PROMPT MESTRE — TEACHEASY

## Revisão completa de atividades + imagens + BNCC + publicação

### Objetivo
Revisar e corrigir todas as atividades do lote informado, seguindo exatamente o padrão de qualidade aprovado na atividade **“Lendas brasileiras / O Curupira”**.

## Lote atual
- Ano: 4º ano
- Bimestre: 4º bimestre
- Disciplina: Língua Portuguesa
- Quantidade esperada: 50 atividades
- Questões por atividade: 8
- Respostas no gabarito: 8

## Repositório
- GitHub: `cunhadalbert-cmyk/TeachEasy`
- Arquivo principal: `data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/lingua-portuguesa.json`
- Pasta das imagens: `assets/atividades/lingua-portuguesa/4ano-4b/`

---

## 1. Regra principal
Não tratar as atividades apenas pelo título. Ler e revisar o conjunto completo:
- título;
- tema;
- objetivo;
- BNCC;
- texto de apoio;
- instrução;
- questões;
- gabarito;
- ilustração;
- descrição da ilustração;
- texto alternativo;
- relação pedagógica entre todos esses elementos.

## 2. Padrão pedagógico
Cada atividade deve apresentar uma situação concreta, clara e adequada a uma criança do 4º ano.

A linguagem destinada ao aluno deve ser simples, natural e escolar.

Evitar linguagem técnica desnecessária.

Não colocar no texto do aluno:
- explicação de código BNCC;
- linguagem de planejamento pedagógico;
- frases genéricas como “esta proposta desenvolve a habilidade...”;
- textos artificiais criados apenas para encaixar uma habilidade.

O título, o texto e as perguntas precisam falar do mesmo assunto.

Não reutilizar automaticamente situações como feira de ciências, produção de notícia, comunidade escolar, situação comunicativa ou gênero textual quando isso não fizer parte naturalmente do tema.

## 3. Texto de apoio
Criar ou corrigir o texto para que:
- tenha coerência com o título;
- tenha vocabulário adequado ao 4º ano;
- tenha informações suficientes para responder às questões;
- não seja excessivamente longo;
- tenha começo, desenvolvimento e conclusão quando for narrativa;
- traga exemplos concretos quando o conteúdo for linguístico;
- evite repetição artificial.

Quando houver personagens, manter nomes, ações e características consistentes do começo ao fim.

## 4. Questões
Cada atividade deve ter exatamente 8 questões.

As questões devem ser baseadas realmente no texto ou conteúdo apresentado.

Distribuir, quando adequado:
- localização de informação;
- compreensão;
- características;
- relação de ideias;
- interpretação;
- vocabulário ou recurso linguístico;
- reflexão;
- pequena produção escrita.

Não criar pergunta cuja resposta não esteja no texto ou não possa ser inferida adequadamente.

Não criar perguntas genéricas que poderiam servir para qualquer atividade.

Não repetir praticamente a mesma pergunta duas vezes.

## 5. Gabarito
Cada atividade deve ter exatamente 8 respostas.

Cada resposta deve corresponder exatamente à questão de mesmo número.

Quando houver questão aberta, indicar uma resposta pessoal coerente com o texto e explicar os elementos mínimos esperados.

As justificativas precisam ser objetivas e pedagogicamente corretas.

### BNCC no gabarito
O gabarito também deve exibir a BNCC da atividade.

Mostrar no gabarito:
- código BNCC;
- habilidade;
- respostas 1 a 8.

Usar a mesma fonte de dados BNCC da atividade para o gabarito, evitando duplicação manual que possa gerar divergência.

**Regra:** BNCC da atividade = BNCC exibida no gabarito.

Nunca permitir código diferente entre atividade e gabarito.

## 6. BNCC
Conferir cada habilidade individualmente.

Não escolher uma habilidade apenas porque o número parece próximo da atividade.

A habilidade deve corresponder efetivamente ao que o aluno realiza.

Verificar:
- código;
- descrição oficial;
- ano/faixa escolar;
- conteúdo trabalhado;
- ação cognitiva proposta pelas questões.

Preferir fonte oficial da BNCC/MEC.

Não alterar o texto oficial da habilidade sem necessidade.

Uma atividade pode utilizar mais de uma habilidade quando pedagogicamente justificado, sem exagerar na quantidade.

## 7. Imagens
A imagem deve representar a atividade que o aluno está lendo.

Ler primeiro o texto completo e somente depois definir ou gerar a imagem.

A imagem deve mostrar uma ação concreta do texto.

Exemplo: se o texto disser “Ana leu uma lenda com sua turma”, a imagem deve mostrar Ana, a turma, o livro e a situação de leitura.

Não mostrar apenas um aluno quando o texto diz que a turma está participando.

Manter aparência infantil, colorida e profissional no padrão TeachEasy.

Evitar:
- objetos deformados;
- livros estranhos;
- mãos impossíveis;
- perspectiva incorreta;
- personagem olhando para algo que não consegue ver;
- texto ilegível dentro da imagem;
- elementos que contradigam a atividade.

Quando houver um livro aberto:
- formato normal;
- páginas naturais;
- perspectiva correta;
- orientação coerente para quem está lendo.

Não colocar fundo complexo quando ele não for necessário.

Quando adequado, utilizar fundo transparente para integrar melhor à folha da atividade.

Não gerar texto escrito dentro da imagem, salvo quando pedagogicamente indispensável.

A imagem precisa funcionar também em impressão.

## 8. Consistência entre texto e imagem
Antes de aprovar cada atividade, conferir:
- título combina com o texto?
- texto combina com as questões?
- questões podem ser respondidas?
- gabarito responde exatamente às questões?
- BNCC corresponde à habilidade realmente trabalhada?
- imagem mostra a situação descrita?
- personagens correspondem aos nomes e ações do texto?
- ambiente corresponde ao texto?

Se qualquer resposta for não, corrigir antes de continuar.

## 9. Estrutura do JSON
Preservar a estrutura esperada pelo TeachEasy.

Não quebrar:
- IDs;
- caminhos das figuras;
- `quantidadeQuestoes`;
- `possuiFiguras`;
- `figuras`;
- `possuiGabarito`;
- `textoApoio`;
- `questoes`;
- `gabarito`;
- `revisao`;
- `versaoAdaptada`.

Manter exatamente 50 atividades.

Manter exatamente 8 questões e 8 itens de gabarito em cada atividade deste lote.

Salvar JSON válido em UTF-8.

Evitar problemas de BOM. Se houver BOM, garantir compatibilidade do validador ou removê-lo de forma segura.

## 10. Arquivos que não devem ser alterados
Não adicionar ao commit arquivos não relacionados ao lote.

Ignorar:
- backups;
- pastas de recuperação;
- arquivos `.bundle`;
- `var/`;
- arquivos temporários;
- cópias `ANTES-CORRECAO`;
- documentos modificados localmente sem relação com esta revisão.

Nunca usar `git add .`.

Adicionar somente arquivos explicitamente relacionados à correção.

## 11. Validação antes de publicar
Antes de publicar, conferir automaticamente:
- total de atividades = 50;
- `quantidadeQuestoes = 8`;
- `questoes.length = 8`;
- `gabarito.length = 8`.

Conferir também:
- JSON válido;
- IDs duplicados;
- caminhos das figuras;
- arquivos de imagem existentes;
- formato das imagens;
- correspondência `figuraId`;
- BNCC;
- gabarito;
- caracteres inválidos;
- BOM;
- sintaxe.

Executar:

```bash
npm run validate
```

Não publicar enquanto houver erro real de validação.

Se o teste falhar:
1. ler o log;
2. localizar a causa exata;
3. corrigir a causa;
4. executar novamente;
5. continuar somente quando estiver verde.

## 12. Fluxo Git correto
Nunca tentar publicar diretamente na `main` protegida.

Fluxo obrigatório:
1. `git fetch origin --prune`;
2. criar ou usar uma branch específica para o lote;
3. adicionar somente os arquivos corrigidos;
4. commit com descrição clara;
5. push da branch;
6. criar Pull Request para `main`;
7. aguardar GitHub Actions;
8. verificar `HTML, JavaScript and functional tests`;
9. verificar Vercel Preview;
10. se houver erro, corrigir na mesma branch e atualizar o mesmo PR;
11. somente quando os checks estiverem verdes, fazer merge na `main`.

## 13. Publicação Vercel
Depois do merge:
- confirmar que a Vercel iniciou deployment da branch `main`;
- verificar `target = production`;
- verificar `state = READY`;
- confirmar que o deployment contém o commit novo;
- abrir a versão de produção.

Não considerar o trabalho concluído apenas porque a Preview está READY.

**Preview ≠ Produção.**

O trabalho termina somente quando:
- PR estiver merged;
- `main` estiver atualizada;
- deployment de produção estiver READY;
- site de produção abrir corretamente.

## 14. Verificação visual final
Depois da publicação, abrir a Biblioteca e verificar uma amostra das atividades.

Obrigatoriamente verificar:
- Atividade 1;
- atividades do meio do lote;
- Atividade 50.

Na atividade, verificar:
- imagem aparece;
- texto aparece;
- 8 questões aparecem;
- gabarito aparece;
- BNCC aparece no gabarito;
- nenhuma informação antiga permanece;
- não existem imagens trocadas.

## 15. Padrão de referência
Usar como referência de qualidade a atividade:
- **“Lendas brasileiras”**
- texto: **“O Curupira”**

Padrão aprovado:
- texto curto e claro;
- personagem definido;
- situação concreta;
- turma participando;
- perguntas diretamente relacionadas ao texto;
- gabarito correto;
- BNCC adequada;
- imagem representando exatamente a cena.

Não copiar a história do Curupira para as demais atividades. Copiar apenas o padrão de qualidade e coerência.

## 16. Regra final
Não declarar “terminado”, “publicado”, “sem erros” ou “está na produção” sem verificar tecnicamente.

Sempre distinguir:
- LOCAL;
- BRANCH;
- PREVIEW;
- MAIN;
- PRODUÇÃO.

Ao final, informar objetivamente:
- Atividades revisadas: X/50
- Questões validadas: X
- Gabaritos validados: X
- BNCC conferidas: X
- Imagens conferidas: X
- Testes: PASS/FAIL
- PR: número
- Merge: SIM/NÃO
- Vercel Preview: READY/FAIL
- Vercel Production: READY/FAIL
- Commit de produção: SHA

Não pular nenhuma etapa.
