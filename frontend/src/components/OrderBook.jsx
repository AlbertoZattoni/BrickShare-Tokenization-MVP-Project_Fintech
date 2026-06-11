// Displays open orders and recent matched trades.

export default function OrderBook({ users, orders, trades }) {
  const buyOrders = orders.filter((order) => order.type === "buy").length;
  const sellOrders = orders.filter((order) => order.type === "sell").length;

  return `
    <article class="panel wide">
      <div class="panel-header">
        <p class="eyebrow">Market activity</p>
        <h2>Order book</h2>
      </div>
      <div class="market-summary">
        <div>
          <span class="label">Open buy orders</span>
          <strong>${buyOrders}</strong>
        </div>
        <div>
          <span class="label">Open sell orders</span>
          <strong>${sellOrders}</strong>
        </div>
        <div>
          <span class="label">Completed trades</span>
          <strong>${trades.length}</strong>
        </div>
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
    return `
      <div class="empty-market">
        <strong>No tokens listed yet</strong>
        <span>The market starts empty. Bob can list tokens before Alice buys.</span>
      </div>
    `;
  }

  return `
    <div class="market-table">
      <div class="market-row market-row-head">
        <span>Investor</span>
        <span>Side</span>
        <span>Quantity</span>
        <span>Filled</span>
        <span>Status</span>
        <span>Limit</span>
      </div>
      ${orders
        .map(
          (order) => `
            <div class="market-row">
              <span>${getUserName(users, order.userId)}</span>
              <span class="pill ${order.type}">${order.type}</span>
              <span>${order.quantity} open / ${order.originalQuantity || order.quantity} total</span>
              <span>${order.filledQuantity || 0}</span>
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
    return `
      <div class="empty-market">
        <strong>No matched trades yet</strong>
        <span>A trade appears here after a buy order crosses a sell order.</span>
      </div>
    `;
  }

  return `
    <div class="market-table">
      <div class="market-row trade-row market-row-head">
        <span>Trade</span>
        <span>Quantity</span>
        <span>Price</span>
        <span>Commission</span>
      </div>
      ${trades
        .slice()
        .reverse()
        .map(
          (trade) => `
            <div class="market-row trade-row">
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
