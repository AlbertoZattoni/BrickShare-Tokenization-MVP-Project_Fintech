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

function updateProperty(propertyId, updates) {
  const property = getPropertyById(propertyId);

  if (!property) {
    return null;
  }

  Object.assign(property, updates);
  return property;
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

function getInvestments() {
  return state.investments || [];
}

function addInvestment(investment) {
  if (!state.investments) {
    state.investments = [];
  }

  state.investments.push(investment);
  return investment;
}

function addPlatformRevenue(revenueType, amount) {
  if (typeof state.platformRevenue === "number") {
    state.platformRevenue = {
      issuanceFees: state.platformRevenue,
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
  updateProperty,
  getHoldings,
  getHolding,
  upsertHolding,
  getInvestments,
  addInvestment,
  addPlatformRevenue,
  getRentalDistributions,
  addRentalDistribution,
};
