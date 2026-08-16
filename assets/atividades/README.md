# Recursos visuais das atividades

Esta pasta contém **somente imagens e outros recursos visuais** usados pelas atividades do TeachEasy.

O conteúdo pedagógico (títulos, textos, habilidades BNCC, questões, gabaritos e metadados) deve permanecer em `data/atividades/`.

## Organização por disciplina

Padrão para novos recursos:

```text
assets/atividades/
├── lingua-portuguesa/
├── matematica/
├── ciencias/
├── historia/
└── geografia/
```

Quando for necessário distinguir ano e bimestre, usar subpastas dentro da disciplina:

```text
assets/atividades/geografia/4-ano/1-bimestre/
assets/atividades/historia/4-ano/1-bimestre/
```

## Regras

- Não armazenar JSON pedagógico nesta pasta.
- Não duplicar nem manter uma segunda fonte de verdade do conteúdo pedagógico dentro de `assets/atividades/`.
- Não duplicar a mesma imagem em várias pastas sem necessidade.
- Usar nomes estáveis e descritivos para novos arquivos.
- A imagem deve permanecer vinculada à atividade correta por referência no JSON.
- Manter a consistência visual dos personagens oficiais e o padrão visual aprovado do TeachEasy.
- Conteúdo gerado ou substituído deve preservar o caminho esperado pelo carregador da Biblioteca, ou o carregador deve ser atualizado no mesmo PR.
