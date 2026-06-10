// Dashboard route handlers for reading and resetting the BrickShare demo state.

const store = require("../data/store");

function getDashboard() {
  return {
    statusCode: 200,
    body: {
      success: true,
      data: store.getSnapshot(),
    },
  };
}

function resetDashboard() {
  return {
    statusCode: 200,
    body: {
      success: true,
      message: "Demo state reset to seeded BrickShare data.",
      data: store.resetStore(),
    },
  };
}

module.exports = {
  getDashboard,
  resetDashboard,
};
