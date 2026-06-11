// Main one-page dashboard layout and user switcher.

import OrderBook from "./OrderBook.jsx";
import PortfolioSummary from "./PortfolioSummary.jsx";
import RentalIncomePanel from "./RentalIncomePanel.jsx";
import TradingPanel from "./TradingPanel.jsx";

export default function Dashboard({ state }) {
  if (state.loading && !state.data) {
    return `<main class="app-shell"><p class="status">Loading BrickShare...</p></main>`;
  }

  if (!state.data) {
    return `<main class="app-shell"><p class="status error">${state.error}</p></main>`;
  }

  const {
    users,
    properties,
    holdings,
    orders,
    trades,
    rentalDistributions,
    platformRevenue = 0,
  } = state.data;
  const selectedUser = users.find((user) => user.id === state.selectedUserId);
  const property = properties[0];
  const openOrders = orders.filter((order) =>
    ["open", "partially_filled"].includes(order.status)
  );

  return `
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">BrickShare MVP</p>
          <h1>Rotterdam Student Apartments</h1>
        </div>
        <button class="ghost-button" data-reset-demo>Reset demo</button>
      </header>

      <section class="property-strip">
        <div>
          <span class="label">Location</span>
          <strong>${property.location}</strong>
        </div>
        <div>
          <span class="label">Token price</span>
          <strong>${formatMoney(property.tokenPrice)}</strong>
        </div>
        <div>
          <span class="label">Monthly rent pool</span>
          <strong>${formatMoney(property.monthlyRentPool)}</strong>
        </div>
        <div>
          <span class="label">Expected yield</span>
          <strong>${property.expectedAnnualYieldPercent}%</strong>
        </div>
      </section>

      <nav class="user-switcher" aria-label="Demo user">
        ${users
          .map(
            (user) => `
              <button class="${
                user.id === selectedUser.id ? "active" : ""
              }" data-user-id="${user.id}">
                ${user.name}
                <span>${user.role}</span>
              </button>
            `
          )
          .join("")}
      </nav>

      ${
        state.notice
          ? `<p class="status ${state.noticeType || "info"}" aria-live="polite">${
              state.notice
            }</p>`
          : ""
      }
      ${
        state.error
          ? `<p class="status error" aria-live="assertive">${state.error}</p>`
          : ""
      }

      <section class="dashboard-grid">
        ${PortfolioSummary({ user: selectedUser, property, holdings })}
        ${TradingPanel({ user: selectedUser, property, platformRevenue })}
        ${OrderBook({ users, orders: openOrders, trades })}
        ${RentalIncomePanel({
          user: selectedUser,
          property,
          holdings,
          rentalDistributions,
        })}
      </section>
    </main>
  `;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
