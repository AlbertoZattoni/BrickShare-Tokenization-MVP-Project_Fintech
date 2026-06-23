// Shows the selected user's cash balance, token holdings, and simple portfolio value.

export default function PortfolioSummary({
  user,
  property,
  holdings,
  platformRevenue,
}) {
  if (user.role === "platform operator") {
    return renderPlatformSummary({ property, platformRevenue });
  }

  if (user.role === "property owner") {
    return renderPropertyOwnerSummary({ user, property });
  }

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

function renderPlatformSummary({ property, platformRevenue }) {
  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Platform</p>
        <h2>Admin overview</h2>
      </div>
      <div class="metric-row">
        <span>Listing status</span>
        <strong>${formatStatus(property.status)}</strong>
      </div>
      <div class="metric-row">
        <span>Funding target</span>
        <strong>${property.fundingTarget > 0 ? formatMoney(property.fundingTarget) : "-"}</strong>
      </div>
      <div class="metric-row">
        <span>Tokens sold</span>
        <strong>${property.tokensSold || 0} / ${property.totalTokens || 0}</strong>
      </div>
      <div class="metric-row highlight">
        <span>Issuance fees earned</span>
        <strong>${formatMoney(normalizeRevenue(platformRevenue).issuanceFees)}</strong>
      </div>
    </article>
  `;
}

function renderPropertyOwnerSummary({ user, property }) {
  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Property owner</p>
        <h2>${user.name}</h2>
      </div>
      <div class="metric-row">
        <span>Listing status</span>
        <strong>${formatStatus(property.status)}</strong>
      </div>
      <div class="metric-row">
        <span>Funding target</span>
        <strong>${property.fundingTarget > 0 ? formatMoney(property.fundingTarget) : "-"}</strong>
      </div>
      <div class="metric-row">
        <span>Tokens created</span>
        <strong>${property.status === "primary_open" ? property.totalTokens : 0}</strong>
      </div>
      <div class="metric-row">
        <span>Tokens sold</span>
        <strong>${property.tokensSold || 0} / ${property.totalTokens || 0}</strong>
      </div>
      <div class="metric-row highlight">
        <span>Claimable rent</span>
        <strong>${formatMoney(user.claimableRentalIncome)}</strong>
      </div>
    </article>
  `;
}

function formatStatus(status) {
  if (status === "primary_open") {
    return "Live on Primary Market";
  }

  if (status === "pending_review") {
    return "Pending Review";
  }

  if (status === "sold_out") {
    return "Sold out";
  }

  if (status === "no_data") {
    return "Demo selection only";
  }

  return "Listing not submitted";
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeRevenue(platformRevenue) {
  if (typeof platformRevenue === "number") {
    return {
      issuanceFees: platformRevenue,
    };
  }

  return {
    issuanceFees: platformRevenue?.issuanceFees || 0,
  };
}
