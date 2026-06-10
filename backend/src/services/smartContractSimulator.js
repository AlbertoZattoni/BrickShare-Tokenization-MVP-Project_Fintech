// Simulated smart contract layer for BrickShare token ownership.
// It settles an approved trade by moving property tokens and cash balances.

const store = require("../data/store");

const TRADING_FEE_RATE = 0.005;

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function validateTransfer({ propertyId, sellerId, buyerId, quantity, price }) {
  const property = store.getPropertyById(propertyId);
  const seller = store.getUserById(sellerId);
  const buyer = store.getUserById(buyerId);
  const sellerHolding = store.getHolding(sellerId, propertyId);

  if (!property) {
    return { valid: false, reason: "Property does not exist." };
  }

  if (!seller) {
    return { valid: false, reason: "Seller does not exist." };
  }

  if (!buyer) {
    return { valid: false, reason: "Buyer does not exist." };
  }

  if (sellerId === buyerId) {
    return { valid: false, reason: "Buyer and seller must be different users." };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { valid: false, reason: "Token quantity must be greater than zero." };
  }

  if (!Number.isInteger(quantity)) {
    return { valid: false, reason: "Token quantity must be a whole number." };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { valid: false, reason: "Token price must be greater than zero." };
  }

  if (!sellerHolding || sellerHolding.tokenBalance < quantity) {
    return { valid: false, reason: "Seller does not have enough tokens." };
  }

  const tradeValue = roundMoney(quantity * price);

  if (buyer.cashBalance < tradeValue) {
    return { valid: false, reason: "Buyer does not have enough cash." };
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

function transferTokens({ propertyId, sellerId, buyerId, quantity, price }) {
  const validation = validateTransfer({
    propertyId,
    sellerId,
    buyerId,
    quantity,
    price,
  });

  if (!validation.valid) {
    return {
      success: false,
      reason: validation.reason,
    };
  }

  const buyer = store.getUserById(buyerId);
  const seller = store.getUserById(sellerId);
  const buyerHolding = getOrCreateHolding(buyerId, propertyId);
  const sellerHolding = store.getHolding(sellerId, propertyId);

  const tradeValue = roundMoney(quantity * price);
  const platformFee = roundMoney(tradeValue * TRADING_FEE_RATE);
  const sellerProceeds = roundMoney(tradeValue - platformFee);

  buyer.cashBalance = roundMoney(buyer.cashBalance - tradeValue);
  seller.cashBalance = roundMoney(seller.cashBalance + sellerProceeds);

  sellerHolding.tokenBalance -= quantity;
  buyerHolding.tokenBalance += quantity;

  buyerHolding.averagePurchasePrice = price;

  return {
    success: true,
    message: `Tokens transferred automatically: ${quantity} tokens moved from seller to buyer and ${formatMoney(
      sellerProceeds
    )} was paid to the seller after BrickShare's 0.5% fee.`,
    propertyId,
    sellerId,
    buyerId,
    quantity,
    price,
    tradeValue,
    platformFee,
    sellerProceeds,
    buyerCashBalance: buyer.cashBalance,
    sellerCashBalance: seller.cashBalance,
    buyerTokenBalance: buyerHolding.tokenBalance,
    sellerTokenBalance: sellerHolding.tokenBalance,
  };
}

module.exports = {
  TRADING_FEE_RATE,
  validateTransfer,
  transferTokens,
};
