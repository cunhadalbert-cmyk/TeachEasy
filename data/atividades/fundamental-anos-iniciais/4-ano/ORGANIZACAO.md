# Organização oficial — 4º ano

Esta pasta é a fonte canônica do conteúdo pedagógico do 4º ano do Ensino Fundamental — Anos Iniciais.

## Estrutura obrigatória

```text
data/atividades/fundamental-anos-iniciais/4-ano/
├── 1-bimestre/
│   ├── lingua-portuguesa.json
│   ├── matematica.json
│   ├── ciencias.json
│   ├── historia.json
│   └── geografia.json
├── 2-bimestre/
│   ├── lingua-portuguesa.json
│   ├── matematica.json
│   ├── ciencias.json
│   ├── historia.json
│   └── geografia.json
├── 3-bimestre/
│   ├── lingua-portuguesa.json
│   ├── matematica.json
│   ├── ciencias.json
│   ├── historia.json
│   └── geografia.json
└── 4-bimestre/
    ├── lingua-portuguesa.json
    ├── matematica.json
    ├── ciencias.json
    ├── historia.json
    └── geografia.json
```

## Regra pedagógica

Cada atividade deve seguir esta cadeia de validação:

**ano → disciplina → bimestre → objeto/conteúdo de aprendizagem → habilidade BNCC → texto/exemplo → questões → gabarito**

A BNCC é a referência obrigatória das habilidades, mas a distribuição em bimestres é uma organização pedagógica do TeachEasy. A numeração das habilidades não deve ser interpretada como uma ordem cronológica de ensino.

## Disciplinas oficiais do 4º ano no TeachEasy

1. Língua Portuguesa
2. Matemática
3. Ciências
4. História
5. Geografia

Não criar cópias paralelas dos JSONs dessas disciplinas em `assets/`. Dados pedagógicos ficam em `data/atividades`; imagens e demais recursos visuais ficam em `assets/atividades`.

## Padrão de revisão BNCC

Antes de publicar ou revisar uma atividade, conferir:

1. O tema é adequado ao ano e ao bimestre planejado.
2. A habilidade BNCC indicada realmente corresponde ao que a atividade trabalha.
3. O texto de apoio ensina ou contextualiza o conteúdo necessário.
4. As questões podem ser respondidas com base no texto, imagem, dados ou conhecimentos solicitados.
5. O nível de complexidade é adequado ao 4º ano.
6. O gabarito responde exatamente ao que foi perguntado.
7. Não há repetição artificial da mesma habilidade ou do mesmo enunciado apenas com troca de palavras.
8. Quando houver ilustração, ela deve apoiar a aprendizagem e permanecer vinculada à atividade correta.

## Recursos visuais

Arquivos de imagem pertencem a `assets/atividades/` e devem ser organizados por disciplina. O JSON pedagógico pode referenciar o recurso visual pelo caminho público correspondente, sem duplicar o conteúdo da atividade na pasta de assets.

## Arquivos `*-extra.json`

Arquivos extras existentes devem ser tratados como material complementar/legado até serem incorporados de forma explícita à coleção principal. Não criar novos `*-extra.json` sem necessidade documentada.
