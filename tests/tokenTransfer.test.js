const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const smartContract = require("../backend/src/services/smartContractSimulator");

test("smart contract simulator transfers tokens and cash with BrickShare fee", () => {
  store.resetStore();

  const result = smartContract.transferTokens({
    propertyId: ids.PROPERTY_ID,
    sellerId: ids.BOB_ID,
    buyerId: ids.ALICE_ID,
    quantity: 10,
    price: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.tradeValue, 1000);
  assert.equal(result.platformFee, 5);
  assert.equal(result.tradingCommission, 5);
  assert.equal(result.sellerProceeds, 995);
  assert.equal(store.getState().platformRevenue.issuanceFees, 2000);
  assert.equal(store.getState().platformRevenue.tradingCommissions, 5);
  assert.equal(store.getState().platformRevenue.managementFees, 1000);
  assert.equal(store.getUserById(ids.ALICE_ID).cashBalance, 11000);
  assert.equal(store.getUserById(ids.BOB_ID).cashBalance, 3495);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 10);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 90);

  store.resetStore();
});

test("smart contract simulator rejects a seller without enough tokens", () => {
  store.resetStore();

  const result = smartContract.transferTokens({
    propertyId: ids.PROPERTY_ID,
    sellerId: ids.ALICE_ID,
    buyerId: ids.BOB_ID,
    quantity: 10,
    price: 100,
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "Seller does not have enough tokens.");
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 0);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 100);

  store.resetStore();
});
