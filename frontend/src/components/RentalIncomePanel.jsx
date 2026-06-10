// Shows claimable rent and Admin controls for rental income distribution.

export default function RentalIncomePanel({ user, property, rentalDistributions }) {
  const latestDistribution = rentalDistributions[rentalDistributions.length - 1];

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Rental income</p>
        <h2>Income panel</h2>
      </div>
      <div class="metric-row">
        <span>Available to claim</span>
        <strong>${formatMoney(user.claimableRentalIncome)}</strong>
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
