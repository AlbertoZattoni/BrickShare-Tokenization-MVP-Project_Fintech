// Exact-quantity matching engine for the BrickShare MVP.
// Version one does not support partial fills; quantities must match exactly.

const store = require("../data/store");
const smartContract = require("./smartContractSimulator");

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getOppositeOrderType(type) {
  if (type === "buy") {
    return "sell";
  }

  if (type === "sell") {
    return "buy";
  }

  return null;
}

function validateOrderInput({ userId, propertyId, type, quantity, limitPrice }) {
  const user = store.getUserById(userId);
  const property = store.getPropertyById(propertyId);
  const oppositeType = getOppositeOrderType(type);

  if (!user) {
    return { valid: false, reason: "User does not exist." };
  }

  if (!property) {
    return { valid: false, reason: "Property does not exist." };
  }

  if (!oppositeType) {
    return { valid: false, reason: "Order type must be buy or sell." };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, reason: "Order quantity must be a positive whole number." };
  }

  if (!Number.isFinite(limitPrice) || limitPrice <= 0) {
    return { valid: false, reason: "Limit price must be greater than zero." };
  }

  return { valid: true };
}

function pricesCross(newOrder, existingOrder) {
  if (newOrder.type === "buy") {
    return newOrder.limitPrice >= existingOrder.limitPrice;
  }

  return existingOrder.limitPrice >= newOrder.limitPrice;
}

function findExactMatch(newOrder) {
  const oppositeType = getOppositeOrderType(newOrder.type);

  return store.getOpenOrders().find((existingOrder) => {
    return (
      existingOrder.userId !== newOrder.userId &&
      existingOrder.propertyId === newOrder.propertyId &&
      existingOrder.type === oppositeType &&
      existingOrder.quantity === newOrder.quantity &&
      pricesCross(newOrder, existingOrder)
    );
  });
}

function buildSettlement(newOrder, matchedOrder) {
  const buyOrder = newOrder.type === "buy" ? newOrder : matchedOrder;
  const sellOrder = newOrder.type === "sell" ? newOrder : matchedOrder;

  return {
    buyerId: buyOrder.userId,
    sellerId: sellOrder.userId,
    propertyId: newOrder.propertyId,
    quantity: newOrder.quantity,
    executionPrice: sellOrder.limitPrice,
    buyOrder,
    sellOrder,
  };
}

function createTradeRecord(settlement, transferResult) {
  return {
    id: createId("trade"),
    propertyId: settlement.propertyId,
    buyerId: settlement.buyerId,
    sellerId: settlement.sellerId,
    quantity: settlement.quantity,
    executionPrice: settlement.executionPrice,
    tradeValue: transferResult.tradeValue,
    platformFee: transferResult.platformFee,
    buyOrderId: settlement.buyOrder.id,
    sellOrderId: settlement.sellOrder.id,
    createdAt: new Date().toISOString(),
  };
}

function placeOrder(orderInput) {
  const validation = validateOrderInput(orderInput);

  if (!validation.valid) {
    return {
      success: false,
      status: "rejected",
      reason: validation.reason,
    };
  }

  const newOrder = {
    id: orderInput.id || createId("order"),
    userId: orderInput.userId,
    propertyId: orderInput.propertyId,
    type: orderInput.type,
    quantity: orderInput.quantity,
    limitPrice: orderInput.limitPrice,
    status: "open",
    createdAt: orderInput.createdAt || new Date().toISOString(),
  };

  store.addOrder(newOrder);

  const matchedOrder = findExactMatch(newOrder);

  if (!matchedOrder) {
    return {
      success: true,
      status: "open",
      message: "Order submitted. No exact match found yet.",
      order: newOrder,
    };
  }

  const settlement = buildSettlement(newOrder, matchedOrder);
  const transferResult = smartContract.transferTokens({
    propertyId: settlement.propertyId,
    sellerId: settlement.sellerId,
    buyerId: settlement.buyerId,
    quantity: settlement.quantity,
    price: settlement.executionPrice,
  });

  if (!transferResult.success) {
    store.updateOrder(newOrder.id, {
      status: "rejected",
      rejectionReason: transferResult.reason,
    });

    return {
      success: false,
      status: "rejected",
      reason: transferResult.reason,
      order: newOrder,
    };
  }

  store.updateOrder(newOrder.id, { status: "matched" });
  store.updateOrder(matchedOrder.id, { status: "matched" });

  const trade = store.addTrade(createTradeRecord(settlement, transferResult));

  return {
    success: true,
    status: "matched",
    message: "Trade matched and settled.",
    order: newOrder,
    matchedOrder,
    trade,
    settlement: transferResult,
  };
}

module.exports = {
  validateOrderInput,
  findExactMatch,
  placeOrder,
};
