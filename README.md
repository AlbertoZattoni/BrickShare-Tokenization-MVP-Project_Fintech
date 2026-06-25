# BrickShare MVP

BrickShare is a simple educational MVP for a tokenized real estate platform. It demonstrates how a property owner can tokenize a property into fixed-price tokens, how a retail investor can buy those tokens, and how rental income can be distributed automatically through a dashboard.

The first MVP uses one active demo property: **Rotterdam Apartment**. Serena acts as the retail investor, Alberto acts as the property owner / issuer, and Admin acts as the platform operator.

This version is a **primary-market MVP**. It does not implement a secondary-market order book. The demo focuses on the first issuance of property tokens: the owner submits a property, Admin approves and tokenizes it, and the investor buys fixed-price tokens directly from that primary listing.

## Core Features

- View the property and its investment details.
- Switch between Serena, Alberto, and Admin demo users.
- Let Alberto submit the property for platform review.
- Let Admin approve the property and trigger simulated token minting.
- Let Serena choose a property and buy tokens by quantity only.
- Simulate smart-contract-style token ownership transfer.
- Track BrickShare's 2.0% issuance fee paid by the property owner.
- Distribute rental income to current token holders.
- Claim rental income into a user's cash balance.
- Reset the demo to the original seeded state.

## Architecture

BrickShare uses a simple three-layer MVP architecture:

```text
Single Dashboard Frontend
Dashboard, TradingPanel, PortfolioSummary, OrderBook, RentalIncomePanel
        |
        v
Backend API
dashboard, property listing, approval, primary investment, rent, reset
        |
        v
Business Services
primaryOfferingService, smartContractSimulator, rentalIncomeService
        |
        v
In-Memory Store
seeded users, properties, holdings, investments, rental distributions
```

The frontend gives users a clear investment dashboard. The backend receives actions such as submitting a property listing, approving and tokenizing the property, buying fixed-price primary tokens, distributing rent, claiming rent, and resetting the demo.

The smart-contract simulation layer represents what a future Solidity smart contract would do. It updates token ownership, cash balances, available token supply, funding progress, and rental income balances. No real blockchain is deployed in this MVP.

## Project Structure

```text
frontend/                 Single dashboard UI
backend/                  API, demo store, primary offering, token transfer, and rental logic
tests/                    Focused tests for primary offering, token transfer, and rent logic
docs/                     Architecture and demo notes
.codex/                   AI-agent instructions for this repository
```

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

## Primary-Market Flow

The MVP follows this sequence:

1. Alberto submits the property listing.
2. BrickShare records the 2.0% issuance fee paid by Alberto.
3. Listing status becomes `Pending Review`.
4. Admin clicks `Approve & Tokenize`.
5. The backend simulates smart-contract deployment and token minting.
6. The listing becomes live on the primary market.
7. Serena buys fixed-price tokens directly from the listing.
8. Ownership, cash balances, and funding progress update automatically.
9. Admin distributes monthly rent.
10. Serena claims rental income.

## BrickShare Fee Model

The MVP keeps fees simple and demo-friendly:

| Fee stream | Rate | Demo behavior |
| --- | ---: | --- |
| Issuance fee | 2.0% | Paid once by Alberto when he submits the property listing. |

For the demo:

```text
Funding target = EUR 500,000
Issuance fee = 2%
BrickShare revenue = EUR 10,000
```

These are simulated platform revenue entries only. The MVP does not process real payments. Serena's later token purchases do not create extra issuance fees.

## Demo Flow

1. Open the dashboard.
2. Show Rotterdam Apartment.
3. Select Alberto and enter the house details:
   - property name: Rotterdam Apartment
   - valuation: EUR 500,000
   - funding target: EUR 500,000
   - number of tokens: 10,000
   - token price: EUR 50
   - expected rental yield: 5%
4. Alberto submits the listing. BrickShare records the EUR 10,000 issuance fee and status becomes Pending Review.
5. Select Admin and click Approve & Tokenize.
6. Status becomes Live on Primary Market with 10,000 tokens available at EUR 50 each.
7. Select Serena.
8. Serena chooses Rotterdam Apartment from the property selector.
9. Serena buys 100 tokens at the fixed price of EUR 50.
10. The smart contract simulator transfers tokens and cash; BrickShare's issuance fee was already paid by Alberto during listing submission.
11. Admin distributes rental income.
12. Serena claims rental income.
13. Reset the demo if needed.

## MVP Limitations

- No real blockchain or Solidity contract is deployed.
- No real payments, KYC, AML, or securities compliance workflow is implemented.
- Storage is in-memory and resets when the backend restarts.
- Only Rotterdam Apartment has real demo data; other property options are placeholders.
- There is no secondary-market order book in the current primary-market MVP.
- The platform uses seeded demo users instead of authentication.
- Document upload, property verification, KYC, and smart-contract deployment are simulated.

## AI Tools and Agent Orchestration

The MVP was built milestone by milestone with Codex as the coding agent. The workflow used small commits, explicit architecture decisions, and focused implementation steps. Agent guidance is documented in [.codex/instructions.md](.codex/instructions.md).

## License

This project uses the [MIT License](LICENSE).

We chose the MIT License because it is useful for example projects and educational MVPs:

- Almost anyone can use the code for personal or commercial projects.
- Others can modify and adapt the project.
- The license is short and simple, with few obligations.
- It reduces barriers to adoption because companies and contributors are generally comfortable using MIT-licensed code.
- It can lead to more users, more contributors, and easier integration into open-source or commercial projects.
- The original authors still retain copyright.
