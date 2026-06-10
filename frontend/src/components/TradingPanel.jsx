// Buy/sell form for exact-quantity token trades.

export default function TradingPanel({ user, property }) {
  const defaultType = user.role === "seller" ? "sell" : "buy";

  if (user.role === "admin") {
    return `
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Trading</p>
          <h2>Admin view</h2>
        </div>
        <p class="muted">Switch to Alice or Bob to place demo buy and sell orders.</p>
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel-header">
        <p class="eyebrow">Secondary market</p>
        <h2>Place order</h2>
      </div>
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
          Exact quantity
          <input name="quantity" type="number" min="1" step="1" value="10" />
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
