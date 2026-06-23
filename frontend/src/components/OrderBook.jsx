// Displays recent primary investments.

export default function OrderBook({ users, property, investments }) {
  const fundingPercent =
    property.totalTokens > 0
      ? ((property.tokensSold || 0) / property.totalTokens) * 100
      : 0;

  return `
    <article class="panel wide">
      <div class="panel-header">
        <p class="eyebrow">Investment activity</p>
        <h2>Primary offering purchases</h2>
      </div>
      <div class="market-grid">
        <div>
          <h3>Offering status</h3>
          <div class="metric-row">
            <span>Tokens sold</span>
            <strong>${property.tokensSold || 0} / ${property.totalTokens || 0}</strong>
          </div>
          <div class="metric-row">
            <span>Funding progress</span>
            <strong>${fundingPercent.toFixed(1)}%</strong>
          </div>
          <p class="muted">Investors buy fixed-price tokens directly from the approved primary listing.</p>
        </div>
        <div>
          <h3>Recent investments</h3>
          ${renderInvestments(users, investments)}
        </div>
      </div>
    </article>
  `;
}

function renderInvestments(users, investments) {
  if (!investments || investments.length === 0) {
    return `<p class="muted">No primary investments yet.</p>`;
  }

  return `
    <div class="table">
      ${investments
        .slice()
        .reverse()
        .map(
          (investment) => `
            <div class="table-row">
              <span>${getUserName(users, investment.investorId)} bought from ${getUserName(
                users,
                investment.issuerId
              )}</span>
              <span>${investment.quantity} tokens</span>
              <strong>${formatMoney(investment.tokenPrice)}</strong>
              <span>${formatMoney(investment.investmentValue)} invested</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function getUserName(users, userId) {
  return users.find((user) => user.id === userId)?.name || userId;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
