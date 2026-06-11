# Architecture

BrickShare's MVP is intentionally small and demo-oriented. It uses one dashboard, one property, three seeded users, and an in-memory backend. The goal is to prove the core mechanism of tokenized real estate rather than build a production financial platform.

## Architecture Overview

```text
Frontend Dashboard
Dashboard, TradingPanel, PortfolioSummary, OrderBook, RentalIncomePanel
        |
        v
Backend API
dashboard, orders, rent distribution, rent claim, reset
        |
        v
Business Services
matchingEngine, smartContractSimulator, rentalIncomeService
        |
        v
In-Memory Store
seeded users, property, holdings, orders, trades, rental distributions
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

- view Rotterdam Student Apartments
- switch between Alice, Bob, and Admin
- place buy or sell orders
- see cash, token balances, and claimable rent
- view open orders and recent trades
- distribute or claim rental income

The frontend hides the blockchain complexity behind clear actions such as "Submit order", "Distribute rent", and "Claim rental income".

## Backend API Layer

The backend is served from `backend/src/server.js` using Node's built-in HTTP module. It exposes:

```text
GET  /api/health
GET  /api/dashboard
POST /api/orders
POST /api/rent/distribute
POST /api/rent/claim
POST /api/reset
```

The route files are deliberately thin:

- `dashboardRoutes.js` returns or resets demo state.
- `orderRoutes.js` passes order requests to the matching engine.
- `rentalRoutes.js` passes rental requests to the rental income service.

## Matching Engine

File:

```text
backend/src/services/matchingEngine.js
```

The matching engine receives buy and sell orders and looks for a compatible opposite-side order.

Version-one matching rule:

```text
same property
opposite order type
buy price >= sell price
```

If quantities differ, the smaller quantity is executed and the remaining quantity stays open. This keeps partial matching visible while still being easy to explain in a 10-minute investor demo.

When a match is found, the matching engine calls the smart contract simulator. It does not directly update token ownership itself.

## Smart Contract Simulation Layer

File:

```text
backend/src/services/smartContractSimulator.js
```

This layer represents the smart-contract-style ownership logic. It simulates what a contract would do after a valid match:

- validate seller token balance
- validate buyer cash balance
- transfer tokens from seller to buyer
- transfer cash from buyer to seller
- apply BrickShare's 0.5% trading fee
- return updated balances

This is not Solidity. It is a backend simulation used to demonstrate the business logic without blockchain deployment complexity.

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

- Alice as buyer
- Bob as seller
- Admin as demo controller
- Rotterdam Student Apartments as the only property
- Bob's seeded 10-token sell order

Runtime state is held in:

```text
backend/src/data/store.js
```

The store tracks:

- users
- properties
- holdings
- orders
- trades
- rental distributions

The store is in-memory only. It is reset with `POST /api/reset` or when the backend restarts.

## Implemented Business Plan Features

Implemented:

- fractional property tokens
- smart-contract-style ownership balance simulation
- secondary market matching
- automatic token transfer
- rental income distribution
- simple retail investor dashboard

Not implemented:

- real blockchain deployment
- real wallet connection
- legal KYC/AML workflow
- real payments
- full order book mechanics
- production database

## Technical Risks and Scaling Needs

To scale this beyond the MVP, BrickShare would need:

- audited smart contracts
- persistent database storage
- authentication and role-based access
- KYC/AML checks
- payment provider integration
- compliance review for security-token rules
- stronger market rules for liquidity and partial fills
- monitoring, logging, and operational security
