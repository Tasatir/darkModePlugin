const hostEl = document.getElementById("host");
const unsupportedEl = document.getElementById("unsupported");
const modesEl = document.getElementById("modes");
const statusEl = document.getElementById("status");

let currentTab = null;
let currentHost = "";

function pageTarget(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch (_error) {
    return null;
  }
  const web = parsed.protocol === "http:" || parsed.protocol === "https:";
  if (!web || !parsed.hostname) return null;
  if (parsed.hostname === "chromewebstore.google.com") return null;
  if (
    parsed.hostname === "chrome.google.com" &&
    parsed.pathname.startsWith("/webstore")
  ) {
    return null;
  }
  return parsed.hostname;
}

function markMode(mode) {
  for (const button of modesEl.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
  }
}

async function refresh() {
  statusEl.textContent = "";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab || null;
  currentHost = pageTarget(tab && tab.url);
  if (!currentHost) {
    hostEl.textContent = "";
    unsupportedEl.hidden = false;
    modesEl.hidden = true;
    return;
  }
  unsupportedEl.hidden = true;
  modesEl.hidden = false;
  hostEl.textContent = currentHost;
  const sites = await readSites();
  markMode(siteMode(sites, currentHost));
}

async function chooseMode(mode) {
  if (!currentHost) return;
  statusEl.textContent = "";
  await setSiteMode(currentHost, mode);
  markMode(normalizeMode(mode));
  if (!currentTab || currentTab.id == null) return;
  try {
    await chrome.tabs.sendMessage(currentTab.id, {
      type: "apply",
      mode: normalizeMode(mode),
    });
  } catch (_error) {
    statusEl.textContent = "Recarga la página para aplicar el modo.";
  }
}

modesEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button) return;
  chooseMode(button.dataset.mode);
});

document.getElementById("open-list").addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

refresh();
