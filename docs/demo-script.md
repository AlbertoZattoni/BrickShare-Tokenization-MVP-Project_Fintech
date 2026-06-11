# Demo Script

This script is designed for a short investor-oriented demo. It focuses on the core value: BrickShare makes real estate investing more accessible and liquid by turning a property into tradable tokens with automated rental income distribution.

## 1. Opening

Introduce BrickShare:

```text
BrickShare is a tokenized real estate platform. It lets retail investors buy small fractions of a property, trade those tokens in a secondary market, and receive rental income based on their ownership.
```

Mention the MVP scope:

```text
This MVP uses one demo property, Rotterdam Student Apartments, and three demo users: Alice, Bob, and Admin.
```

## 2. Show the Dashboard

Open:

```text
http://localhost:5173
```

Point out:

- property details
- token price
- monthly rent pool
- expected yield
- Alice, Bob, and Admin switcher
- portfolio, trading, order book, and rental panels

Explain:

```text
The GUI keeps blockchain-style investing simple. Users do not interact with smart contract code; they use familiar actions such as submit order and claim rental income.
```

## 3. Show Bob as Seller

Select Bob.

Point out:

- Bob owns 100 tokens
- the order book starts empty

Explain:

```text
Bob represents an investor who already owns property tokens and wants liquidity through the secondary market.
```

Submit:

```text
Sell 12 tokens at 100
```

Expected result:

```text
Bob's sell order is now open in the order book.
```

## 4. Show Alice as Buyer

Select Alice.

Point out:

- Alice has cash
- Alice starts with 0 property tokens

Submit:

```text
Buy 12 tokens at 100
```

Expected result:

```text
Trade matched: Alice bought 12 Rotterdam Student Apartments tokens from Bob at EUR 100 each.
```

Explain:

```text
The matching engine found Bob's 12-token sell order. Because Alice's buy price met Bob's sell price, the trade executed.
```

## 5. Explain the Architecture

Use this simple explanation:

```text
The frontend sends Alice's order to the backend. The matching engine checks the order book. When a match is found, the smart contract simulator transfers tokens and updates cash balances automatically.
```

Point to the visible result:

- Alice now owns 12 tokens
- Bob now owns 88 tokens
- a trade appears in recent trades

## 6. Show Partial Matching

Optional demo:

Reset the demo, let Bob sell 12 tokens, then let Alice buy 15 tokens.

Expected result:

```text
The matching engine fills Bob's 12-token sell order and leaves Alice's remaining 3 tokens open.
```

Explain:

```text
The engine executes the smaller side of the order. This keeps the secondary market realistic without making the demo complex.
```

## 7. Show Rental Income Distribution

Return to the normal matched-trade state or repeat Bob's 12-token sell order and Alice's 12-token buy order.

Select Admin.

Click:

```text
Distribute rent
```

Expected result:

```text
Rental income distributed: EUR 2,000 was allocated to 2 current token holders.
```

Explain:

```text
Rental income follows current token ownership. After the trade, Alice owns 12 tokens and Bob owns 88 tokens.
```

The property has:

```text
monthly rent pool = 2,000
total tokens = 1,000
income per token = 2
```

So:

```text
Alice receives 24 claimable rent
Bob receives 176 claimable rent
```

## 8. Show Alice Claiming Rent

Select Alice.

Click:

```text
Claim rental income
```

Expected result:

```text
Rental income claimed: EUR 20 was moved into Alice's cash balance.
```

Explain:

```text
This demonstrates the smart-contract-style rental payout. Users do not need to understand blockchain operations; the platform makes the process feel like a normal investment dashboard.
```

## 9. Mention Tests

Briefly explain:

```text
We added focused tests for the three core features: order matching, token transfer, and rental income distribution.
```

Run if needed:

```bash
node --test tests/*.test.js
```

## 10. Close With Limitations and Next Steps

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
- partial fills and deeper order book
- payment provider integration

Closing line:

```text
The MVP proves the core BrickShare idea: tokenized ownership can make real estate investing more accessible, more liquid, and easier to understand for retail investors.
```
