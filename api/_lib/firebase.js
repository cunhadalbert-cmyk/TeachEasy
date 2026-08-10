const crypto = require('node:crypto');

const ACCESS_COOKIE = 'teacheasy_access';
const REFRESH_COOKIE = 'teacheasy_refresh';
let cachedAdminToken = null;

function requireConfig() {
  const apiKey = String(process.env.FIREBASE_API_KEY || '').trim();
  let projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
  let clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
  let privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  const serviceAccountJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
  if (serviceAccountJson) {
    try {
      const credentials = JSON.parse(serviceAccountJson);
      projectId = projectId || String(credentials.project_id || '').trim();
      clientEmail = clientEmail || String(credentials.client_email || '').trim();
      privateKey = privateKey || String(credentials.private_key || '').replace(/\\n/g, '\n').trim();
    } catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_INVALID'); }
  }
  if (!apiKey || !projectId || !clientEmail || !privateKey) throw new Error('FIREBASE_NOT_CONFIGURED');
  return { apiKey, projectId, clientEmail, privateKey };
}

function parseCookies(request) {
  return String(request.headers.cookie || '').split(';').map(part => part.trim()).filter(Boolean).reduce((cookies, part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return cookies;
    cookies[decodeURIComponent(part.slice(0, separator))] = decodeURIComponent(part.slice(separator + 1));
    return cookies;
  }, {});
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(0, Number(maxAge) || 0)}${secure}`;
}

function setSessionCookies(response, session) {
  if (!session?.idToken || !session?.refreshToken) return;
  response.setHeader('Set-Cookie', [cookie(ACCESS_COOKIE, session.idToken, Math.max(60, Number(session.expiresIn) || 3600)), cookie(REFRESH_COOKIE, session.refreshToken, 60 * 60 * 24 * 30)]);
}
function clearSessionCookies(response) { response.setHeader('Set-Cookie', [cookie(ACCESS_COOKIE, '', 0), cookie(REFRESH_COOKIE, '', 0)]); }

async function firebaseAuth(path, body) {
  const { apiKey } = requireConfig();
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function signUp(email, password, displayName) {
  const { response, data } = await firebaseAuth('accounts:signUp', { email, password, returnSecureToken: true });
  if (!response.ok) return { response, data };
  if (displayName) await firebaseAuth('accounts:update', { idToken: data.idToken, displayName, returnSecureToken: false });
  await firebaseAuth('accounts:sendOobCode', { requestType: 'VERIFY_EMAIL', idToken: data.idToken });
  await createProfile(data.localId, displayName, email);
  return { response, data: { ...data, displayName } };
}
async function signIn(email, password) { return firebaseAuth('accounts:signInWithPassword', { email, password, returnSecureToken: true }); }

async function refreshSession(refreshToken) {
  if (!refreshToken) return null;
  const { apiKey } = requireConfig();
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return null;
  return { idToken: data.id_token, refreshToken: data.refresh_token, expiresIn: data.expires_in, userId: data.user_id };
}

async function lookupUser(idToken) {
  if (!idToken) return null;
  const { response, data } = await firebaseAuth('accounts:lookup', { idToken });
  if (!response.ok) return null;
  const user = data.users?.[0];
  if (!user) return null;
  return { id: user.localId, email: user.email || '', displayName: user.displayName || '', emailVerified: Boolean(user.emailVerified) };
}

async function getAuthenticatedUser(request, response) {
  const cookies = parseCookies(request);
  let idToken = cookies[ACCESS_COOKIE];
  let user = await lookupUser(idToken);
  if (user?.emailVerified) return { user, idToken };
  const refreshed = await refreshSession(cookies[REFRESH_COOKIE]);
  if (!refreshed) return null;
  setSessionCookies(response, refreshed);
  idToken = refreshed.idToken;
  user = await lookupUser(idToken);
  return user?.emailVerified ? { user, idToken } : null;
}

function base64url(value) { return Buffer.from(value).toString('base64url'); }
async function adminToken() {
  if (cachedAdminToken && cachedAdminToken.expiresAt > Date.now() + 60_000) return cachedAdminToken.token;
  const { clientEmail, privateKey } = requireConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({ iss: clientEmail, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const unsigned = `${header}.${claims}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), privateKey).toString('base64url');
  const assertion = `${unsigned}.${signature}`;
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error('FIREBASE_ADMIN_AUTH_FAILED');
  cachedAdminToken = { token: data.access_token, expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000 };
  return cachedAdminToken.token;
}

function firestoreBase() { const { projectId } = requireConfig(); return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`; }
function encodeValue(value) { if (value === null || value === undefined) return { nullValue: null }; if (typeof value === 'boolean') return { booleanValue: value }; if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }; return { stringValue: String(value) }; }
function decodeValue(value = {}) { if ('stringValue' in value) return value.stringValue; if ('integerValue' in value) return Number(value.integerValue); if ('doubleValue' in value) return Number(value.doubleValue); if ('booleanValue' in value) return Boolean(value.booleanValue); if ('timestampValue' in value) return value.timestampValue; return null; }
function fieldsFromObject(object) { return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, encodeValue(value)])); }
function objectFromFields(fields = {}) { return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)])); }

async function firestoreFetch(url, options = {}) {
  const token = await adminToken();
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function createProfile(userId, displayName, email) {
  const now = new Date(); const end = new Date(now); end.setMonth(end.getMonth() + 1);
  const profile = { displayName: displayName || '', email: email || '', plan: 'premium', subscriptionStatus: 'pending_payment', subscriptionPrice: 19.90, mercadoPagoSubscriptionId: '', mercadoPagoStatus: '', aiLimit: 60, aiUsed: 0, periodStart: now.toISOString(), periodEnd: end.toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString() };
  const { response } = await firestoreFetch(`${firestoreBase()}/profiles?documentId=${encodeURIComponent(userId)}`, { method: 'POST', body: JSON.stringify({ fields: fieldsFromObject(profile) }) });
  if (!response.ok && response.status !== 409) throw new Error('PROFILE_CREATE_FAILED');
}

async function readProfileDocument(userId) {
  const { response, data } = await firestoreFetch(`${firestoreBase()}/profiles/${encodeURIComponent(userId)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('PROFILE_LOOKUP_FAILED');
  return { values: objectFromFields(data.fields), updateTime: data.updateTime };
}

function normalizeProfile(values) {
  if (!values) return null;
  return { display_name: values.displayName || '', plan: values.plan || 'premium', subscription_status: values.subscriptionStatus || 'pending_payment', subscription_price: Number(values.subscriptionPrice) || 19.90, mercadopago_subscription_id: values.mercadoPagoSubscriptionId || '', mercadopago_status: values.mercadoPagoStatus || '', ai_limit: Number(values.aiLimit) || 60, ai_used: Number(values.aiUsed) || 0, period_start: values.periodStart || '', period_end: values.periodEnd || '' };
}
async function getProfile(userId) { const doc = await readProfileDocument(userId); return normalizeProfile(doc?.values); }

async function patchProfile(userId, patch) {
  const fieldPaths = Object.keys(patch).map(key => `updateMask.fieldPaths=${encodeURIComponent(key)}`).join('&');
  const { response } = await firestoreFetch(`${firestoreBase()}/profiles/${encodeURIComponent(userId)}?${fieldPaths}`, { method: 'PATCH', body: JSON.stringify({ fields: fieldsFromObject(patch) }) });
  if (!response.ok) throw new Error('PROFILE_UPDATE_FAILED');
}

async function saveMercadoPagoSubscription(userId, subscriptionId, mercadoPagoStatus = 'pending') { await patchProfile(userId, { mercadoPagoSubscriptionId: String(subscriptionId), mercadoPagoStatus: String(mercadoPagoStatus || 'pending'), updatedAt: new Date().toISOString() }); }

async function syncSubscriptionStatus({ userId, subscriptionId, mercadoPagoStatus, nextPaymentDate }) {
  const normalized = String(mercadoPagoStatus || '').toLowerCase();
  const subscriptionStatus = normalized === 'authorized' ? 'active' : normalized === 'paused' ? 'past_due' : normalized === 'cancelled' ? 'cancelled' : 'pending_payment';
  const patch = { mercadoPagoSubscriptionId: String(subscriptionId), mercadoPagoStatus: normalized || 'unknown', subscriptionStatus, subscriptionPrice: 19.90, updatedAt: new Date().toISOString() };
  if (subscriptionStatus === 'active') { patch.periodStart = new Date().toISOString(); patch.periodEnd = nextPaymentDate || new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(); patch.aiUsed = 0; }
  await patchProfile(userId, patch);
}

async function syncOneTimePaymentStatus({ userId, paymentId, mercadoPagoStatus }) {
  const normalized = String(mercadoPagoStatus || '').toLowerCase();
  if (normalized !== 'approved') return false;
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await patchProfile(userId, {
    subscriptionStatus: 'active',
    subscriptionPrice: 19.90,
    mercadoPagoStatus: 'payment_approved',
    mercadoPagoPaymentId: String(paymentId),
    accessMode: 'paid_30_days',
    periodStart: now.toISOString(),
    periodEnd: end.toISOString(),
    aiUsed: 0,
    updatedAt: now.toISOString()
  });
  return true;
}

async function commitProfileWithPrecondition(userId, values, updateTime) {
  const { projectId } = requireConfig();
  const name = `projects/${projectId}/databases/(default)/documents/profiles/${userId}`;
  const body = { writes: [{ update: { name, fields: fieldsFromObject(values) }, currentDocument: { updateTime } }] };
  return firestoreFetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:commit`, { method: 'POST', body: JSON.stringify(body) });
}

async function consumeAiGeneration(userId) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const doc = await readProfileDocument(userId); if (!doc) throw new Error('PROFILE_NOT_FOUND');
    const values = { ...doc.values }; if (values.subscriptionStatus !== 'active') throw new Error('SUBSCRIPTION_INACTIVE');
    const now = new Date(); if (!values.periodEnd || now >= new Date(values.periodEnd)) { const end = new Date(now); end.setMonth(end.getMonth() + 1); values.aiUsed = 0; values.periodStart = now.toISOString(); values.periodEnd = end.toISOString(); }
    const limit = Number(values.aiLimit) || 60; const used = Number(values.aiUsed) || 0; if (used >= limit) throw new Error('AI_QUOTA_EXCEEDED');
    values.aiUsed = used + 1; values.updatedAt = now.toISOString();
    const { response } = await commitProfileWithPrecondition(userId, values, doc.updateTime);
    if (response.ok) return { ai_limit: limit, ai_used: values.aiUsed, remaining: Math.max(0, limit - values.aiUsed), period_start: values.periodStart, period_end: values.periodEnd };
    if (response.status !== 409 && response.status !== 412) throw new Error('QUOTA_FAILED');
  }
  throw new Error('QUOTA_CONFLICT');
}

async function refundAiGeneration(userId) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const doc = await readProfileDocument(userId); if (!doc) return false;
    const values = { ...doc.values, aiUsed: Math.max(0, Number(doc.values.aiUsed || 0) - 1), updatedAt: new Date().toISOString() };
    const { response } = await commitProfileWithPrecondition(userId, values, doc.updateTime);
    if (response.ok) return true; if (response.status !== 409 && response.status !== 412) return false;
  }
  return false;
}

module.exports = { clearSessionCookies, consumeAiGeneration, getAuthenticatedUser, getProfile, refundAiGeneration, saveMercadoPagoSubscription, setSessionCookies, signIn, signUp, syncOneTimePaymentStatus, syncSubscriptionStatus };
