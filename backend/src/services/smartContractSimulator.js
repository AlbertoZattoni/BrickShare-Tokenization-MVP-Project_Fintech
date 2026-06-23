// Simulated smart contract layer for BrickShare token ownership.
// It settles approved token movements by updating ownership and cash balances.

const store = require("../data/store");

const ISSUANCE_FEE_RATE = 0.02;
const MANAGEMENT_FEE_RATE = 0.01;

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function validatePrimaryPurchase({ propertyId, issuerId, investorId, quantity }) {
  const property = store.getPropertyById(propertyId);
  const issuer = store.getUserById(issuerId);
  const investor = store.getUserById(investorId);
  const issuerHolding = store.getHolding(issuerId, propertyId);

  if (!property) {
    return { valid: false, reason: "Property does not exist." };
  }

  if (property.status !== "primary_open") {
    return { valid: false, reason: "Property must be listed before investors can buy tokens." };
  }

  if (!issuer) {
    return { valid: false, reason: "Property owner does not exist." };
  }

  if (!investor) {
    return { valid: false, reason: "Investor does not exist." };
  }

  if (!investor.verified) {
    return { valid: false, reason: "Investor must be verified before buying tokens." };
  }

  if (issuerId === investorId) {
    return { valid: false, reason: "Property owner cannot buy from their own primary offering." };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, reason: "Token quantity must be a positive whole number." };
  }

  if (property.availableTokens < quantity) {
    return { valid: false, reason: "Not enough tokens are available in the primary offering." };
  }

  if (!issuerHolding || issuerHolding.tokenBalance < quantity) {
    return { valid: false, reason: "Property owner does not have enough tokens available." };
  }

  const investmentValue = roundMoney(quantity * property.tokenPrice);

  if (investor.cashBalance < investmentValue) {
    return { valid: false, reason: "Investor does not have enough cash for this purchase." };
  }

  return { valid: true };
}

function getOrCreateHolding(userId, propertyId) {
  const existingHolding = store.getHolding(userId, propertyId);

  if (existingHolding) {
    return existingHolding;
  }

  return store.upsertHolding({
    userId,
    propertyId,
    tokenBalance: 0,
    averagePurchasePrice: 0,
  });
}

function settlePrimaryPurchase({ propertyId, issuerId, investorId, quantity }) {
  const validation = validatePrimaryPurchase({
    propertyId,
    issuerId,
    investorId,
    quantity,
  });

  if (!validation.valid) {
    return {
      success: false,
      reason: validation.reason,
    };
  }

  const property = store.getPropertyById(propertyId);
  const issuer = store.getUserById(issuerId);
  const investor = store.getUserById(investorId);
  const issuerHolding = store.getHolding(issuerId, propertyId);
  const investorHolding = getOrCreateHolding(investorId, propertyId);

  const investmentValue = roundMoney(quantity * property.tokenPrice);
  const issuerProceeds = investmentValue;

  investor.cashBalance = roundMoney(investor.cashBalance - investmentValue);
  issuer.cashBalance = roundMoney(issuer.cashBalance + issuerProceeds);

  issuerHolding.tokenBalance -= quantity;
  investorHolding.tokenBalance += quantity;
  investorHolding.averagePurchasePrice = property.tokenPrice;

  store.updateProperty(propertyId, {
    availableTokens: property.availableTokens - quantity,
    tokensSold: (property.tokensSold || 0) + quantity,
    investmentStatus:
      property.availableTokens - quantity > 0
        ? "Open for fixed-price primary investment"
        : "Primary offering sold out",
    status: property.availableTokens - quantity > 0 ? "primary_open" : "sold_out",
  });

  return {
    success: true,
    propertyId,
    issuerId,
    investorId,
    issuerName: issuer.name,
    investorName: investor.name,
    quantity,
    price: property.tokenPrice,
    investmentValue,
    issuerProceeds,
    investorCashBalance: investor.cashBalance,
    issuerCashBalance: issuer.cashBalance,
    investorTokenBalance: investorHolding.tokenBalance,
    issuerTokenBalance: issuerHolding.tokenBalance,
  };
}

module.exports = {
  ISSUANCE_FEE_RATE,
  MANAGEMENT_FEE_RATE,
  validatePrimaryPurchase,
  settlePrimaryPurchase,
};
