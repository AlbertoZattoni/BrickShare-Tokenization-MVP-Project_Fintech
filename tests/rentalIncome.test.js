const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const smartContract = require("../backend/src/services/smartContractSimulator");
const rentalIncome = require("../backend/src/services/rentalIncomeService");

test("rental income is distributed proportionally to current token holders", () => {
  store.resetStore();

  smartContract.transferTokens({
    propertyId: ids.PROPERTY_ID,
    sellerId: ids.BOB_ID,
    buyerId: ids.ALICE_ID,
    quantity: 10,
    price: 100,
  });

  const distributionResult = rentalIncome.distributeRentalIncome({
    propertyId: ids.PROPERTY_ID,
  });

  assert.equal(distributionResult.success, true);
  assert.equal(store.getUserById(ids.ALICE_ID).claimableRentalIncome, 20);
  assert.equal(store.getUserById(ids.BOB_ID).claimableRentalIncome, 180);
  assert.equal(store.getRentalDistributions().length, 1);

  const claimResult = rentalIncome.claimRentalIncome({
    userId: ids.ALICE_ID,
  });

  assert.equal(claimResult.success, true);
  assert.equal(claimResult.claimAmount, 20);
  assert.equal(store.getUserById(ids.ALICE_ID).cashBalance, 11020);
  assert.equal(store.getUserById(ids.ALICE_ID).claimableRentalIncome, 0);

  store.resetStore();
});
