// Shows the selected user's cash balance, token holdings, and simple portfolio value.

export default function PortfolioSummary({ user, property, holdings }) {
  const holding = holdings.find(
    (item) => item.userId === user.id && item.propertyId === property.id
  );
  const tokenBalance = holding ? holding.tokenBalance : 0;
  const tokenValue = tokenBalance * property.tokenPrice;

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Portfolio</p>
        <h2>${user.name}</h2>
      </div>
      <div class="metric-row">
        <span>Cash balance</span>
        <strong>${formatMoney(user.cashBalance)}</strong>
      </div>
      <div class="metric-row">
        <span>Property tokens</span>
        <strong>${tokenBalance}</strong>
      </div>
      <div class="metric-row">
        <span>Token value</span>
        <strong>${formatMoney(tokenValue)}</strong>
      </div>
      <div class="metric-row highlight">
        <span>Claimable rent</span>
        <strong>${formatMoney(user.claimableRentalIncome)}</strong>
      </div>
    </article>
  `;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
