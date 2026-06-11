// Seeded demo data for the first BrickShare MVP scenario.
// Milestone 2 only defines the data shape; business logic is added later.

const PROPERTY_ID = "property-rotterdam-student-apartments";
const ALICE_ID = "user-alice";
const BOB_ID = "user-bob";
const ADMIN_ID = "user-admin";

const PROPERTY_TOTAL_VALUE = 1000 * 100;
const ISSUANCE_FEE_RATE = 0.02;
const MANAGEMENT_FEE_RATE = 0.01;

const seedData = {
  users: [
    {
      id: ALICE_ID,
      name: "Alice",
      role: "buyer",
      cashBalance: 12000,
      claimableRentalIncome: 0,
      claimedRentalIncome: 0,
      verified: true,
    },
    {
      id: BOB_ID,
      name: "Bob",
      role: "seller",
      cashBalance: 2500,
      claimableRentalIncome: 0,
      claimedRentalIncome: 0,
      verified: true,
    },
    {
      id: ADMIN_ID,
      name: "Admin",
      role: "admin",
      cashBalance: 0,
      claimableRentalIncome: 0,
      claimedRentalIncome: 0,
      verified: true,
    },
  ],

  properties: [
    {
      id: PROPERTY_ID,
      name: "Rotterdam Student Apartments",
      location: "Rotterdam, Netherlands",
      description:
        "A tokenized student housing property used to demonstrate fractional ownership, secondary-market trading, and rental income distribution.",
      totalTokens: 1000,
      tokenPrice: 100,
      monthlyRentPool: 2000,
      expectedAnnualYieldPercent: 4.8,
      status: "trading",
    },
  ],

  holdings: [
    {
      userId: ALICE_ID,
      propertyId: PROPERTY_ID,
      tokenBalance: 0,
      averagePurchasePrice: 0,
    },
    {
      userId: BOB_ID,
      propertyId: PROPERTY_ID,
      tokenBalance: 100,
      averagePurchasePrice: 90,
    },
  ],

  orders: [],

  trades: [],

  platformRevenue: {
    issuanceFees: PROPERTY_TOTAL_VALUE * ISSUANCE_FEE_RATE,
    tradingCommissions: 0,
    managementFees: PROPERTY_TOTAL_VALUE * MANAGEMENT_FEE_RATE,
  },

  rentalDistributions: [],
};

module.exports = {
  seedData,
  ids: {
    PROPERTY_ID,
    ALICE_ID,
    BOB_ID,
    ADMIN_ID,
  },
};
