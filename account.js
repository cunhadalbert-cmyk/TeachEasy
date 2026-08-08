const authArea = document.querySelector('#auth-area');
const dashboard = document.querySelector('#account-dashboard');
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const tabs = [...document.querySelectorAll('[data-auth-tab]')];

function showFeedback(formName, message, success = false) {
  const node = document.querySelector(`[data-feedback="${formName}"]`);
  node.textContent = message;
  node.hidden = false;
  node.classList.toggle('is-success', success);
}

function hideFeedback(formName) {
  const node = document.querySelector(`[data-feedback="${formName}"]`);
  node.hidden = true;
  node.classList.remove('is-success');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function renderAccount(data) {
  authArea.hidden = true;
  dashboard.hidden = false;
  document.querySelector('#account-name').textContent = data.user.displayName || 'professor(a)';
  document.querySelector('#account-email').textContent = data.user.email || '';

  const statusMap = {
    pending_payment: 'Aguardando pagamento',
    active: 'Assinatura ativa',
    past_due: 'Pagamento pendente',
    cancelled: 'Assinatura cancelada'
  };
  document.querySelector('#subscription-status').textContent = statusMap[data.subscription.status] || data.subscription.status;

  const limit = Number(data.ai.limit) || 60;
  const used = Math.max(0, Number(data.ai.used) || 0);
  const remaining = Math.max(0, Number(data.ai.remaining) || 0);
  document.querySelector('#ai-limit').textContent = limit;
  document.querySelector('#ai-used').textContent = used;
  document.querySelector('#ai-remaining').textContent = remaining;
  document.querySelector('#usage-bar').style.width = `${Math.min(100, limit ? (used / limit) * 100 : 0)}%`;
  const renewal = formatDate(data.ai.periodEnd);
  document.querySelector('#renewal-date').textContent = renewal ? `Renovação da franquia: ${renewal}` : '';
}

async function loadAccount() {
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' } });
    if (response.status === 401) {
      authArea.hidden = false;
      dashboard.hidden = true;
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Não foi possível carregar a conta.');
    renderAccount(data);
  } catch (error) {
    authArea.hidden = false;
    dashboard.hidden = true;
    showFeedback('login', error.message || 'Não foi possível consultar a conta.');
  }
}

tabs.forEach(tab => tab.addEventListener('click', () => {
  const target = tab.dataset.authTab;
  tabs.forEach(item => item.classList.toggle('active', item === tab));
  signupForm.hidden = target !== 'signup';
  loginForm.hidden = target !== 'login';
  hideFeedback('signup');
  hideFeedback('login');
}));

signupForm.addEventListener('submit', async event => {
  event.preventDefault();
  hideFeedback('signup');
  const button = signupForm.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = 'Criando conta...';
  try {
    const body = Object.fromEntries(new FormData(signupForm));
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Não foi possível criar a conta.');
    showFeedback('signup', data.message || 'Conta criada com sucesso.', true);
    if (!data.requiresEmailConfirmation) await loadAccount();
  } catch (error) {
    showFeedback('signup', error.message || 'Não foi possível criar a conta.');
  } finally {
    button.disabled = false;
    button.textContent = 'Criar minha conta';
  }
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  hideFeedback('login');
  const button = loginForm.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = 'Entrando...';
  try {
    const body = Object.fromEntries(new FormData(loginForm));
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Não foi possível entrar.');
    await loadAccount();
  } catch (error) {
    showFeedback('login', error.message || 'Não foi possível entrar.');
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar';
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.reload();
});

loadAccount();
