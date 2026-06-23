// Composes the single BrickShare dashboard and owns frontend state.

import {
  approveAndTokenize,
  buyPrimaryTokens,
  claimRentalIncome,
  distributeRentalIncome,
  getDashboard,
  listProperty,
  resetDemo,
} from "./api.js";
import Dashboard from "./components/Dashboard.jsx";

const DEFAULT_USER_ID = "user-alice";
const ADMIN_USER_ID = "user-admin";

export default function App(root) {
  const state = {
    loading: true,
    data: null,
    selectedUserId: DEFAULT_USER_ID,
    selectedPropertyId: "property-rotterdam-student-apartments",
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

      if (
        !state.data.properties.some(
          (property) => property.id === state.selectedPropertyId
        )
      ) {
        state.selectedPropertyId = state.data.properties[0].id;
      }
    } catch (error) {
      state.error = error.message;
      state.notice = "";
    } finally {
      state.loading = false;
      render();
    }
  }

  async function runAction(action, progressMessage, successMessage, afterSuccess) {
    state.error = "";
    state.notice = progressMessage;
    state.noticeType = "info";
    render();

    try {
      const result = await action();
      if (afterSuccess) {
        afterSuccess(result);
      }
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
    selectProperty(propertyId) {
      state.selectedPropertyId = propertyId;
      const property = state.data.properties.find((item) => item.id === propertyId);
      state.notice = `${property.name} selected.`;
      state.noticeType = "info";
      render();
    },
    listSelectedProperty(listing) {
      runAction(
        () =>
          listProperty({
            ...listing,
            issuerId: state.selectedUserId,
          }),
        "Submitting the property listing for Admin review...",
        "Property submitted for review.",
        () => {
          state.selectedUserId = ADMIN_USER_ID;
        }
      );
    },
    approveProperty(propertyId) {
      runAction(
        () => approveAndTokenize(propertyId, state.selectedUserId),
        "Admin is approving and tokenizing the property...",
        "Property approved and tokenized."
      );
    },
    buyTokens(investment) {
      if (!Number.isInteger(investment.quantity) || investment.quantity <= 0) {
        state.error = "Purchase rejected: quantity must be a positive whole number.";
        state.notice = "";
        render();
        return;
      }

      runAction(
        () =>
          buyPrimaryTokens({
            ...investment,
            investorId: state.selectedUserId,
          }),
        "Buying fixed-price property tokens...",
        "Tokens purchased."
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
        "Resetting the demo to the original Serena, Alberto, and Admin scenario...",
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
        actions.buyTokens({
          propertyId: formData.get("propertyId"),
          quantity: Number(formData.get("quantity")),
        });
      });
    }

    const propertySelect = root.querySelector("[data-property-select]");
    if (propertySelect) {
      propertySelect.addEventListener("change", () => {
        actions.selectProperty(propertySelect.value);
      });
    }

    const listingForm = root.querySelector("[data-listing-form]");
    if (listingForm) {
      listingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(listingForm);
        actions.listSelectedProperty({
          propertyId: formData.get("propertyId"),
          propertyName: formData.get("propertyName"),
          propertyValue: Number(formData.get("propertyValue")),
          fundingTarget: Number(formData.get("fundingTarget")),
          totalTokens: Number(formData.get("totalTokens")),
          tokenPrice: Number(formData.get("tokenPrice")),
          expectedAnnualYieldPercent: Number(
            formData.get("expectedAnnualYieldPercent")
          ),
        });
      });
    }

    root.querySelectorAll("[data-approve-property]").forEach((approveButton) => {
      approveButton.addEventListener("click", () => {
        actions.approveProperty(approveButton.dataset.propertyId);
      });
    });

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
