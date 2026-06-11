// Simple matching engine for the BrickShare MVP.
// It fills the smaller side of a matching buy/sell pair and leaves the rest open.

const store = require("../data/store");
const smartContract = require("./smartContractSimulator");

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getUserName(userId) {
  return store.getUserById(userId)?.name || userId;
}

function getPropertyName(propertyId) {
  return store.getPropertyById(propertyId)?.name || "the property";
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

  if (type === "buy" && user.cashBalance < quantity * limitPrice) {
    return {
      valid: false,
      reason:
        "Buyer does not have enough cash for this order at the selected limit price.",
    };
  }

  if (type === "sell") {
    const holding = store.getHolding(userId, propertyId);

    if (!holding || holding.tokenBalance < quantity) {
      return {
        valid: false,
        reason: "Seller does not have enough tokens for this sell order.",
      };
    }
  }

  return { valid: true };
}

function pricesCross(newOrder, existingOrder) {
  if (newOrder.type === "buy") {
    return newOrder.limitPrice >= existingOrder.limitPrice;
  }

  return existingOrder.limitPrice >= newOrder.limitPrice;
}

function findMatch(newOrder) {
  const oppositeType = getOppositeOrderType(newOrder.type);

  return store.getOpenOrders().find((existingOrder) => {
    return (
      existingOrder.id !== newOrder.id &&
      existingOrder.userId !== newOrder.userId &&
      existingOrder.propertyId === newOrder.propertyId &&
      existingOrder.type === oppositeType &&
      existingOrder.quantity > 0 &&
      pricesCross(newOrder, existingOrder)
    );
  });
}

function buildSettlement(newOrder, matchedOrder, quantity) {
  const buyOrder = newOrder.type === "buy" ? newOrder : matchedOrder;
  const sellOrder = newOrder.type === "sell" ? newOrder : matchedOrder;

  return {
    buyerId: buyOrder.userId,
    sellerId: sellOrder.userId,
    propertyId: newOrder.propertyId,
    quantity,
    executionPrice: sellOrder.limitPrice,
    buyOrder,
    sellOrder,
  };
}

function createTradeRecord(settlement, transferResult) {
  return {
    id: settlement.tradeId || createId("trade"),
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

function applyOrderFill(order, fillQuantity) {
  const filledQuantity = (order.filledQuantity || 0) + fillQuantity;
  const remainingQuantity = order.quantity - fillQuantity;
  const status = remainingQuantity === 0 ? "matched" : "partially_filled";

  return store.updateOrder(order.id, {
    quantity: remainingQuantity,
    filledQuantity,
    status,
  });
}

function placeOrder(orderInput) {
  const validation = validateOrderInput(orderInput);

  if (!validation.valid) {
    return {
      success: false,
      status: "rejected",
      reason: `Order rejected: ${validation.reason}`,
    };
  }

  const newOrder = {
    id: orderInput.id || createId("order"),
    userId: orderInput.userId,
    propertyId: orderInput.propertyId,
    type: orderInput.type,
    originalQuantity: orderInput.quantity,
    quantity: orderInput.quantity,
    filledQuantity: 0,
    limitPrice: orderInput.limitPrice,
    status: "open",
    createdAt: orderInput.createdAt || new Date().toISOString(),
  };

  store.addOrder(newOrder);

  const matchedTrades = [];
  let matchedOrder = findMatch(newOrder);

  while (matchedOrder && newOrder.quantity > 0) {
    const fillQuantity = Math.min(newOrder.quantity, matchedOrder.quantity);
    const settlement = buildSettlement(newOrder, matchedOrder, fillQuantity);
    const tradeId = createId("trade");
    const transferResult = smartContract.transferTokens({
      propertyId: settlement.propertyId,
      sellerId: settlement.sellerId,
      buyerId: settlement.buyerId,
      quantity: settlement.quantity,
      price: settlement.executionPrice,
      referenceId: tradeId,
    });

    if (!transferResult.success) {
      store.updateOrder(newOrder.id, {
        status: matchedTrades.length > 0 ? "partially_filled" : "rejected",
        rejectionReason: transferResult.reason,
      });

      return {
        success: matchedTrades.length > 0,
        status: matchedTrades.length > 0 ? "partially_filled" : "rejected",
        reason: `Order rejected: ${transferResult.reason}`,
        order: newOrder,
        trades: matchedTrades,
      };
    }

    applyOrderFill(newOrder, fillQuantity);
    applyOrderFill(matchedOrder, fillQuantity);

    const trade = store.addTrade(
      createTradeRecord({ ...settlement, tradeId }, transferResult)
    );
    matchedTrades.push(trade);
    matchedOrder = findMatch(newOrder);
  }

  if (matchedTrades.length === 0) {
    return {
      success: true,
      status: "open",
      message:
        "Order submitted. No matching order has crossed its price yet, so it remains open in the order book.",
      order: newOrder,
    };
  }

  const filledQuantity = matchedTrades.reduce(
    (total, trade) => total + trade.quantity,
    0
  );
  const status = newOrder.quantity > 0 ? "partially_filled" : "matched";
  const firstTrade = matchedTrades[0];
  const lastTrade = matchedTrades[matchedTrades.length - 1];

  return {
    success: true,
    status,
    message: `Trade matched: ${getUserName(firstTrade.buyerId)} bought ${
      filledQuantity
    } ${getPropertyName(firstTrade.propertyId)} tokens from ${getUserName(
      firstTrade.sellerId
    )} at ${formatMoney(firstTrade.executionPrice)} each. ${
      newOrder.quantity > 0
        ? `${newOrder.quantity} token${newOrder.quantity === 1 ? "" : "s"} remain open.`
        : "The order was fully filled."
    }`,
    order: newOrder,
    trade: lastTrade,
    trades: matchedTrades,
  };
}

module.exports = {
  validateOrderInput,
  findMatch,
  placeOrder,
};
