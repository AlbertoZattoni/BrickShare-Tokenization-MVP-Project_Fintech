# Codex Instructions

These instructions guide AI coding agents working on the BrickShare MVP.

## User Prompt History

The project started with a planning-first request. Before writing code, the user asked Codex to assess the BrickShare MVP architecture for a tokenized real estate platform and propose:

- an updated project architecture
- a file structure
- a data model
- the main user flows

The original user prompt defined two core features:

- smart-contract-style ownership logic for property tokens and rental income distribution
- buyer-seller matching for a secondary market

The user then asked Codex to simplify the plan for a realistic MVP before implementation:

- use one main dashboard instead of many pages
- keep the frontend to `Dashboard`, `TradingPanel`, `PortfolioSummary`, `OrderBook`, and `RentalIncomePanel`
- use seeded demo users
- use one or a few sample properties
- use JSON-style seeded data and in-memory storage instead of a complex database
- keep the smart contract as a backend simulation, not real Solidity
- add focused tests for the core business features
- keep the code easy to explain in a 10-minute investor demo

After the plan was accepted, the user asked Codex to implement the MVP milestone by milestone and explain what was completed at each step.

## Milestone History

The initial MVP was built around a secondary-market concept:

1. Project skeleton with frontend, backend, tests, docs, README, and Codex instructions.
2. Seeded demo data with demo users, one active property, holdings, orders, trades, and rent data.
3. In-memory backend store so the demo could reset easily.
4. Smart-contract-style token transfer simulation.
5. Matching engine for buyer-seller orders.
6. Rental income distribution and claiming.
7. Backend API routes for dashboard, orders, rent, reset, and health.
8. Single dashboard UI with portfolio, trading, order book, and rental panels.
9. Demo-friendly feedback messages.
10. Core tests for matching, token transfer, and rent.
11. README, architecture notes, demo script, and Codex instructions.
12. Final verification of the end-to-end demo flow.

## Important Scope Change

After testing the secondary-market version, the user decided that buyer-seller matching, partial fills, trading commission, and the ownership ledger made the 10-minute investor demo too complex.

The MVP was then changed into a primary-market tokenization flow:

1. Alberto, the property owner, submits Rotterdam Apartment for review.
2. BrickShare records a 2.0% issuance fee paid by Alberto.
3. Listing status becomes `Pending Review`.
4. Admin approves and tokenizes the property.
5. The backend simulates smart-contract deployment and token minting.
6. The listing goes live on the primary market.
7. Serena buys fixed-price tokens directly from the listing.
8. Ownership, cash balances, and funding progress update automatically.
9. Admin distributes monthly rent.
10. Serena claims rental income.

The secondary-market matching engine, partial matching, order book, trading commission, and ownership ledger are no longer active MVP features.

## Project Goal

BrickShare is an educational MVP for a tokenized real estate platform. Keep the project simple, demo-friendly, visually polished, and easy to explain in a 10-minute investor presentation.

## Current Demo Users

- Serena: retail investor
- Alberto: property owner / issuer
- Admin: platform operator

Internal IDs may still use legacy names such as `user-alice` and `user-bob` for stability. Prefer changing display names rather than IDs.

## Architecture Rules

Preserve the three-layer MVP structure:

```text
frontend dashboard
backend API and business services
smart-contract simulation and in-memory store
```

The current backend services are:

- `primaryOfferingService`
- `smartContractSimulator`
- `rentalIncomeService`

Do not add a real blockchain, Solidity contract, database, authentication system, KYC system, or payment flow unless explicitly requested.

## Current MVP Scope

The current version uses:

- one active property: Rotterdam Apartment
- placeholder property options with no active data
- Serena as retail investor
- Alberto as property owner / issuer
- Admin as platform operator
- fixed-price primary investment
- property owner listing submission
- Admin approval and simulated token minting
- 2.0% issuance fee paid once by Alberto when submitting the listing
- in-memory storage
- backend smart-contract simulation that updates token balances, cash balances, available token supply, funding progress, rental income, and fee revenue

## Fee Logic

Keep the fee logic simple and easy to explain:

```text
Funding target = EUR 500,000
Issuance fee = 2%
BrickShare revenue = EUR 10,000
```

The issuance fee is paid once by Alberto when he submits the property listing. Serena's later token purchases should not create extra issuance fees.

## Coding Guidelines

- Keep files small and readable.
- Prefer clear names over clever abstractions.
- Keep route handlers thin.
- Put business logic in `backend/src/services/`.
- Keep seeded demo data in `backend/src/data/seedData.js`.
- Keep mutable demo state in `backend/src/data/store.js`.
- Keep the frontend as one dashboard with the existing component structure.
- Do not add an ownership ledger or blockchain registry table unless the user explicitly asks for it again.
- Do not reintroduce secondary-market order matching unless the user explicitly pivots back to secondary trading.
- Avoid new dependencies unless they clearly improve the MVP and are easy to explain.

## Testing Guidelines

Tests should stay focused on the current core features:

- property listing submission
- Admin approval and token minting
- fixed-price primary purchase
- smart-contract-style token and cash transfer
- BrickShare issuance fee revenue
- rental income distribution and claim

Use Node's built-in test runner:

```bash
node --test tests/*.test.js
```

## UX Guidelines

The target user is a retail investor who may not understand blockchain. Keep interface language clear and familiar.

Prefer:

- Submit Listing
- Approve & Tokenize
- Buy tokens
- Distribute rent
- Claim rental income
- Issuance fee
- Primary market

Avoid confusing secondary-market language in the active UI unless the user explicitly pivots back:

- order book
- bid
- ask
- sell order
- partial fill
- trading commission

Use blockchain language sparingly. Explain the smart-contract simulation as automatic backend ownership and balance updates. Do not imply that real blockchain settlement, real custody, or real payments are implemented.

## Documentation Guidelines

When adding or changing behavior, update the README or docs if the demo flow, architecture, setup, or limitations change.

The assignment values:

- working MVP
- clear architecture explanation
- clean repository
- simple run instructions
- AI-agent orchestration notes
