const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const matchingEngine = require("../backend/src/services/matchingEngine");

test("matching engine settles an exact-quantity buy order against Bob's sell order", () => {
  store.resetStore();

  const result = matchingEngine.placeOrder({
    userId: ids.ALICE_ID,
    propertyId: ids.PROPERTY_ID,
    type: "buy",
    quantity: 10,
    limitPrice: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.status, "matched");
  assert.equal(store.getTrades().length, 1);
  assert.equal(store.getOpenOrders().length, 0);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 10);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 90);

  store.resetStore();
});

test("matching engine keeps a non-exact quantity order open", () => {
  store.resetStore();

  const result = matchingEngine.placeOrder({
    userId: ids.ALICE_ID,
    propertyId: ids.PROPERTY_ID,
    type: "buy",
    quantity: 7,
    limitPrice: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.status, "open");
  assert.equal(store.getTrades().length, 0);
  assert.equal(store.getOpenOrders().length, 2);

  store.resetStore();
});
