// Displays open orders and recent matched trades.

export default function OrderBook({ users, orders, trades }) {
  return `
    <article class="panel wide">
      <div class="panel-header">
        <p class="eyebrow">Market activity</p>
        <h2>Order book</h2>
      </div>
      <div class="market-grid">
        <div>
          <h3>Open orders</h3>
          ${renderOrders(users, orders)}
        </div>
        <div>
          <h3>Recent trades</h3>
          ${renderTrades(users, trades)}
        </div>
      </div>
    </article>
  `;
}

function renderOrders(users, orders) {
  if (orders.length === 0) {
    return `<p class="muted">No open orders.</p>`;
  }

  return `
    <div class="table">
      ${orders
        .map(
          (order) => `
            <div class="table-row">
              <span>${getUserName(users, order.userId)}</span>
              <span class="pill ${order.type}">${order.type}</span>
              <span>${order.quantity} open / ${order.originalQuantity || order.quantity} total</span>
              <span class="status-chip ${order.status}">${formatStatus(order.status)}</span>
              <strong>${formatMoney(order.limitPrice)}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderTrades(users, trades) {
  if (trades.length === 0) {
    return `<p class="muted">No trades yet.</p>`;
  }

  return `
    <div class="table">
      ${trades
        .slice()
        .reverse()
        .map(
          (trade) => `
            <div class="table-row">
              <span>${getUserName(users, trade.buyerId)} bought from ${getUserName(
                users,
                trade.sellerId
              )}</span>
              <span>${trade.quantity} tokens</span>
              <strong>${formatMoney(trade.executionPrice)}</strong>
              <span>Commission ${formatMoney(
                trade.tradingCommission || trade.platformFee || 0
              )}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function formatStatus(status) {
  if (status === "partially_filled") {
    return "Partial";
  }

  return "Open";
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
