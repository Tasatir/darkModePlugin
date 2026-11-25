const CACHE_KEY = "darkModePlugin";

function pageHost() {
  return location.hostname;
}

function readCache() {
  try {
    const value = localStorage.getItem(CACHE_KEY);
    if (value === "dark" || value === "normal") return value;
  } catch (_error) {
    return null;
  }
  return null;
}

function writeCache(mode) {
  try {
    if (mode === "dark" || mode === "normal") {
      localStorage.setItem(CACHE_KEY, mode);
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (_error) {
    /* páginas sin storage: la clase sigue aplicándose */
  }
}

function applyMode(mode) {
  const root = document.documentElement;
  if (!root) return;
  root.classList.toggle("dm-dark", mode === "dark");
  writeCache(mode);
}

function applyCached() {
  if (readCache() === "dark" && document.documentElement) {
    document.documentElement.classList.add("dm-dark");
  }
}

function modeFromSites(sites) {
  return siteMode(sites, pageHost());
}

async function reconcile() {
  const host = pageHost();
  if (!host) return;
  const sites = await readSites();
  applyMode(modeFromSites(sites));
}

applyCached();
reconcile();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.sites) return;
  const sites = changes.sites.newValue || {};
  applyMode(modeFromSites(sites));
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "apply") return;
  applyMode(normalizeMode(message.mode));
  sendResponse({ ok: true });
});
