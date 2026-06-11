# BrickShare MVP

BrickShare is a simple educational MVP for a tokenized real estate platform. It demonstrates how retail investors could buy and sell fractional property tokens and receive rental income through a dashboard instead of manually interacting with blockchain contracts.

The first MVP uses one demo property: **Rotterdam Student Apartments**. Alice acts as the buyer, Bob acts as the seller, and Admin controls the rental income distribution demo.

## Core Features

- View the tokenized property and its basic investment details.
- Switch between Alice, Bob, and Admin demo users.
- Place buy and sell orders with partial matching.
- Match Alice's buy order against Bob's seeded sell order, leaving any unfilled quantity open.
- Simulate smart-contract-style token ownership transfer.
- Track BrickShare revenue streams: issuance fee, trading commission, and commission / management fee.
- Distribute rental income to current token holders.
- Claim rental income into a user's cash balance.
- Reset the demo to the original seeded state.

## Architecture

BrickShare uses a simple three-layer MVP architecture:

```text
Single Dashboard Frontend
        |
        v
Backend API and Matching Engine
        |
        v
Smart Contract Simulation and In-Memory Store
```

The frontend gives users a clear investment dashboard. The backend receives actions, validates orders, partially matches compatible buy and sell orders, and calls the simulated smart contract layer. The smart contract simulator updates token ownership, cash balances, and BrickShare fee revenue.

More detail is available in [docs/architecture.md](docs/architecture.md).

## Project Structure

```text
frontend/                 Single dashboard UI
backend/                  API, demo store, matching, transfer, and rental logic
tests/                    Focused tests for the three core business features
docs/                     Architecture and demo notes
.codex/                   AI-agent instructions for this repository
```

## Requirements

- Node.js 18 or newer
- No npm install is required for the current MVP

The backend and frontend are dependency-free so the project is easy to run in a classroom or demo setting.

## How to Run

Open two terminal windows from the repository root.

Backend:

```bash
cd backend
node src/server.js
```

Frontend:

```bash
cd frontend
node server.js
```

Then open:

```text
http://localhost:5173
```

The backend health check is available at:

```text
http://localhost:4000/api/health
```

## How to Test

From the repository root:

```bash
node --test tests/*.test.js
```

The tests cover:

- exact and partial order matching
- token and cash transfer
- BrickShare fee revenue
- proportional rental income distribution

## BrickShare Fee Model

The MVP keeps fees simple and demo-friendly:

| Fee stream | Rate | Demo behavior |
| --- | ---: | --- |
| Issuance fee | 2.0% | Seeded as upfront revenue when Rotterdam Student Apartments is tokenized. |
| Trading commission | 0.5% | Added to BrickShare revenue after each matched secondary-market trade. |
| Commission / management fee | 1.0% annually | Seeded as recurring platform revenue for the demo property. |

These are simulated platform revenue entries only. The MVP does not process real payments.

## Demo Flow

1. Open the dashboard.
2. Show Rotterdam Student Apartments.
3. Select Bob and show his token ownership.
4. Select Alice.
5. Alice buys 12 tokens at 100.
6. The matching engine fills Bob's seeded 10-token sell order and leaves 2 tokens open.
7. The smart contract simulator transfers tokens, cash, and trading commission revenue.
8. Select Admin and show the three BrickShare revenue streams.
9. Distribute rental income.
10. Select Alice and claim rental income.
11. Reset the demo if needed.

More detail is available in [docs/demo-script.md](docs/demo-script.md).

## MVP Limitations

- No real blockchain or Solidity contract is deployed.
- No real payments, KYC, AML, or securities compliance workflow is implemented.
- Storage is in-memory and resets when the backend restarts.
- Partial matching is intentionally simple and supports the one-property demo scenario.
- The platform uses seeded demo users instead of authentication.

## AI Tools and Agent Orchestration

The MVP was built milestone by milestone with Codex as the coding agent. The workflow used small commits, explicit architecture decisions, and focused implementation steps. Agent guidance is documented in [.codex/instructions.md](.codex/instructions.md).

## License

See [LICENSE](LICENSE).
