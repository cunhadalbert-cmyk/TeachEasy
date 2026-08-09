# Cadastro, assinatura e franquia de IA do TeachEasy

## Arquitetura

- Firebase Authentication: cadastro, login e verificação de e-mail.
- Cloud Firestore: perfil, assinatura e franquia de IA.
- Vercel Functions: backend, cookies HttpOnly, validação de sessão e acesso ao Firestore.
- Mercado Pago: assinatura recorrente mensal.
- OpenAI: criação de atividades escolares e ilustrações pedagógicas quando necessárias.

## Variáveis de ambiente na Vercel

Configurar somente no painel da Vercel, nunca no GitHub:

- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `OPENAI_API_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_PREAPPROVAL_PLAN_ID`
- `MERCADOPAGO_WEBHOOK_SECRET`

`FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` vêm de uma Service Account e são exclusivas do servidor.

## Firebase

1. Criar o projeto TeachEasy no Firebase Console.
2. Em Authentication, habilitar Email/Password.
3. Em Firestore Database, criar o banco em modo de produção.
4. Em Project settings, obter a Web API Key e o Project ID.
5. Em Service accounts, gerar uma nova chave privada JSON.
6. Copiar `client_email` para `FIREBASE_CLIENT_EMAIL` e `private_key` para `FIREBASE_PRIVATE_KEY` na Vercel.
7. Não expor a chave privada no navegador ou no repositório.

## Regra comercial inicial

- Plano Premium: R$ 24,90/mês.
- Oferta de lançamento: R$ 19,90/mês.
- 60 gerações com IA por período mensal.
- Cadastro novo começa como `pending_payment`.
- Somente assinatura `active` pode consumir IA.
- Biblioteca pronta, PDF, Word e gabarito não consomem geração.
- Uma atividade por texto ou foto consome 1 geração; a ilustração pedagógica necessária está incluída nessa mesma geração.

## Segurança

- A sessão usa cookies HttpOnly e SameSite=Lax.
- O navegador não recebe credenciais administrativas do Firebase.
- O Firestore é acessado pelo backend com credenciais da Service Account.
- O consumo da franquia usa escrita com precondição de versão para evitar perda de atualização em requisições concorrentes.
- O webhook do Mercado Pago consulta a assinatura antes de ativar, suspender ou cancelar a conta.
