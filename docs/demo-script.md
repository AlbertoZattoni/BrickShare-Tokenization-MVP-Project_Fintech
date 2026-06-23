# Demo Script

This script is designed for a short investor-oriented demo. It focuses on the core value: BrickShare turns a property into fixed-price tokens and makes ownership and rental income easy to understand.

## 1. Opening

Introduce BrickShare:

```text
BrickShare is a tokenized real estate platform. It lets retail investors buy small fractions of a property and receive rental income based on their ownership.
```

Mention the MVP scope:

```text
This MVP uses one active demo property, Rotterdam Apartment, and three demo users: Serena, Alberto, and Admin.
```

## 2. Show the Dashboard

Open:

```text
http://localhost:5173
```

Point out:

- property selector
- token price
- available tokens
- expected yield
- investment status
- Serena, Alberto, and Admin switcher
- portfolio, primary offering, investment activity, and rental panels

Explain:

```text
The GUI keeps blockchain-style investing simple. Users do not interact with smart contract code; they use familiar actions such as buy tokens and claim rental income.
```

## 3. Alberto Lists The Property

Select Alberto.

Explain:

```text
Alberto is the property owner. He starts by submitting the house for platform review.
```

Point to the form fields:

```text
Address / name: Rotterdam Apartment
Valuation: EUR 500,000
Funding target: EUR 500,000
Number of tokens: 10,000
Token price: EUR 50
Expected rental yield: 5%
```

Explain:

```text
Alberto is not starting with a token portfolio. He starts with a house. Submitting the listing is the off-chain onboarding step.
BrickShare charges Alberto a 2% issuance fee on the EUR 500,000 funding target, so the platform records EUR 10,000 in fee revenue at this step.
```

Click:

```text
Submit Listing
```

Expected result:

```text
Status: Pending Review
```

## 4. Admin Approves And Tokenizes

Select Admin.

Click:

```text
Approve & Tokenize
```

Expected result:

```text
Status: Live on Primary Market
10,000 property tokens created
Token price: EUR 50
Tokens available: 10,000
```

Explain:

```text
The listing step is off-chain review. The simulated smart contract starts when Admin approves the property and the platform mints the tokens.
```

## 5. Serena Buys Tokens

Select Serena.

Point out:

- Serena has cash
- Serena starts with 0 property tokens
- Serena selects Rotterdam Apartment
- Serena does not enter a bid price

Submit:

```text
Buy 100 tokens
```

Expected result:

```text
Serena bought 100 Rotterdam Apartment tokens at EUR 50 each.
```

Explain:

```text
This is a primary offering. Serena buys at the fixed token price, and the backend smart contract simulator settles the purchase automatically.
```

## 6. Explain The Architecture

Use this simple explanation:

```text
The frontend sends Serena's purchase to the backend API. The primary offering service validates the purchase. The smart contract simulator checks that Serena is verified, enough tokens are available, and payment is sufficient. It then updates ownership, cash balances, and funding progress.
```

Point to the visible result:

- Serena now owns 100 tokens
- Serena owns 1% of the 10,000-token property
- tokens sold updates to 100 / 10,000
- Serena's cash balance decreased
- Alberto's cash balance increased by the investment amount
- BrickShare's issuance fee was already recorded when Alberto submitted the listing
- a primary investment appears in investment activity

## 7. Show Rental Income Distribution

Select Admin.

Click:

```text
Distribute rent
```

Expected result:

```text
Rental income distributed: EUR 2,000 was allocated to current token holders.
```

Explain:

```text
Rental income follows current token ownership. If Serena owns more tokens, she receives more rent.
```

The formula is:

```text
user rent = user tokens / total tokens * monthly rent pool
```

For Serena:

```text
100 / 10000 * EUR 2,000 = EUR 20
```

## 8. Serena Claims Rent

Select Serena.

Click:

```text
Claim rental income
```

Expected result:

```text
EUR 20 moves into Serena's cash balance.
```

Explain:

```text
This demonstrates the smart-contract-style rental payout. Users do not need to understand blockchain operations; the platform makes the process feel like a normal investment dashboard.
```

## 9. Mention Tests

Briefly explain:

```text
We added focused tests for the primary offering, token transfer simulation, and rental income distribution.
```

Run if needed:

```bash
node --test tests/*.test.js
```

## 10. Close With Limitations And Next Steps

State clearly:

```text
This is an educational MVP. It simulates blockchain ownership in the backend rather than deploying Solidity contracts.
```

Next steps:

- real smart contract deployment
- wallet connection
- persistent database
- KYC/AML checks
- legal compliance review
- payment provider integration
- future secondary-market trading

Closing line:

```text
The MVP proves the core BrickShare idea: fixed-price tokenized ownership can make real estate investing more accessible and easier to understand for retail investors.
```
