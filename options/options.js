const emptyEl = document.getElementById("empty");
const listEl = document.getElementById("list");
const rowsEl = document.getElementById("rows");

function formatUpdated(entry) {
  const stamp = entry && entry.updatedAt;
  if (!stamp) return "";
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es");
}

function render(sites) {
  const hosts = Object.keys(sites).sort((a, b) => a.localeCompare(b, "es"));
  rowsEl.replaceChildren();
  const hasSites = hosts.length > 0;
  emptyEl.hidden = hasSites;
  listEl.hidden = !hasSites;

  for (const host of hosts) {
    const entry = sites[host] || {};
    const mode = entry.mode === "dark" ? "dark" : "normal";
    const row = document.createElement("tr");

    const hostCell = document.createElement("td");
    hostCell.textContent = host;

    const modeCell = document.createElement("td");
    modeCell.textContent = mode === "dark" ? "Oscuro" : "Normal";

    const dateCell = document.createElement("td");
    dateCell.textContent = formatUpdated(entry);

    const actions = document.createElement("td");
    const actionBar = document.createElement("div");
    actionBar.className = "actions";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = mode === "dark" ? "Pasar a Normal" : "Pasar a Oscuro";
    toggle.addEventListener("click", () => {
      setSiteMode(host, mode === "dark" ? "normal" : "dark");
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "Borrar";
    remove.addEventListener("click", () => {
      removeSite(host);
    });

    actionBar.append(toggle, remove);
    actions.append(actionBar);
    row.append(hostCell, modeCell, dateCell, actions);
    rowsEl.append(row);
  }
}

async function reload() {
  render(await readSites());
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.sites) return;
  render(changes.sites.newValue || {});
});

reload();
