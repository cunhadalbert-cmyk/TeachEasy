const ACCESS_COOKIE = 'teacheasy_access';
const REFRESH_COOKIE = 'teacheasy_refresh';

function requireConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey) throw new Error('SUPABASE_NOT_CONFIGURED');
  return { url, anonKey, serviceKey };
}

function parseCookies(request) {
  return String(request.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf('=');
      if (separator < 0) return cookies;
      const key = decodeURIComponent(part.slice(0, separator));
      const value = decodeURIComponent(part.slice(separator + 1));
      cookies[key] = value;
      return cookies;
    }, {});
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(0, Number(maxAge) || 0)}${secure}`;
}

function setSessionCookies(response, session) {
  if (!session?.access_token || !session?.refresh_token) return;
  const accessAge = Math.max(60, Number(session.expires_in) || 3600);
  response.setHeader('Set-Cookie', [
    cookie(ACCESS_COOKIE, session.access_token, accessAge),
    cookie(REFRESH_COOKIE, session.refresh_token, 60 * 60 * 24 * 30)
  ]);
}

function clearSessionCookies(response) {
  response.setHeader('Set-Cookie', [cookie(ACCESS_COOKIE, '', 0), cookie(REFRESH_COOKIE, '', 0)]);
}

async function authFetch(path, options = {}) {
  const { url, anonKey } = requireConfig();
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function signUp(email, password, displayName) {
  return authFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, data: { display_name: displayName } })
  });
}

async function signIn(email, password) {
  return authFetch('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

async function refreshSession(refreshToken) {
  if (!refreshToken) return null;
  const { response, data } = await authFetch('/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  return response.ok ? data : null;
}

async function fetchUser(accessToken) {
  if (!accessToken) return null;
  const { response, data } = await authFetch('/user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.ok ? data : null;
}

async function getAuthenticatedUser(request, response) {
  const cookies = parseCookies(request);
  let accessToken = cookies[ACCESS_COOKIE];
  let user = await fetchUser(accessToken);
  if (user) return { user, accessToken };

  const refreshed = await refreshSession(cookies[REFRESH_COOKIE]);
  if (!refreshed) return null;
  setSessionCookies(response, refreshed);
  accessToken = refreshed.access_token;
  user = refreshed.user || await fetchUser(accessToken);
  return user ? { user, accessToken } : null;
}

async function serviceRest(path, options = {}) {
  const { url, serviceKey } = requireConfig();
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_NOT_CONFIGURED');
  const response = await fetch(`${url}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { response, data };
}

async function getProfile(userId) {
  const { response, data } = await serviceRest(`/profiles?id=eq.${encodeURIComponent(userId)}&select=id,display_name,plan,subscription_status,ai_limit,ai_used,period_start,period_end`, {
    method: 'GET'
  });
  if (!response.ok) throw new Error('PROFILE_LOOKUP_FAILED');
  return Array.isArray(data) ? data[0] || null : null;
}

async function consumeAiGeneration(userId) {
  const { response, data } = await serviceRest('/rpc/consume_ai_generation', {
    method: 'POST',
    body: JSON.stringify({ p_user_id: userId })
  });
  if (!response.ok) {
    const code = data?.message || data?.code || 'QUOTA_FAILED';
    const error = new Error(code);
    error.details = data;
    throw error;
  }
  return Array.isArray(data) ? data[0] : data;
}

async function refundAiGeneration(userId) {
  const { response } = await serviceRest('/rpc/refund_ai_generation', {
    method: 'POST',
    body: JSON.stringify({ p_user_id: userId })
  });
  return response.ok;
}

module.exports = {
  clearSessionCookies,
  consumeAiGeneration,
  getAuthenticatedUser,
  getProfile,
  refundAiGeneration,
  setSessionCookies,
  signIn,
  signUp
};
