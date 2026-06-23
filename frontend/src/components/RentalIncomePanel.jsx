// Shows rent pool, ownership math, and claim status.

export default function RentalIncomePanel({
  user,
  property,
  holdings,
  rentalDistributions,
}) {
  if (user.role === "platform operator") {
    return renderAdminRentPanel({ property, rentalDistributions });
  }

  const latestDistribution = rentalDistributions[rentalDistributions.length - 1];
  const holding = holdings.find(
    (item) => item.userId === user.id && item.propertyId === property.id
  );
  const tokenBalance = holding ? holding.tokenBalance : 0;
  const hasTokenSupply = property.totalTokens > 0;
  const ownershipPercent = hasTokenSupply
    ? (tokenBalance / property.totalTokens) * 100
    : 0;
  const monthlyShare = hasTokenSupply
    ? (tokenBalance / property.totalTokens) * property.monthlyRentPool
    : 0;

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Rental income</p>
        <h2>Income panel</h2>
      </div>
      <div class="metric-row">
        <span>Total monthly rent pool</span>
        <strong>${formatMoney(property.monthlyRentPool)}</strong>
      </div>
      <div class="metric-row">
        <span>${user.name}'s tokens owned</span>
        <strong>${tokenBalance}</strong>
      </div>
      <div class="metric-row">
        <span>Ownership percentage</span>
        <strong>${ownershipPercent.toFixed(1)}%</strong>
      </div>
      <p class="formula">${tokenBalance} / ${property.totalTokens || 0} &times; ${formatMoney(
    property.monthlyRentPool
  )} = ${formatMoney(monthlyShare)}</p>
      <div class="metric-row">
        <span>Claimable rental income</span>
        <strong>${formatMoney(user.claimableRentalIncome)}</strong>
      </div>
      <div class="metric-row">
        <span>Claimed rental income</span>
        <strong>${formatMoney(user.claimedRentalIncome || 0)}</strong>
      </div>
      <button class="primary-button" data-claim-rent ${
        user.claimableRentalIncome <= 0 ? "disabled" : ""
      }>
        Claim rental income
      </button>
      <p class="muted">
        ${
          latestDistribution
            ? `Latest distribution: ${formatMoney(
                latestDistribution.rentAmount
              )} across ${latestDistribution.payouts.length} holders.`
            : "No rental income has been distributed yet."
        }
      </p>
    </article>
  `;
}

function renderAdminRentPanel({ property, rentalDistributions }) {
  const latestDistribution = rentalDistributions[rentalDistributions.length - 1];

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Rental income</p>
        <h2>Admin rent control</h2>
      </div>
      <div class="metric-row">
        <span>Total monthly rent pool</span>
        <strong>${formatMoney(property.monthlyRentPool)}</strong>
      </div>
      <button class="primary-button" data-distribute-rent data-property-id="${property.id}">
        Distribute rent
      </button>
      <p class="muted">
        ${
          latestDistribution
            ? `Latest distribution: ${formatMoney(
                latestDistribution.rentAmount
              )} was sent to ${latestDistribution.payouts.length} token holders.`
            : "Use this to distribute monthly rent to current token holders."
        }
      </p>
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
