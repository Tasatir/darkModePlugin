const SITE_STORAGE_KEY = "sites";

function normalizeMode(mode) {
  return mode === "dark" ? "dark" : "normal";
}

async function readSites() {
  const data = await chrome.storage.local.get(SITE_STORAGE_KEY);
  const sites = data[SITE_STORAGE_KEY];
  if (!sites || typeof sites !== "object" || Array.isArray(sites)) {
    return {};
  }
  return sites;
}

async function writeSites(sites) {
  await chrome.storage.local.set({ [SITE_STORAGE_KEY]: sites });
}

async function setSiteMode(hostname, mode) {
  const sites = await readSites();
  sites[hostname] = {
    mode: normalizeMode(mode),
    updatedAt: Date.now(),
  };
  await writeSites(sites);
}

async function removeSite(hostname) {
  const sites = await readSites();
  delete sites[hostname];
  await writeSites(sites);
}

function siteMode(sites, hostname) {
  const entry = sites[hostname];
  if (!entry || (entry.mode !== "dark" && entry.mode !== "normal")) {
    return null;
  }
  return entry.mode;
}
