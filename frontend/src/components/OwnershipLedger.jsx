// Displays the simulated blockchain ownership registry.

export default function OwnershipLedger({ users, ledger }) {
  const entries = ledger || [];
  const latestEntry = entries[entries.length - 1];

  return `
    <article class="panel wide">
      <div class="panel-header compact-header">
        <div>
          <p class="eyebrow">Ownership ledger</p>
          <h2>Simulated blockchain registry</h2>
        </div>
        <p class="muted">Initial allocation plus every matched-trade token transfer, chained with demo block hashes.</p>
      </div>
      <div class="ledger-summary">
        <div>
          <span class="label">Registry status</span>
          <strong>${entries.length > 0 ? "Active" : "Waiting for entries"}</strong>
        </div>
        <div>
          <span class="label">Blocks recorded</span>
          <strong>${entries.length}</strong>
        </div>
        <div>
          <span class="label">Latest block hash</span>
          <strong>${latestEntry?.blockHash || "No hash yet"}</strong>
        </div>
      </div>
      ${
        entries.length === 0
          ? `<p class="muted">Restart the backend to load the upgraded registry seed, then matched trades will appear here automatically.</p>`
          : `<div class="table ledger-table">
              ${entries
                .slice()
                .reverse()
                .map(renderLedgerEntry(users))
                .join("")}
            </div>`
      }
    </article>
  `;
}

function renderLedgerEntry(users) {
  return (entry) => `
    <div class="table-row ledger-row">
      <span>#${entry.blockNumber || "-"} ${formatDate(entry.createdAt)}</span>
      <span>${getUserName(users, entry.fromUserId)} -> ${getUserName(
    users,
    entry.toUserId
  )}</span>
      <span>${entry.quantity} tokens</span>
      <span>${entry.reason}</span>
      <strong>${entry.blockHash || "Pending hash"}</strong>
    </div>
  `;
}

function getUserName(users, userId) {
  if (userId === "issuer") {
    return "Issuer";
  }

  return users.find((user) => user.id === userId)?.name || userId;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
