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
    investments = [],
    rentalDistributions,
    platformRevenue = 0,
  } = state.data;
  const selectedUser =
    users.find((user) => user.id === state.selectedUserId) || users[0];
  const property =
    properties.find((item) => item.id === state.selectedPropertyId) ||
    properties[0];
  const demoProperty = isDemoProperty(property);

  return `
    <main class="app-shell">
      <nav class="brand-bar" aria-label="BrickShare">
        <div class="brand-lockup">
          <span class="brand-mark">B</span>
          <span>BrickShare</span>
        </div>
        <div class="brand-links" aria-hidden="true">
          <span>Invest</span>
          <span>Tokenize</span>
          <span>Rent</span>
        </div>
      </nav>

      <header class="topbar">
        <div>
          <p class="eyebrow">Primary Market Demo</p>
          <h1>${property.name}</h1>
          <p class="hero-copy">Fractional property ownership with automatic rental income distribution.</p>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <span class="building tall"></span>
          <span class="building small"></span>
          <span class="sun"></span>
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
          <strong>${property.tokenPrice > 0 ? formatMoney(property.tokenPrice) : "-"}</strong>
        </div>
        <div>
          <span class="label">Available tokens</span>
          <strong>${demoProperty ? property.availableTokens : "-"}</strong>
        </div>
        <div>
          <span class="label">Expected yield</span>
          <strong>${
            property.expectedAnnualYieldPercent > 0
              ? `${property.expectedAnnualYieldPercent}%`
              : "-"
          }</strong>
        </div>
      </section>

      <section class="property-selector">
        <label>
          Property
          <select data-property-select>
            ${properties
              .map(
                (item) => `
                  <option value="${item.id}" ${item.id === property.id ? "selected" : ""}>
                    ${item.name}
                  </option>
                `
              )
              .join("")}
          </select>
        </label>
        <div>
          <span class="label">Investment status</span>
          <strong>${property.investmentStatus}</strong>
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
        ${PortfolioSummary({
          user: selectedUser,
          property,
          holdings,
          platformRevenue,
        })}
        ${TradingPanel({
          user: selectedUser,
          property,
          platformRevenue,
        })}
        ${OrderBook({ users, property, investments })}
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

function isDemoProperty(property) {
  return (
    property.id === "property-rotterdam-student-apartments" ||
    property.hasDemoData === true
  );
}
