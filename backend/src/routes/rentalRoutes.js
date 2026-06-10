// Rental income route handlers for distribution and user claims.

const rentalIncomeService = require("../services/rentalIncomeService");

function distributeRent(body) {
  const result = rentalIncomeService.distributeRentalIncome({
    propertyId: body.propertyId,
    rentAmount:
      body.rentAmount === undefined ? undefined : Number(body.rentAmount),
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

function claimRent(body) {
  const result = rentalIncomeService.claimRentalIncome({
    userId: body.userId,
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
  distributeRent,
  claimRent,
};
