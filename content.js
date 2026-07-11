/**
 * Notion Chat Focus Toggles — Content Script
 *
 * Hides specific parts of the Notion AI chat: code blocks, your own
 * prompts, or the AI's non-code explanation text. Each toggle can be
 * limited to only the oldest N% of the conversation via a shared
 * percentage slider, so the most recent part of the chat always stays
 * fully visible no matter what is toggled on.
 *
 * Design note: every applyKey() call unconditionally sets the display
 * style (hidden or visible) on every CURRENTLY matching element, based on
 * a fresh computation. There is no per-element "did I hide this before"
 * bookkeeping, so turning a toggle off always restores visibility — even
 * if Notion re-rendered/replaced the underlying DOM nodes in between.
 */

(() => {
  const MARKER_SELECTOR = '[data-agent-chat-user-step-id]';
  const DEBUG = true; // set to false to silence [Notion Focus][DEBUG] logs

  const TOGGLES = {
    code: {
      selector: 'div.notion-selectable.notion-code-block[data-block-id]',
      onMsg: '[Notion Focus] کدباکس‌ها مخفی شدند.',
      offMsg: '[Notion Focus] کدها دوباره نمایش داده شدند.',
    },
    prompts: {
      selector: MARKER_SELECTOR,
      onMsg: '[Notion Focus] پرامپت‌های شما مخفی شدند.',
      offMsg: '[Notion Focus] پرامپت‌های شما دوباره نمایش داده شدند.',
    },
    explanations: {
      selector: '[role="group"] div.notion-selectable[data-block-id]:not(.notion-code-block)',
      onMsg: '[Notion Focus] توضیحات غیرکد مخفی شدند.',
      offMsg: '[Notion Focus] توضیحات دوباره نمایش داده شدند.',
    },
  };

  const state = {
    active: { code: false, prompts: false, explanations: false },
    percent: 100,
  };

  function loadState() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(['nfActive', 'nfPercent'], (data) => {
          if (data && data.nfActive) state.active = { ...state.active, ...data.nfActive };
          if (data && typeof data.nfPercent === 'number') state.percent = data.nfPercent;
          resolve();
        });
      } catch (e) {
        resolve();
      }
    });
  }

  function saveState() {
    try {
      chrome.storage.local.set({ nfActive: state.active, nfPercent: state.percent });
    } catch (e) {
      // ignore — storage may be unavailable in rare contexts
    }
  }

  // Computes a 1-based "turn index" for every marker AND every target
  // element matching `selector`, using a single combined querySelectorAll
  // call. querySelectorAll always returns matches in document (tree) order,
  // so walking that merged, naturally-sorted list avoids any manual
  // node-comparison logic (no compareDocumentPosition edge cases).
  function computeTurnIndices(selector) {
    const combined = selector === MARKER_SELECTOR
      ? MARKER_SELECTOR
      : `${MARKER_SELECTOR}, ${selector}`;
    const nodes = document.querySelectorAll(combined);
    let running = 0;
    const map = new Map();
    nodes.forEach((node) => {
      const isMarker = node.matches(MARKER_SELECTOR);
      if (isMarker) running++;
      map.set(node, running || 1);
    });
    return { map, total: running };
  }

  // Unconditionally sets the correct display state (hidden or visible) on
  // every currently matching element for this key, based on a fresh scan.
  // No per-element bookkeeping, so toggling off always restores visibility.
  function applyKey(key) {
    const t = TOGGLES[key];
    if (!t) return;
    const on = state.active[key];
    const { map, total } = computeTurnIndices(t.selector);
    const limitIndex = total ? Math.ceil((total * state.percent) / 100) : 0;
    const targets = document.querySelectorAll(t.selector);

    let hiddenCount = 0;
    targets.forEach((el) => {
      const idx = map.get(el) || 1;
      const shouldHide = on && idx > 0 && idx <= limitIndex;
      if (shouldHide) {
        el.style.setProperty('display', 'none', 'important');
        hiddenCount++;
      } else {
        el.style.removeProperty('display');
      }
    });

    if (DEBUG) {
      console.log(
        `[Notion Focus][DEBUG] key=${key} on=${on} targetsFound=${targets.length} totalTurns=${total} percent=${state.percent} limitIndex=${limitIndex} hiddenNow=${hiddenCount}`
      );
    }
  }

  function applyAll() {
    Object.keys(TOGGLES).forEach(applyKey);
  }

  function getStatus() {
    return { ...state.active, percent: state.percent };
  }

  function toggle(key) {
    if (!TOGGLES[key]) return getStatus();
    state.active[key] = !state.active[key];
    console.log(state.active[key] ? TOGGLES[key].onMsg : TOGGLES[key].offMsg);
    applyAll();
    saveState();
    return getStatus();
  }

  function setPercent(value) {
    const p = Math.max(0, Math.min(100, Number(value) || 0));
    state.percent = p;
    console.log(`[Notion Focus] محدوده روی ${p}% ابتدای چت تنظیم شد.`);
    applyAll();
    saveState();
    return getStatus();
  }

  function resetAll() {
    Object.keys(TOGGLES).forEach((key) => {
      state.active[key] = false;
    });
    state.percent = 100;
    applyAll();
    saveState();
    console.log('[Notion Focus] همه‌چی ریست شد و دوباره نمایان داده شد.');
    return getStatus();
  }

  // Keep hides correct as new chat turns stream in (percentage cutoff
  // shifts as the conversation grows) or Notion replaces block nodes.
  // Only watches structural changes (new/removed nodes), not style/class
  // attributes, to avoid retriggering itself from our own display updates.
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    const anyActive = Object.values(state.active).some(Boolean);
    if (!anyActive) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyAll, 300);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime?.onMessage?.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'TOGGLE') {
      sendResponse({ status: toggle(message.key) });
    } else if (message?.type === 'SET_PERCENT') {
      sendResponse({ status: setPercent(message.value) });
    } else if (message?.type === 'RESET_ALL') {
      sendResponse({ status: resetAll() });
    } else if (message?.type === 'GET_STATUS') {
      sendResponse({ status: getStatus() });
    }
  });

  loadState().then(() => {
    applyAll();
    console.log('[Notion Focus] content script ready');
  });
})();
