// Buy/sell form for simple token trades.

export default function TradingPanel({ user, property, platformRevenue }) {
  const defaultType = user.role === "seller" ? "sell" : "buy";
  const revenue = normalizeRevenue(platformRevenue);
  const totalRevenue =
    revenue.issuanceFees + revenue.tradingCommissions + revenue.managementFees;

  if (user.role === "admin") {
    return `
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Trading</p>
          <h2>Admin view</h2>
        </div>
        <div class="metric-row highlight">
          <span>Total platform revenue</span>
          <strong>${formatMoney(totalRevenue)}</strong>
        </div>
        <div class="metric-row">
          <span>Issuance fee, 2.0%</span>
          <strong>${formatMoney(revenue.issuanceFees)}</strong>
        </div>
        <div class="metric-row">
          <span>Trading commission, 0.5%</span>
          <strong>${formatMoney(revenue.tradingCommissions)}</strong>
        </div>
        <div class="metric-row">
          <span>Commission / management fee, 1.0% annual</span>
          <strong>${formatMoney(revenue.managementFees)}</strong>
        </div>
        <p class="muted">Fee revenue is simulated for the demo. No real payments are processed.</p>
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Secondary market</p>
        <h2>Place order</h2>
      </div>
      <p class="muted">Orders can partially fill: the smaller side trades, and the remaining tokens stay open.</p>
      <form class="trade-form" data-order-form>
        <input type="hidden" name="propertyId" value="${property.id}" />
        <label>
          Order type
          <select name="type">
            <option value="buy" ${defaultType === "buy" ? "selected" : ""}>Buy tokens</option>
            <option value="sell" ${defaultType === "sell" ? "selected" : ""}>Sell tokens</option>
          </select>
        </label>
        <label>
          Quantity
          <input name="quantity" type="number" min="1" step="1" value="12" />
        </label>
        <label>
          Limit price
          <input name="limitPrice" type="number" min="1" step="1" value="${property.tokenPrice}" />
        </label>
        <button class="primary-button" type="submit">
          Submit order
        </button>
      </form>
    </article>
  `;
}

function normalizeRevenue(platformRevenue) {
  if (typeof platformRevenue === "number") {
    return {
      issuanceFees: 0,
      tradingCommissions: platformRevenue,
      managementFees: 0,
    };
  }

  return {
    issuanceFees: platformRevenue?.issuanceFees || 0,
    tradingCommissions: platformRevenue?.tradingCommissions || 0,
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
