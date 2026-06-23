# BrickShare MVP

BrickShare is a simple educational MVP for a tokenized real estate platform. It demonstrates how a property owner can tokenize a property into fixed-price tokens, how a retail investor can buy those tokens, and how rental income can be distributed automatically through a dashboard.

The first MVP uses one active demo property: **Rotterdam Apartment**. Serena acts as the retail investor, Alberto acts as the property owner / issuer, and Admin acts as the platform operator.

## Core Features

- View the tokenized property and its basic investment details.
- Switch between Serena, Alberto, and Admin demo users.
- Let Alberto enter house details and tokenize/list the property as a fixed-price primary offering.
- Let Serena choose a property and buy tokens by quantity only.
- Simulate smart-contract-style token ownership transfer.
- Track BrickShare issuance fee revenue.
- Distribute rental income to current token holders.
- Claim rental income into a user's cash balance.
- Reset the demo to the original seeded state.

## Architecture

BrickShare uses a simple three-layer MVP architecture:

```text
Single Dashboard Frontend
        |
        v
Backend API
        |
        v
Smart Contract Simulation and In-Memory Store
```

The frontend gives users a clear investment dashboard. The backend receives actions such as listing a property, buying fixed-price tokens, distributing rent, claiming rent, and resetting the demo. The smart contract simulator updates token ownership, cash balances, available token supply, and BrickShare issuance fee revenue.

More detail is available in [docs/architecture.md](docs/architecture.md).

## Project Structure

```text
frontend/                 Single dashboard UI
backend/                  API, demo store, primary offering, transfer, and rental logic
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

- fixed-price primary token purchase
- smart-contract-style token and cash transfer
- BrickShare fee revenue
- proportional rental income distribution

## BrickShare Fee Model

The MVP keeps fees simple and demo-friendly:

| Fee stream | Rate | Demo behavior |
| --- | ---: | --- |
| Issuance fee | 2.0% | Paid once by Alberto when he submits the property listing. |

These are simulated platform revenue entries only. The MVP does not process real payments.

## Demo Flow

1. Open the dashboard.
2. Show Rotterdam Apartment.
3. Select Alberto and enter the house details:
   - address: Rotterdam Apartment
   - valuation: EUR 500,000
   - funding target: EUR 500,000
   - number of tokens: 10,000
   - token price: EUR 50
   - expected rental yield: 5%
4. Alberto submits the listing. Status becomes Pending Review.
5. Select Admin and click Approve & Tokenize.
6. Status becomes Live on Primary Market with 10,000 tokens available.
7. Select Serena.
8. Serena chooses Rotterdam Apartment from the property selector.
9. Serena buys 100 tokens at the fixed price of 50.
10. The smart contract simulator transfers tokens and cash; BrickShare's issuance fee was already paid by Alberto during listing submission.
11. Admin distributes rental income.
12. Serena claims rental income.
13. Reset the demo if needed.

More detail is available in [docs/demo-script.md](docs/demo-script.md).

## MVP Limitations

- No real blockchain or Solidity contract is deployed.
- No real payments, KYC, AML, or securities compliance workflow is implemented.
- Storage is in-memory and resets when the backend restarts.
- Only Rotterdam Apartment has real demo data; other property options are placeholders.
- There is no secondary-market order book in the current primary-market MVP.
- The platform uses seeded demo users instead of authentication.

## AI Tools and Agent Orchestration

The MVP was built milestone by milestone with Codex as the coding agent. The workflow used small commits, explicit architecture decisions, and focused implementation steps. Agent guidance is documented in [.codex/instructions.md](.codex/instructions.md).

## License

See [LICENSE](LICENSE).
