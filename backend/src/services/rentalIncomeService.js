// Rental income service for the BrickShare MVP.
// It credits rent to token holders and lets users claim it into cash.

const store = require("../data/store");

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function distributeRentalIncome({ propertyId, rentAmount }) {
  const property = store.getPropertyById(propertyId);

  if (!property) {
    return {
      success: false,
      reason: "Property does not exist.",
    };
  }

  const distributionAmount = rentAmount ?? property.monthlyRentPool;

  if (!Number.isFinite(distributionAmount) || distributionAmount <= 0) {
    return {
      success: false,
      reason: "Rental income amount must be greater than zero.",
    };
  }

  const propertyHoldings = store
    .getHoldings()
    .filter(
      (holding) =>
        holding.propertyId === propertyId && holding.tokenBalance > 0
    );

  if (propertyHoldings.length === 0) {
    return {
      success: false,
      reason: "No token holders found for this property.",
    };
  }

  const incomePerToken = distributionAmount / property.totalTokens;
  const payouts = [];

  propertyHoldings.forEach((holding) => {
    const user = store.getUserById(holding.userId);

    if (!user) {
      return;
    }

    const amount = roundMoney(holding.tokenBalance * incomePerToken);

    if (amount <= 0) {
      return;
    }

    user.claimableRentalIncome = roundMoney(
      user.claimableRentalIncome + amount
    );

    payouts.push({
      userId: user.id,
      propertyId,
      tokenBalance: holding.tokenBalance,
      amount,
    });
  });

  const distribution = store.addRentalDistribution({
    id: createId("rent"),
    propertyId,
    rentAmount: roundMoney(distributionAmount),
    incomePerToken: roundMoney(incomePerToken),
    payouts,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Rental income distributed to current token holders.",
    distribution,
  };
}

function claimRentalIncome({ userId }) {
  const user = store.getUserById(userId);

  if (!user) {
    return {
      success: false,
      reason: "User does not exist.",
    };
  }

  const claimAmount = roundMoney(user.claimableRentalIncome);

  if (claimAmount <= 0) {
    return {
      success: false,
      reason: "No rental income available to claim.",
    };
  }

  user.cashBalance = roundMoney(user.cashBalance + claimAmount);
  user.claimableRentalIncome = 0;

  return {
    success: true,
    message: "Rental income claimed into cash balance.",
    userId,
    claimAmount,
    cashBalance: user.cashBalance,
    claimableRentalIncome: user.claimableRentalIncome,
  };
}

module.exports = {
  distributeRentalIncome,
  claimRentalIncome,
};
