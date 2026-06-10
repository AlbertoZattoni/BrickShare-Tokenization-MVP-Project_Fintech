# BrickShare MVP

BrickShare is a simple educational MVP for a tokenized real estate platform. It demonstrates how retail investors could buy and sell fractional property tokens and receive rental income through a dashboard instead of manually interacting with blockchain contracts.

The first MVP uses one demo property: **Rotterdam Student Apartments**. Alice acts as the buyer, Bob acts as the seller, and Admin controls the rental income distribution demo.

## Core Features

- View the tokenized property and its basic investment details.
- Switch between Alice, Bob, and Admin demo users.
- Place exact-quantity buy and sell orders.
- Match Alice's buy order against Bob's seeded sell order.
- Simulate smart-contract-style token ownership transfer.
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

The frontend gives users a clear investment dashboard. The backend receives actions, validates orders, matches compatible buy and sell orders, and calls the simulated smart contract layer. The smart contract simulator updates token ownership and cash balances.

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

- exact-quantity matching
- token and cash transfer
- proportional rental income distribution

## Demo Flow

1. Open the dashboard.
2. Show Rotterdam Student Apartments.
3. Select Bob and show his token ownership.
4. Select Alice.
5. Alice buys 10 tokens at 100.
6. The matching engine matches Bob's seeded 10-token sell order.
7. The smart contract simulator transfers tokens and cash.
8. Select Admin and distribute rental income.
9. Select Alice and claim rental income.
10. Reset the demo if needed.

More detail is available in [docs/demo-script.md](docs/demo-script.md).

## MVP Limitations

- No real blockchain or Solidity contract is deployed.
- No real payments, KYC, AML, or securities compliance workflow is implemented.
- Storage is in-memory and resets when the backend restarts.
- Matching supports exact quantities only; there are no partial fills.
- The platform uses seeded demo users instead of authentication.

## AI Tools and Agent Orchestration

The MVP was built milestone by milestone with Codex as the coding agent. The workflow used small commits, explicit architecture decisions, and focused implementation steps. Agent guidance is documented in [.codex/instructions.md](.codex/instructions.md).

## License

See [LICENSE](LICENSE).
