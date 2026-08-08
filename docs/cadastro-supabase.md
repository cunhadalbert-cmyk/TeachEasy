# Cadastro e franquia de IA do TeachEasy

## Variáveis de ambiente na Vercel

Configurar somente no painel da Vercel, nunca no GitHub:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (já utilizada pela criação com IA)

A `SUPABASE_SERVICE_ROLE_KEY` é exclusiva do servidor e nunca deve ser enviada ao navegador.

## Banco

1. Criar um projeto no Supabase.
2. Abrir o SQL Editor.
3. Executar `supabase/schema.sql`.
4. Manter confirmação de e-mail habilitada para cadastros.
5. Adicionar as variáveis acima no ambiente Preview antes de testar.

## Regra comercial inicial

- Plano Premium: R$ 24,90/mês.
- Oferta de lançamento: R$ 19,90/mês.
- 60 gerações com IA por período mensal.
- Cadastro novo começa como `pending_payment`.
- Somente `subscription_status = active` pode consumir IA.
- Biblioteca pronta, PDF, Word e gabarito não consomem geração.
- Uma atividade por texto ou foto consome 1 geração; a ilustração pedagógica necessária está incluída nessa mesma geração.

## Próxima etapa

O webhook do Mercado Pago deverá alterar `subscription_status`, `period_start` e `period_end` de forma server-side quando o pagamento for aprovado, renovado, atrasado ou cancelado.
