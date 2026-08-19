# Pipeline de produção de ilustrações do TeachEasy

Este pipeline é separado do site e da Vercel. Ele lê os JSONs V2 do projeto, cria uma fila local, monta o prompt pedagógico, decide se a cena realmente precisa de personagens oficiais e gera somente os itens pendentes.

## Princípio visual

A composição segue a regra:

`PERSONAGENS OFICIAIS QUANDO NECESSÁRIOS + ESTILO TEACHEASY + CENA DA ATIVIDADE + REGRAS PEDAGÓGICAS + RESTRIÇÕES`

Os quatro personagens não são obrigatórios. O pipeline pode usar nenhum, um, dois, três ou quatro personagens conforme a necessidade da cena. Nino só entra quando o conteúdo justificar.

A referência visual oficial continua sendo `public/illustrations/reference/teacheasy-official-cast.png`. A referência de composição aprovada pelo projeto orienta cenas vivas, integradas e naturais: personagens ativos, variedade de ações e profundidade visual, sem copiar literalmente uma cena específica.

## Segurança pedagógica

- A imagem não pode revelar a resposta da atividade.
- Representações como mapas, gráficos, diagramas e linhas do tempo podem ser produzidas sem o elenco TeachEasy.
- Personagens usados devem participar da ação e não ficar apenas posados.
- Em cenas históricas ou culturais, o elenco TeachEasy não substitui povos ou personagens históricos.
- Não duplicar personagens.
- Não alterar rosto, cabelo, óculos, roupas-base ou identidade dos personagens oficiais.
- Não acrescentar objetos, animais ou pessoas apenas para preencher a imagem.

## Modelo

O pipeline usa `gpt-image-2-2026-04-21`, via API de imagens. Quando a cena precisa do elenco, usa edição com fidelidade alta e a referência oficial. Quando não precisa, usa geração de imagem sem referência do elenco.

A chave deve ficar somente na variável de ambiente `OPENAI_API_KEY`. Nenhuma chave é gravada no repositório ou no manifesto.

## Diretório de trabalho

A fila e as imagens geradas ficam em:

`var/illustration-production/`

Esse diretório é ignorado pelo Git. Assim, milhares de PNGs não aumentam o repositório.

## Fluxo recomendado

Primeiro montar apenas uma atividade piloto e revisar o prompt, sem gerar imagem:

```powershell
npm run illustrations:manifest -- --stage "Ensino Médio" --grade "1ª série" --term 1 --subject "Ciências" --limit 1
npm run illustrations:prompt
```

Depois de aprovar o prompt, gerar somente a primeira imagem:

```powershell
npm run illustrations:generate -- --limit 1
```

Conferir o andamento:

```powershell
npm run illustrations:status
```

Quando o padrão estiver aprovado, recriar o manifesto com o lote desejado. O pipeline reaproveita os status existentes pelo ID da atividade e não regenera arquivos já concluídos, salvo com `--force`.

## Filtros disponíveis

- `--stage`
- `--grade`
- `--term`
- `--subject`
- `--id`
- `--limit`
- `--force`

## Estados da fila

- `pendente`: ainda precisa ser gerada;
- `gerando`: chamada em andamento;
- `gerada`: arquivo criado;
- `erro`: falha definitiva a revisar;
- `revisar`: reservada para revisão visual posterior.

O manifesto é salvo após cada atividade. Se o processo for interrompido, basta executar novamente o comando de geração para continuar do ponto em que parou.
