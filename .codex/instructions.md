# Codex Instructions

These instructions guide AI coding agents working on the BrickShare MVP.

## User Prompt History

The project started with a planning-first request. Before writing code, the user asked Codex to assess the BrickShare MVP architecture for a tokenized real estate platform and propose:

- an updated project architecture
- a file structure
- a data model
- the main user flows

The user defined two core features:

- smart-contract-style ownership logic for property tokens and rental income distribution
- buyer-seller matching for a secondary market

The user then asked Codex to simplify the plan for a realistic MVP before implementation:

- use one main dashboard instead of many pages
- keep the frontend to `Dashboard`, `TradingPanel`, `PortfolioSummary`, `OrderBook`, and `RentalIncomePanel`
- use seeded demo users: Alice as buyer, Bob as seller, Admin for demo controls
- use one demo property
- use JSON-style seeded data and in-memory storage instead of a complex database
- keep the smart contract as a backend simulation, not real Solidity
- add tests only for matching engine, token transfer, and rental income distribution
- keep the code easy to explain in a 10-minute investor demo

After the plan was accepted, the user asked Codex to implement the MVP milestone by milestone and explain what was completed at each step.

## Project Goal

BrickShare is an educational MVP for a tokenized real estate platform. Keep the project simple, demo-friendly, and easy to explain in a 10-minute investor presentation.

## Architecture Rules

Preserve the three-layer structure:

```text
frontend dashboard
backend API and matching engine
smart contract simulation and in-memory store
```

Do not add a real blockchain, Solidity contract, database, authentication system, or payment flow unless explicitly requested.

## MVP Scope

The first version uses:

- one property: Rotterdam Student Apartments
- Alice as buyer
- Bob as seller
- Admin as demo controller
- partial order matching with remaining quantity kept open
- simulated BrickShare revenue streams:
  - 2.0% issuance fee
  - 0.5% trading commission
  - 1.0% annual commission / management fee
- in-memory storage
- backend smart contract simulation that updates token balances, cash balances, rental income, and fee revenue

## Coding Guidelines

- Keep files small and readable.
- Prefer clear names over clever abstractions.
- Keep route handlers thin.
- Put business logic in `backend/src/services/`.
- Keep seeded demo data in `backend/src/data/seedData.js`.
- Keep mutable demo state in `backend/src/data/store.js`.
- Keep the frontend as one dashboard with the existing component structure.
- Do not add an ownership ledger or blockchain registry table unless the user explicitly asks for it again; it made the demo more complex without adding enough value.
- Avoid new dependencies unless they clearly improve the MVP and are easy to explain.

## Testing Guidelines

Tests should stay focused on the three core features:

- matching engine
- token transfer
- BrickShare fee revenue
- rental income distribution

Use Node's built-in test runner:

```bash
node --test tests/*.test.js
```

## UX Guidelines

The target user is a retail investor who may not understand blockchain. Keep interface language clear and familiar.

Prefer:

- Buy tokens
- Sell tokens
- Partial fill
- Trading commission
- Claim rental income
- Distribute rent
- Trade matched

Use blockchain language sparingly. Explain the smart contract simulation as automatic backend ownership and balance updates. Do not imply that real blockchain settlement, real custody, or real payments are implemented.

## Documentation Guidelines

When adding or changing behavior, update the README or docs if the demo flow, architecture, setup, or limitations change.

The assignment values:

- working MVP
- clear architecture explanation
- clean repository
- simple run instructions
- AI-agent orchestration notes
