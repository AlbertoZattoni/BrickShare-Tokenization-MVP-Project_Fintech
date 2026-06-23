const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const smartContract = require("../backend/src/services/smartContractSimulator");
const primaryOffering = require("../backend/src/services/primaryOfferingService");

const listingInput = {
  propertyName: "Rotterdam Apartment",
  propertyValue: 500000,
  fundingTarget: 500000,
  totalTokens: 10000,
  tokenPrice: 50,
  expectedAnnualYieldPercent: 5,
};

test("smart contract simulator settles a primary token purchase after listing fee", () => {
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

  const result = smartContract.settlePrimaryPurchase({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    investorId: ids.ALICE_ID,
    quantity: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.investmentValue, 5000);
  assert.equal(result.issuanceFee, undefined);
  assert.equal(result.issuerProceeds, 5000);
  assert.equal(store.getState().platformRevenue.issuanceFees, 10000);
  assert.equal(store.getState().platformRevenue.managementFees, 0);
  assert.equal(store.getUserById(ids.ALICE_ID).cashBalance, 7000);
  assert.equal(store.getUserById(ids.BOB_ID).cashBalance, 20000);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 100);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 9900);

  store.resetStore();
});

test("smart contract simulator rejects primary purchase before listing", () => {
  store.resetStore();

  const result = smartContract.settlePrimaryPurchase({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    investorId: ids.ALICE_ID,
    quantity: 12,
  });

  assert.equal(result.success, false);
  assert.equal(
    result.reason,
    "Property must be listed before investors can buy tokens."
  );
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 0);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID), undefined);

  store.resetStore();
});

test("smart contract simulator rejects an unverified investor", () => {
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

  store.getUserById(ids.ALICE_ID).verified = false;

  const result = smartContract.settlePrimaryPurchase({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    investorId: ids.ALICE_ID,
    quantity: 100,
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "Investor must be verified before buying tokens.");
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 0);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 10000);

  store.resetStore();
});
