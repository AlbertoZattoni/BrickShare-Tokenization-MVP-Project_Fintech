// Shows rent pool, ownership math, and claim status.

export default function RentalIncomePanel({
  user,
  property,
  holdings,
  rentalDistributions,
}) {
  const latestDistribution = rentalDistributions[rentalDistributions.length - 1];
  const holding = holdings.find(
    (item) => item.userId === user.id && item.propertyId === property.id
  );
  const tokenBalance = holding ? holding.tokenBalance : 0;
  const ownershipPercent = (tokenBalance / property.totalTokens) * 100;
  const monthlyShare =
    (tokenBalance / property.totalTokens) * property.monthlyRentPool;

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
      <p class="formula">${tokenBalance} / ${property.totalTokens} &times; ${formatMoney(
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
      ${
        user.role === "admin"
          ? `<button class="primary-button" data-distribute-rent data-property-id="${property.id}">
              Distribute rent
            </button>`
          : `<button class="primary-button" data-claim-rent ${
              user.claimableRentalIncome <= 0 ? "disabled" : ""
            }>
              Claim rental income
            </button>`
      }
      <p class="muted">
        ${
          latestDistribution
            ? `Latest distribution: ${formatMoney(
                latestDistribution.rentAmount
              )} across ${latestDistribution.payouts.length} holders.`
            : user.role === "admin"
            ? "Use the Admin view to distribute this month's rent to current token holders."
            : "No rental income has been distributed yet."
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
