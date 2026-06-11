const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const matchingEngine = require("../backend/src/services/matchingEngine");

test("matching engine settles an exact-quantity buy order against Bob's sell order", () => {
  store.resetStore();

  const sellResult = matchingEngine.placeOrder({
    userId: ids.BOB_ID,
    propertyId: ids.PROPERTY_ID,
    type: "sell",
    quantity: 12,
    limitPrice: 100,
  });

  assert.equal(sellResult.success, true);
  assert.equal(sellResult.status, "open");

  const result = matchingEngine.placeOrder({
    userId: ids.ALICE_ID,
    propertyId: ids.PROPERTY_ID,
    type: "buy",
    quantity: 12,
    limitPrice: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.status, "matched");
  assert.equal(store.getTrades().length, 1);
  assert.equal(store.getOpenOrders().length, 0);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 12);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 88);

  store.resetStore();
});

test("matching engine partially fills the smaller side and leaves the rest open", () => {
  store.resetStore();

  matchingEngine.placeOrder({
    userId: ids.BOB_ID,
    propertyId: ids.PROPERTY_ID,
    type: "sell",
    quantity: 12,
    limitPrice: 100,
  });

  const result = matchingEngine.placeOrder({
    userId: ids.ALICE_ID,
    propertyId: ids.PROPERTY_ID,
    type: "buy",
    quantity: 15,
    limitPrice: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.status, "partially_filled");
  assert.equal(store.getTrades().length, 1);
  assert.equal(store.getOpenOrders().length, 1);
  assert.equal(store.getOpenOrders()[0].quantity, 3);
  assert.equal(store.getOpenOrders()[0].filledQuantity, 12);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 12);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 88);

  store.resetStore();
});
