# Codex Instructions

These instructions guide AI coding agents working on the BrickShare MVP.

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
- exact-quantity matching only
- in-memory storage
- backend smart contract simulation

## Coding Guidelines

- Keep files small and readable.
- Prefer clear names over clever abstractions.
- Keep route handlers thin.
- Put business logic in `backend/src/services/`.
- Keep seeded demo data in `backend/src/data/seedData.js`.
- Keep mutable demo state in `backend/src/data/store.js`.
- Keep the frontend as one dashboard with the existing component structure.
- Avoid new dependencies unless they clearly improve the MVP and are easy to explain.

## Testing Guidelines

Tests should stay focused on the three core features:

- matching engine
- token transfer
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
- Claim rental income
- Distribute rent
- Trade matched

Avoid unnecessary blockchain jargon in the UI.

## Documentation Guidelines

When adding or changing behavior, update the README or docs if the demo flow, architecture, setup, or limitations change.

The assignment values:

- working MVP
- clear architecture explanation
- clean repository
- simple run instructions
- AI-agent orchestration notes
