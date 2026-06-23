// Fixed-price primary investment panel.

export default function TradingPanel({ user, property, platformRevenue }) {
  const revenue = normalizeRevenue(platformRevenue);
  const totalRevenue = revenue.issuanceFees;

  if (user.role === "platform operator") {
    const canApprove = property.status === "pending_review";
    const alreadyApproved =
      property.status === "primary_open" || property.status === "sold_out";

    return `
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Platform</p>
          <h2>Admin review</h2>
        </div>
        <div class="metric-row">
          <span>Property status</span>
          <strong>${formatStatus(property.status)}</strong>
        </div>
        <div class="metric-row">
          <span>Requested tokens</span>
          <strong>${property.totalTokens || 0}</strong>
        </div>
        <button class="primary-button" type="button" data-approve-property data-property-id="${property.id}" ${
      canApprove ? "" : "disabled"
    }>
          ${alreadyApproved ? "Already Approved" : "Approve & Tokenize"}
        </button>
        <div class="metric-row highlight">
          <span>Total platform revenue</span>
          <strong>${formatMoney(totalRevenue)}</strong>
        </div>
        <div class="metric-row">
          <span>Issuance fee, 2.0%</span>
          <strong>${formatMoney(revenue.issuanceFees)}</strong>
        </div>
        <p class="muted">Fee revenue is simulated for the demo. No real payments are processed.</p>
      </article>
    `;
  }

  if (user.role === "property owner") {
    const demoProperty = isDemoProperty(property);
    const canList =
      property.issuerId === user.id &&
      property.status === "not_listed" &&
      demoProperty;

    return `
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Property owner</p>
          <h2>Submit listing</h2>
        </div>
        <form class="trade-form" data-listing-form>
          <input type="hidden" name="propertyId" value="${property.id}" />
          <label>
            Property name
            <input name="propertyName" value="${property.name || "Rotterdam Apartment"}" ${
      canList ? "" : "disabled"
    } />
          </label>
          <label>
            Valuation
            <input name="propertyValue" type="number" min="1" step="1" value="${
              property.propertyValue || 500000
            }" ${canList ? "" : "disabled"} />
          </label>
          <label>
            Funding target
            <input name="fundingTarget" type="number" min="1" step="1" value="${
              property.fundingTarget || 500000
            }" ${canList ? "" : "disabled"} />
          </label>
          <label>
            Number of tokens
            <input name="totalTokens" type="number" min="1" step="1" value="${
              property.totalTokens || 10000
            }" ${canList ? "" : "disabled"} />
          </label>
          <label>
            Token price
            <input name="tokenPrice" type="number" min="1" step="1" value="${
              property.tokenPrice || 50
            }" ${canList ? "" : "disabled"} />
          </label>
          <label>
            Expected rental yield
            <input name="expectedAnnualYieldPercent" type="number" min="0.1" step="0.1" value="${
              property.expectedAnnualYieldPercent || 5
            }" ${canList ? "" : "disabled"} />
          </label>
          <div class="document-checks">
            <span>Valuation report uploaded</span>
            <span>Ownership proof uploaded</span>
            <span>Rental information uploaded</span>
          </div>
          <button class="primary-button" type="submit" ${canList ? "" : "disabled"}>
            ${property.status === "not_listed" ? "Submit Listing" : "Listing submitted"}
          </button>
        </form>
        <p class="muted">${
          demoProperty
            ? "Submitting the listing is the off-chain review step. Admin approval creates the simulated smart contract and mints tokens."
            : "Select Rotterdam Apartment for the working demo flow."
        }</p>
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Primary offering</p>
        <h2>Invest in property</h2>
      </div>
      <p class="muted">Fixed price: ${formatMoney(property.tokenPrice)} per token. Choose quantity only.</p>
      <form class="trade-form" data-order-form>
        <input type="hidden" name="propertyId" value="${property.id}" />
        <label>
          Token quantity
          <input name="quantity" type="number" min="1" step="1" value="100" />
        </label>
        <div class="metric-row">
          <span>Fixed token price</span>
          <strong>${formatMoney(property.tokenPrice)}</strong>
        </div>
        <button class="primary-button" type="submit" ${
          property.status === "primary_open" ? "" : "disabled"
        }>
          Buy tokens
        </button>
      </form>
      <p class="muted">${
        property.status === "primary_open"
          ? `${property.availableTokens} tokens are available in this primary offering.`
          : "The property must be approved and tokenized before investors can buy tokens."
      }</p>
    </article>
  `;
}

function normalizeRevenue(platformRevenue) {
  if (typeof platformRevenue === "number") {
    return {
      issuanceFees: 0,
      managementFees: 0,
    };
  }

  return {
    issuanceFees: platformRevenue?.issuanceFees || 0,
    managementFees: platformRevenue?.managementFees || 0,
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatStatus(status) {
  if (status === "pending_review") {
    return "Pending Review";
  }

  if (status === "primary_open") {
    return "Live on Primary Market";
  }

  if (status === "sold_out") {
    return "Sold out";
  }

  return "Listing not submitted";
}

function isDemoProperty(property) {
  return (
    property.id === "property-rotterdam-student-apartments" ||
    property.hasDemoData === true
  );
}
