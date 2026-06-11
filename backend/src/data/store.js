// In-memory demo store for the BrickShare MVP.
// This keeps the app easy to reset during a live demo and avoids database setup.

const { seedData } = require("./seedData");

let state = clone(seedData);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getState() {
  return state;
}

function getSnapshot() {
  return clone(state);
}

function resetStore() {
  state = clone(seedData);
  return getSnapshot();
}

function getUsers() {
  return state.users;
}

function getUserById(userId) {
  return state.users.find((user) => user.id === userId);
}

function getProperties() {
  return state.properties;
}

function getPropertyById(propertyId) {
  return state.properties.find((property) => property.id === propertyId);
}

function getHoldings() {
  return state.holdings;
}

function getHolding(userId, propertyId) {
  return state.holdings.find(
    (holding) => holding.userId === userId && holding.propertyId === propertyId
  );
}

function upsertHolding(nextHolding) {
  const index = state.holdings.findIndex(
    (holding) =>
      holding.userId === nextHolding.userId &&
      holding.propertyId === nextHolding.propertyId
  );

  if (index === -1) {
    state.holdings.push(nextHolding);
    return nextHolding;
  }

  state.holdings[index] = {
    ...state.holdings[index],
    ...nextHolding,
  };

  return state.holdings[index];
}

function getOrders() {
  return state.orders;
}

function getOpenOrders() {
  return state.orders.filter((order) =>
    ["open", "partially_filled"].includes(order.status)
  );
}

function addOrder(order) {
  state.orders.push(order);
  return order;
}

function updateOrder(orderId, updates) {
  const order = state.orders.find((item) => item.id === orderId);

  if (!order) {
    return null;
  }

  Object.assign(order, updates);
  return order;
}

function getTrades() {
  return state.trades;
}

function addTrade(trade) {
  state.trades.push(trade);
  return trade;
}

function addPlatformRevenue(revenueType, amount) {
  if (typeof state.platformRevenue === "number") {
    state.platformRevenue = {
      issuanceFees: 0,
      tradingCommissions: state.platformRevenue,
      managementFees: 0,
    };
  }

  state.platformRevenue[revenueType] =
    Math.round(((state.platformRevenue[revenueType] || 0) + amount) * 100) /
    100;
  return state.platformRevenue;
}

function getRentalDistributions() {
  return state.rentalDistributions;
}

function addRentalDistribution(distribution) {
  state.rentalDistributions.push(distribution);
  return distribution;
}

module.exports = {
  getState,
  getSnapshot,
  resetStore,
  getUsers,
  getUserById,
  getProperties,
  getPropertyById,
  getHoldings,
  getHolding,
  upsertHolding,
  getOrders,
  getOpenOrders,
  addOrder,
  updateOrder,
  getTrades,
  addTrade,
  addPlatformRevenue,
  getRentalDistributions,
  addRentalDistribution,
};
