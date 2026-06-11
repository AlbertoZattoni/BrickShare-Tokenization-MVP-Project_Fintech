// Composes the single BrickShare dashboard and owns frontend state.

import {
  claimRentalIncome,
  distributeRentalIncome,
  getDashboard,
  placeOrder,
  resetDemo,
} from "./api.js";
import Dashboard from "./components/Dashboard.jsx";

const DEFAULT_USER_ID = "user-bob";

export default function App(root) {
  const state = {
    loading: true,
    data: null,
    selectedUserId: DEFAULT_USER_ID,
    notice: "Loading BrickShare demo data...",
    noticeType: "info",
    error: "",
  };

  async function loadDashboard(nextNotice = "") {
    state.loading = true;
    state.error = "";
    state.noticeType = "info";
    render();

    try {
      const response = await getDashboard();
      state.data = response.data;
      state.notice = nextNotice || "Dashboard ready.";
      state.noticeType = nextNotice ? "success" : "info";

      if (!state.data.users.some((user) => user.id === state.selectedUserId)) {
        state.selectedUserId = DEFAULT_USER_ID;
      }
    } catch (error) {
      state.error = error.message;
      state.notice = "";
    } finally {
      state.loading = false;
      render();
    }
  }

  async function runAction(action, progressMessage, successMessage) {
    state.error = "";
    state.notice = progressMessage;
    state.noticeType = "info";
    render();

    try {
      const result = await action();
      await loadDashboard(result.message || successMessage);
    } catch (error) {
      state.error = error.message;
      state.notice = "";
      state.loading = false;
      render();
    }
  }

  const actions = {
    selectUser(userId) {
      state.selectedUserId = userId;
      const user = state.data.users.find((item) => item.id === userId);
      state.notice = `${user.name} selected. You are now viewing the ${user.role} demo perspective.`;
      state.noticeType = "info";
      render();
    },
    submitOrder(order) {
      if (!Number.isInteger(order.quantity) || order.quantity <= 0) {
        state.error = "Order rejected: quantity must be a positive whole number.";
        state.notice = "";
        render();
        return;
      }

      if (!Number.isFinite(order.limitPrice) || order.limitPrice <= 0) {
        state.error = "Order rejected: limit price must be greater than zero.";
        state.notice = "";
        render();
        return;
      }

      runAction(
        () =>
          placeOrder({
            ...order,
            userId: state.selectedUserId,
          }),
        "Submitting order to the matching engine...",
        "Order submitted."
      );
    },
    distributeRent(propertyId) {
      runAction(
        () => distributeRentalIncome(propertyId),
        "Admin is distributing rental income to current token holders...",
        "Rental income distributed."
      );
    },
    claimRent() {
      runAction(
        () => claimRentalIncome(state.selectedUserId),
        "Claiming rental income into the selected user's cash balance...",
        "Rental income claimed."
      );
    },
    reset() {
      runAction(
        () => resetDemo(),
        "Resetting the demo to the original Alice, Bob, and Admin scenario...",
        "Demo reset."
      );
    },
  };

  function render() {
    root.innerHTML = Dashboard({
      state,
    });

    root.querySelectorAll("[data-user-id]").forEach((button) => {
      button.addEventListener("click", () => {
        actions.selectUser(button.dataset.userId);
      });
    });

    const orderForm = root.querySelector("[data-order-form]");
    if (orderForm) {
      orderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(orderForm);
        actions.submitOrder({
          propertyId: formData.get("propertyId"),
          type: formData.get("type"),
          quantity: Number(formData.get("quantity")),
          limitPrice: Number(formData.get("limitPrice")),
        });
      });
    }

    const distributeButton = root.querySelector("[data-distribute-rent]");
    if (distributeButton) {
      distributeButton.addEventListener("click", () => {
        actions.distributeRent(distributeButton.dataset.propertyId);
      });
    }

    const claimButton = root.querySelector("[data-claim-rent]");
    if (claimButton) {
      claimButton.addEventListener("click", actions.claimRent);
    }

    const resetButton = root.querySelector("[data-reset-demo]");
    if (resetButton) {
      resetButton.addEventListener("click", actions.reset);
    }
  }

  loadDashboard();
}
