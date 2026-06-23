# Architecture

BrickShare's MVP is intentionally small and demo-oriented. It uses one dashboard, one active property, three seeded users, and an in-memory backend. The goal is to prove the core mechanism of fixed-price primary real estate token investment rather than build a production financial platform.

## Architecture Overview

```text
Frontend Dashboard
Dashboard, TradingPanel, PortfolioSummary, OrderBook, RentalIncomePanel
        |
        v
Backend API
dashboard, property listing, primary investment, rent distribution, rent claim, reset
        |
        v
Business Services
primaryOfferingService, smartContractSimulator, rentalIncomeService
        |
        v
In-Memory Store
seeded users, properties, holdings, investments, rental distributions
```

## Frontend Layer

The frontend is a single dashboard served from `frontend/server.js`.

Main files:

- `frontend/src/App.jsx`
- `frontend/src/api.js`
- `frontend/src/components/Dashboard.jsx`
- `frontend/src/components/TradingPanel.jsx`
- `frontend/src/components/PortfolioSummary.jsx`
- `frontend/src/components/OrderBook.jsx`
- `frontend/src/components/RentalIncomePanel.jsx`

The UI lets a demo user:

- view Rotterdam Apartment
- switch between Serena, Alberto, and Admin
- select a property
- submit a property listing as the property owner
- approve and tokenize the property as Admin
- buy fixed-price primary tokens as an investor
- see cash, token balances, and claimable rent
- view recent primary investments
- distribute or claim rental income

The frontend hides the blockchain complexity behind clear actions such as "Submit Listing", "Approve & Tokenize", "Buy tokens", "Distribute rent", and "Claim rental income".

## Backend API Layer

The backend is served from `backend/src/server.js` using Node's built-in HTTP module. It exposes:

```text
GET  /api/health
GET  /api/dashboard
POST /api/properties/list
POST /api/investments
POST /api/rent/distribute
POST /api/rent/claim
POST /api/reset
```

The route files are deliberately thin:

- `dashboardRoutes.js` returns or resets demo state.
- `primaryOfferingRoutes.js` passes listing and purchase requests to the primary offering service.
- `rentalRoutes.js` passes rental requests to the rental income service.

## Primary Offering Service

File:

```text
backend/src/services/primaryOfferingService.js
```

The primary offering service handles the current MVP investment flow:

- Alberto submits Rotterdam Apartment for review.
- Alberto provides property name, valuation, funding target, number of tokens, token price, and expected rental yield.
- Admin approves and tokenizes the property.
- Serena selects the property.
- Serena chooses how many fixed-price tokens to buy.
- The service calls the smart contract simulator to settle the purchase.

## Smart Contract Simulation Layer

File:

```text
backend/src/services/smartContractSimulator.js
```

This layer represents the smart-contract-style ownership logic. It simulates what a contract would do after a valid primary purchase:

- validate property listing status
- validate property owner token balance
- validate investor cash balance
- transfer tokens from Alberto to Serena
- transfer cash from Serena to Alberto
- reduce available token supply
- return updated balances

During Admin approval, the backend mints the approved token supply:

```text
tokens minted = approved number of tokens
```

For the demo:

```text
10,000 tokens at EUR 50 each
```

This is not Solidity. It is a backend simulation used to demonstrate the business logic without blockchain deployment complexity.

BrickShare's 2.0% issuance fee is charged once when the property owner submits the listing for review. It is not charged on each investor purchase.

## Rental Income Service

File:

```text
backend/src/services/rentalIncomeService.js
```

Admin can distribute the property's monthly rental pool. The service calculates:

```text
income per token = rent amount / total tokens
user payout = user token balance * income per token
```

Users can then claim their rental income, moving it from `claimableRentalIncome` into `cashBalance`.

## Data Model

Seed data lives in:

```text
backend/src/data/seedData.js
```

The first MVP uses:

- Serena as retail investor
- Alberto as property owner / issuer
- Admin as platform operator
- Rotterdam Apartment as the active property
- Amsterdam Canal Studios as a placeholder property selector option
- property status starts as not listed, so Alberto can tokenize/list it during the demo

Runtime state is held in:

```text
backend/src/data/store.js
```

The store tracks:

- users
- properties
- holdings
- investments
- rental distributions

The store is in-memory only. It is reset with `POST /api/reset` or when the backend restarts.

## Implemented Business Plan Features

Implemented:

- fractional property tokens
- smart-contract-style ownership balance simulation
- fixed-price primary investment
- automatic token transfer
- rental income distribution
- simple retail investor dashboard

Not implemented:

- real blockchain deployment
- real wallet connection
- legal KYC/AML workflow
- real payments
- secondary-market trading
- production database

## Technical Risks and Scaling Needs

To scale this beyond the MVP, BrickShare would need:

- audited smart contracts
- persistent database storage
- authentication and role-based access
- KYC/AML checks
- payment provider integration
- compliance review for security-token rules
- secondary-market liquidity and trading rules
- monitoring, logging, and operational security
