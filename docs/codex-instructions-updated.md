# Updated Codex Instructions

These notes replace the stale `.codex/instructions.md` content. They preserve the original secondary-market planning history while documenting the final primary-market MVP.

## User Prompt History

The project started with a planning-first request. Before writing code, the user asked Codex to assess the BrickShare MVP architecture for a tokenized real estate platform and propose:

- an updated project architecture
- a file structure
- a data model
- the main user flows

The original user prompt defined two core features:

- smart-contract-style ownership logic for property tokens and rental income distribution
- buyer-seller matching for a secondary market

The user then asked Codex to simplify the plan for a realistic MVP:

- use one main dashboard instead of many pages
- keep the frontend to `Dashboard`, `TradingPanel`, `PortfolioSummary`, `OrderBook`, and `RentalIncomePanel`
- use seeded demo users
- use one or a few sample properties
- use JSON-style seeded data and in-memory storage instead of a complex database
- keep the smart contract as a backend simulation, not real Solidity
- add focused tests for the core business features
- keep the code easy to explain in a 10-minute investor demo

After the initial build, the project pivoted away from secondary-market trading. The user decided the final MVP should demonstrate a primary-market property tokenization flow instead.

## Current MVP Scope

The current BrickShare MVP is a primary-market demo:

1. Alberto submits Rotterdam Apartment for platform review.
2. BrickShare records a 2.0% issuance fee paid by Alberto.
3. Admin approves and tokenizes the property.
4. The backend simulates smart-contract deployment and token minting.
5. The listing goes live on the primary market.
6. Serena buys fixed-price tokens directly from the listing.
7. Ownership, cash balances, and funding progress update automatically.
8. Admin distributes monthly rent.
9. Serena claims rental income.

The previous secondary-market matching engine, partial matching, order book, trading commission, and ownership ledger are no longer active MVP features.

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

## Demo Users

- Serena: retail investor
- Alberto: property owner / issuer
- Admin: platform operator

Internal IDs may still use legacy names such as `user-alice` and `user-bob` for stability. Prefer changing display names rather than IDs.

## Fee Logic

Keep the fee logic simple and easy to explain:

```text
Funding target = EUR 500,000
Issuance fee = 2%
BrickShare revenue = EUR 10,000
```

The issuance fee is paid once by Alberto when he submits the property listing. Serena's later token purchases do not create extra issuance fees.

## UX Guidelines

Prefer clear primary-market language:

- Submit Listing
- Approve & Tokenize
- Buy tokens
- Distribute rent
- Claim rental income
- Issuance fee
- Primary market

Avoid secondary-market language in the active UI unless the user explicitly pivots back:

- order book
- bid
- ask
- sell order
- partial fill
- trading commission

Use blockchain language sparingly. Explain the smart-contract simulation as automatic backend ownership and balance updates. Do not imply that real blockchain settlement, real custody, or real payments are implemented.

## Testing Guidelines

Tests should stay focused on:

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
