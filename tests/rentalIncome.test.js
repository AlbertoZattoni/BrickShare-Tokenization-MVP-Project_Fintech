const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const primaryOffering = require("../backend/src/services/primaryOfferingService");
const rentalIncome = require("../backend/src/services/rentalIncomeService");

const listingInput = {
  propertyName: "Rotterdam Apartment",
  propertyValue: 500000,
  fundingTarget: 500000,
  totalTokens: 10000,
  tokenPrice: 50,
  expectedAnnualYieldPercent: 5,
};

test("rental income is distributed proportionally to current token holders", () => {
  store.resetStore();

  primaryOffering.listProperty({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    ...listingInput,
  });
  primaryOffering.approveAndTokenize({
    propertyId: ids.PROPERTY_ID,
    adminId: ids.ADMIN_ID,
  });

  primaryOffering.buyPrimaryTokens({
    propertyId: ids.PROPERTY_ID,
    investorId: ids.ALICE_ID,
    quantity: 100,
  });

  const distributionResult = rentalIncome.distributeRentalIncome({
    propertyId: ids.PROPERTY_ID,
  });

  assert.equal(distributionResult.success, true);
  assert.equal(store.getUserById(ids.ALICE_ID).claimableRentalIncome, 20);
  assert.equal(store.getUserById(ids.BOB_ID).claimableRentalIncome, 1980);
  assert.equal(store.getRentalDistributions().length, 1);

  const claimResult = rentalIncome.claimRentalIncome({
    userId: ids.ALICE_ID,
  });

  assert.equal(claimResult.success, true);
  assert.equal(claimResult.claimAmount, 20);
  assert.equal(store.getUserById(ids.ALICE_ID).cashBalance, 7020);
  assert.equal(store.getUserById(ids.ALICE_ID).claimableRentalIncome, 0);
  assert.equal(store.getUserById(ids.ALICE_ID).claimedRentalIncome, 20);

  store.resetStore();
});
