// Displays the simulated blockchain ownership registry.

export default function OwnershipLedger({ users, ledger }) {
  return `
    <article class="panel wide">
      <div class="panel-header compact-header">
        <div>
          <p class="eyebrow">Ownership ledger</p>
          <h2>Simulated blockchain registry</h2>
        </div>
        <p class="muted">Initial allocation plus every matched-trade token transfer.</p>
      </div>
      <div class="table ledger-table">
        ${ledger
          .slice()
          .reverse()
          .map(
            (entry) => `
              <div class="table-row ledger-row">
                <span>${formatDate(entry.createdAt)}</span>
                <span>${getUserName(users, entry.fromUserId)} -> ${getUserName(
              users,
              entry.toUserId
            )}</span>
                <span>${entry.quantity} tokens</span>
                <strong>${entry.reason}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
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
