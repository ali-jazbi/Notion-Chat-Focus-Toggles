const KEYS = ['code', 'prompts', 'explanations'];
const BTN_IDS = { code: 'btnCode', prompts: 'btnPrompts', explanations: 'btnExplanations' };

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]));
  });
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      resolve({ response, error: chrome.runtime.lastError });
    });
  });
}

// If the content script hasn't been injected yet (e.g. extension was just
// installed/reloaded while the tab was already open), inject it on demand
// instead of asking the user to refresh the page.
async function ensureContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
  } catch (e) {
    // Ignore — may already be injected, or the tab isn't an eligible page.
  }
}

async function sendWithRetry(tabId, message) {
  let { response, error } = await sendMessageToTab(tabId, message);
  if (error || !response) {
    await ensureContentScript(tabId);
    ({ response, error } = await sendMessageToTab(tabId, message));
  }
  return response;
}

function renderStatus(status) {
  for (const key of KEYS) {
    const btn = document.getElementById(BTN_IDS[key]);
    if (!btn) continue;
    btn.classList.toggle('active', !!(status && status[key]));
  }
  if (status && typeof status.percent === 'number') {
    const range = document.getElementById('percentRange');
    const val = document.getElementById('percentValue');
    range.value = status.percent;
    val.textContent = status.percent;
  }
}

async function refreshStatus() {
  const statusLine = document.getElementById('statusLine');
  const tab = await getActiveTab();
  if (!tab) {
    statusLine.textContent = 'تب فعالی پیدا نشد';
    return;
  }
  const resp = await sendWithRetry(tab.id, { type: 'GET_STATUS' });
  if (resp && resp.status) {
    renderStatus(resp.status);
    statusLine.textContent = 'وضعیت به‌روز است';
  } else {
    statusLine.textContent = 'این صفحه نوشن نیست یا هنوز لود نشده';
  }
}

async function toggleKey(key) {
  const tab = await getActiveTab();
  if (!tab) return;
  const resp = await sendWithRetry(tab.id, { type: 'TOGGLE', key });
  if (resp && resp.status) renderStatus(resp.status);
}

async function resetAll() {
  const tab = await getActiveTab();
  if (!tab) return;
  const resp = await sendWithRetry(tab.id, { type: 'RESET_ALL' });
  if (resp && resp.status) renderStatus(resp.status);
}

let percentDebounce = null;
function onPercentInput(e) {
  const value = e.target.value;
  document.getElementById('percentValue').textContent = value;
  if (percentDebounce) clearTimeout(percentDebounce);
  percentDebounce = setTimeout(async () => {
    const tab = await getActiveTab();
    if (!tab) return;
    const resp = await sendWithRetry(tab.id, { type: 'SET_PERCENT', value: Number(value) });
    if (resp && resp.status) renderStatus(resp.status);
  }, 200);
}

document.getElementById('btnCode').addEventListener('click', () => toggleKey('code'));
document.getElementById('btnPrompts').addEventListener('click', () => toggleKey('prompts'));
document.getElementById('btnExplanations').addEventListener('click', () => toggleKey('explanations'));
document.getElementById('btnResetAll').addEventListener('click', resetAll);
document.getElementById('percentRange').addEventListener('input', onPercentInput);

refreshStatus();
