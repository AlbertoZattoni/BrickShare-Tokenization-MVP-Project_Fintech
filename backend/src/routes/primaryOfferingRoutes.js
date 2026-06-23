// Route handlers for fixed-price primary property offerings.

const primaryOffering = require("../services/primaryOfferingService");

function listProperty(body) {
  const result = primaryOffering.listProperty({
    propertyId: body.propertyId,
    issuerId: body.issuerId,
    propertyName: body.propertyName,
    street: body.street,
    rooms: body.rooms,
    sizeSqm: body.sizeSqm,
    propertyValue: body.propertyValue,
    fundingTarget: body.fundingTarget,
    totalTokens: body.totalTokens,
    tokenPrice: body.tokenPrice,
    expectedAnnualYieldPercent: body.expectedAnnualYieldPercent,
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

function approveAndTokenize(body) {
  const result = primaryOffering.approveAndTokenize({
    propertyId: body.propertyId,
    adminId: body.adminId,
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

function buyTokens(body) {
  const result = primaryOffering.buyPrimaryTokens({
    propertyId: body.propertyId,
    investorId: body.investorId,
    quantity: Number(body.quantity),
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
  listProperty,
  approveAndTokenize,
  buyTokens,
};
