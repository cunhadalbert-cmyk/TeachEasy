import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('conta TeachEasy apresenta preço de lançamento e franquia de 60 gerações', async () => {
  const html = await read('account.html');
  assert.match(html, /R\$ 24,90/);
  assert.match(html, /R\$ 19,90/);
  assert.match(html, /60 gerações de atividades com IA por mês/);
  assert.match(html, /Ilustração pedagógica incluída/);
  assert.match(html, /PDF, Word e gabarito não consomem geração/);
});

test('Firebase cria perfil aguardando pagamento e limita IA a 60 por padrão', async () => {
  const helper = await read('api/_lib/firebase.js');
  assert.match(helper, /subscriptionStatus: 'pending_payment'/);
  assert.match(helper, /aiLimit: 60/);
  assert.match(helper, /values\.subscriptionStatus !== 'active'/);
  assert.match(helper, /AI_QUOTA_EXCEEDED/);
  assert.match(helper, /currentDocument: \{ updateTime \}/);
});

test('Firebase usa backend com service account e Firestore', async () => {
  const helper = await read('api/_lib/firebase.js');
  assert.match(helper, /FIREBASE_CLIENT_EMAIL/);
  assert.match(helper, /FIREBASE_PRIVATE_KEY/);
  assert.match(helper, /https:\/\/www\.googleapis\.com\/auth\/datastore/);
  assert.match(helper, /firestore\.googleapis\.com/);
});

test('endpoint de IA exige login e assinatura antes da OpenAI', async () => {
  const api = await read('api/generate-activity.js');
  const authIndex = api.indexOf('getAuthenticatedUser(request, response)');
  const quotaIndex = api.indexOf('consumeAiGeneration(authenticatedUserId)');
  const openAiIndex = api.indexOf("fetch('https://api.openai.com/v1/responses'");
  assert.ok(authIndex >= 0);
  assert.ok(quotaIndex > authIndex);
  assert.ok(openAiIndex > quotaIndex);
  assert.match(api, /Entre na sua conta TeachEasy/);
  assert.match(api, /Sua assinatura ainda não está ativa/);
});

test('endpoint restringe IA a conteúdo escolar e imagem pedagógica', async () => {
  const api = await read('api/generate-activity.js');
  assert.match(api, /A IA do TeachEasy é exclusiva para atividades e conteúdos escolares/);
  assert.match(api, /trabalha somente com conteúdo escolar/);
  assert.match(api, /Não crie retrato, publicidade, logotipo, meme, arte promocional ou imagem sem finalidade didática/);
});

test('falha da geração devolve a unidade reservada', async () => {
  const api = await read('api/generate-activity.js');
  assert.match(api, /quotaReserved = true/);
  assert.match(api, /refundAiGeneration\(authenticatedUserId\)/);
  assert.match(api, /quotaReserved = false/);
});

test('sessão Firebase usa cookies HttpOnly e SameSite', async () => {
  const helper = await read('api/_lib/firebase.js');
  assert.match(helper, /HttpOnly/);
  assert.match(helper, /SameSite=Lax/);
  assert.match(helper, /FIREBASE_PROJECT_ID/);
});

test('cadastro envia verificação de e-mail pelo Firebase', async () => {
  const helper = await read('api/_lib/firebase.js');
  assert.match(helper, /accounts:sendOobCode/);
  assert.match(helper, /VERIFY_EMAIL/);
  const login = await read('api/auth/login.js');
  assert.match(login, /Confirme seu e-mail antes de entrar/);
});
