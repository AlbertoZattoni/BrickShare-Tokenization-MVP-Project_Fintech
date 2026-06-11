// Order route handler for the BrickShare matching engine.

const matchingEngine = require("../services/matchingEngine");

function createOrder(body) {
  const result = matchingEngine.placeOrder({
    userId: body.userId,
    propertyId: body.propertyId,
    type: body.type,
    quantity: Number(body.quantity),
    limitPrice: Number(body.limitPrice),
  });

  if (!result.success) {
    return {
      statusCode: 400,
      body: result,
    };
  }

  return {
    statusCode: 200,
    body: result,
  };
}

module.exports = {
  createOrder,
};
