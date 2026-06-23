// Primary offering service for fixed-price BrickShare property investment.

const store = require("../data/store");
const smartContract = require("./smartContractSimulator");

const DEMO_PROPERTY_ID = "property-rotterdam-student-apartments";
const ISSUANCE_FEE_RATE = 0.02;

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

function listProperty({
  propertyId,
  issuerId,
  propertyName,
  street,
  rooms,
  sizeSqm,
  propertyValue,
  fundingTarget,
  totalTokens,
  tokenPrice,
  expectedAnnualYieldPercent,
}) {
  const property = store.getPropertyById(propertyId);
  const issuer = store.getUserById(issuerId);

  if (!property) {
    return { success: false, reason: "Property does not exist." };
  }

  if (!issuer) {
    return { success: false, reason: "Property owner does not exist." };
  }

  if (property.issuerId !== issuerId) {
    return {
      success: false,
      reason: "Only the property owner can list this property.",
    };
  }

  if (!isDemoProperty(property)) {
    return {
      success: false,
      reason: "Select Rotterdam Apartment for the working demo flow.",
    };
  }

  if (!["not_listed", "pending_review"].includes(property.status)) {
    return {
      success: false,
      reason: "Property has already been approved and tokenized.",
    };
  }

  const cleanPropertyName = String(propertyName || street || "").trim();
  const cleanRooms = Number(rooms || 0);
  const cleanSizeSqm = Number(sizeSqm || 0);
  const cleanPropertyValue = Number(propertyValue);
  const cleanFundingTarget = Number(fundingTarget);
  const cleanTotalTokens = Number(totalTokens);
  const cleanTokenPrice = Number(tokenPrice);
  const cleanExpectedYield = Number(expectedAnnualYieldPercent);
  const issuanceFee = roundMoney(cleanFundingTarget * ISSUANCE_FEE_RATE);

  if (!cleanPropertyName) {
    return { success: false, reason: "Property name is required." };
  }

  if (!Number.isFinite(cleanPropertyValue) || cleanPropertyValue <= 0) {
    return {
      success: false,
      reason: "Valuation must be greater than zero.",
    };
  }

  if (!Number.isFinite(cleanFundingTarget) || cleanFundingTarget <= 0) {
    return {
      success: false,
      reason: "Funding target must be greater than zero.",
    };
  }

  if (!Number.isInteger(cleanTotalTokens) || cleanTotalTokens <= 0) {
    return {
      success: false,
      reason: "Number of tokens must be a positive whole number.",
    };
  }

  if (!Number.isFinite(cleanTokenPrice) || cleanTokenPrice <= 0) {
    return {
      success: false,
      reason: "Token price must be greater than zero.",
    };
  }

  if (!Number.isFinite(cleanExpectedYield) || cleanExpectedYield <= 0) {
    return {
      success: false,
      reason: "Expected rental yield must be greater than zero.",
    };
  }

  if (issuer.cashBalance < issuanceFee) {
    return {
      success: false,
      reason: `Property owner needs ${formatMoney(
        issuanceFee
      )} cash to pay BrickShare's 2.0% issuance fee.`,
    };
  }

  issuer.cashBalance = roundMoney(issuer.cashBalance - issuanceFee);
  store.addPlatformRevenue("issuanceFees", issuanceFee);

  const updatedProperty = store.updateProperty(propertyId, {
    status: "pending_review",
    investmentStatus: "Pending Review",
    name: cleanPropertyName,
    street: cleanPropertyName,
    rooms: cleanRooms,
    sizeSqm: cleanSizeSqm,
    propertyValue: cleanPropertyValue,
    fundingTarget: cleanFundingTarget,
    totalTokens: cleanTotalTokens,
    tokenPrice: cleanTokenPrice,
    expectedAnnualYieldPercent: cleanExpectedYield,
    issuanceFee,
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `${property.name} submitted for review. Alberto paid BrickShare's ${formatMoney(
      issuanceFee
    )} issuance fee. Status: Pending Review.`,
    property: updatedProperty,
  };
}

function approveAndTokenize({ propertyId, adminId }) {
  const property = store.getPropertyById(propertyId);
  const admin = store.getUserById(adminId);

  if (!property) {
    return { success: false, reason: "Property does not exist." };
  }

  if (!admin || admin.role !== "platform operator") {
    return { success: false, reason: "Only Admin can approve and tokenize properties." };
  }

  if (property.status !== "pending_review") {
    return {
      success: false,
      reason: "Property must be pending review before it can be approved.",
    };
  }

  store.upsertHolding({
    userId: property.issuerId,
    propertyId,
    tokenBalance: property.totalTokens,
    averagePurchasePrice: 0,
  });

  const updatedProperty = store.updateProperty(propertyId, {
    status: "primary_open",
    investmentStatus: "Live on Primary Market",
    availableTokens: property.totalTokens,
    tokensSold: 0,
    approvedAt: new Date().toISOString(),
    smartContractStatus: "Simulated smart contract deployed",
  });

  return {
    success: true,
    message: `${property.name} approved and tokenized. ${property.totalTokens} property tokens were created at ${formatMoney(property.tokenPrice)} each.`,
    property: updatedProperty,
  };
}

function buyPrimaryTokens({ propertyId, investorId, quantity }) {
  const property = store.getPropertyById(propertyId);

  if (!property) {
    return { success: false, reason: "Property does not exist." };
  }

  const result = smartContract.settlePrimaryPurchase({
    propertyId,
    issuerId: property.issuerId,
    investorId,
    quantity,
  });

  if (!result.success) {
    return result;
  }

  const investment = store.addInvestment({
    id: createId("investment"),
    propertyId,
    investorId,
    issuerId: property.issuerId,
    quantity,
    tokenPrice: result.price,
    investmentValue: result.investmentValue,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `${result.investorName} bought ${quantity} ${property.name} tokens at ${formatMoney(result.price)} each. Ownership and balances were updated automatically.`,
    investment,
    settlement: result,
  };
}

module.exports = {
  listProperty,
  approveAndTokenize,
  buyPrimaryTokens,
};

function isDemoProperty(property) {
  return property.id === DEMO_PROPERTY_ID || property.hasDemoData === true;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}
