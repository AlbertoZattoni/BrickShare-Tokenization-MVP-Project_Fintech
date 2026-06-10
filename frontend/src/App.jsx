// Composes the single BrickShare dashboard and owns frontend state.

import {
  claimRentalIncome,
  distributeRentalIncome,
  getDashboard,
  placeOrder,
  resetDemo,
} from "./api.js";
import Dashboard from "./components/Dashboard.jsx";

const DEFAULT_USER_ID = "user-alice";

export default function App(root) {
  const state = {
    loading: true,
    data: null,
    selectedUserId: DEFAULT_USER_ID,
    notice: "Loading BrickShare demo data...",
    error: "",
  };

  async function loadDashboard(nextNotice = "") {
    state.loading = true;
    state.error = "";
    render();

    try {
      const response = await getDashboard();
      state.data = response.data;
      state.notice = nextNotice || "Dashboard ready.";

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

  async function runAction(action, successMessage) {
    state.error = "";
    state.notice = "Processing...";
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
      render();
    },
    submitOrder(order) {
      runAction(
        () =>
          placeOrder({
            ...order,
            userId: state.selectedUserId,
          }),
        "Order submitted."
      );
    },
    distributeRent(propertyId) {
      runAction(
        () => distributeRentalIncome(propertyId),
        "Rental income distributed."
      );
    },
    claimRent() {
      runAction(
        () => claimRentalIncome(state.selectedUserId),
        "Rental income claimed."
      );
    },
    reset() {
      runAction(() => resetDemo(), "Demo reset.");
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
