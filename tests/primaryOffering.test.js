const assert = require("node:assert/strict");
const test = require("node:test");

const store = require("../backend/src/data/store");
const { ids } = require("../backend/src/data/seedData");
const primaryOffering = require("../backend/src/services/primaryOfferingService");

const listingInput = {
  propertyName: "Rotterdam Apartment",
  propertyValue: 500000,
  fundingTarget: 500000,
  totalTokens: 10000,
  tokenPrice: 50,
  expectedAnnualYieldPercent: 5,
};

test("property owner submits the property for review", () => {
  store.resetStore();

  const result = primaryOffering.listProperty({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    ...listingInput,
  });

  const property = store.getPropertyById(ids.PROPERTY_ID);

  assert.equal(result.success, true);
  assert.equal(property.status, "pending_review");
  assert.equal(property.investmentStatus, "Pending Review");
  assert.equal(property.name, "Rotterdam Apartment");
  assert.equal(property.street, "Rotterdam Apartment");
  assert.equal(property.propertyValue, 500000);
  assert.equal(property.fundingTarget, 500000);
  assert.equal(property.totalTokens, 10000);
  assert.equal(property.tokenPrice, 50);
  assert.equal(property.availableTokens, 0);
  assert.equal(property.issuanceFee, 10000);
  assert.equal(store.getUserById(ids.BOB_ID).cashBalance, 15000);
  assert.equal(store.getState().platformRevenue.issuanceFees, 10000);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID), undefined);

  store.resetStore();
});

test("admin approves and tokenizes the property", () => {
  store.resetStore();

  primaryOffering.listProperty({
    propertyId: ids.PROPERTY_ID,
    issuerId: ids.BOB_ID,
    ...listingInput,
  });

  const result = primaryOffering.approveAndTokenize({
    propertyId: ids.PROPERTY_ID,
    adminId: ids.ADMIN_ID,
  });

  const property = store.getPropertyById(ids.PROPERTY_ID);

  assert.equal(result.success, true);
  assert.equal(property.status, "primary_open");
  assert.equal(property.investmentStatus, "Live on Primary Market");
  assert.equal(property.availableTokens, 10000);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 10000);

  store.resetStore();
});

test("investor buys fixed-price primary tokens after approval", () => {
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

  const result = primaryOffering.buyPrimaryTokens({
    propertyId: ids.PROPERTY_ID,
    investorId: ids.ALICE_ID,
    quantity: 100,
  });

  assert.equal(result.success, true);
  assert.equal(store.getInvestments().length, 1);
  assert.equal(store.getPropertyById(ids.PROPERTY_ID).availableTokens, 9900);
  assert.equal(store.getPropertyById(ids.PROPERTY_ID).tokensSold, 100);
  assert.equal(store.getUserById(ids.ALICE_ID).cashBalance, 7000);
  assert.equal(store.getUserById(ids.BOB_ID).cashBalance, 20000);
  assert.equal(store.getState().platformRevenue.issuanceFees, 10000);
  assert.equal(store.getHolding(ids.ALICE_ID, ids.PROPERTY_ID).tokenBalance, 100);
  assert.equal(store.getHolding(ids.BOB_ID, ids.PROPERTY_ID).tokenBalance, 9900);

  store.resetStore();
});
