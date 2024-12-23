# NYCryptoAI

Cryptocurrency and web3 have always been known for their complicated nature and nicheness. However, with the recent rise of interest from retail investors it's only right that we crypto and web3 builders create tools and applications to accomodate their level of knowledge or lack there of, that is why at NYCrypto we've been throwing around the idea of building an agentic wallet that gives users the ability to perform onchain tasks using simple human language.

Thankfully, with the launch of the Solana AI Hackathon I (Michael, lead engineer) decided to give it a try and build a lightweight MVP of what an app like this would look like in the future. Imagine the possibilities and how seamless the onboarding process would be if creating a wallet and interacting with the blockchain was as easy as talking to ChatGPT (the app with the fastest user base growth of all time). With apps like this onboarding the next billion web3 users wouldn't just be a dream or marketing speak that founders add to their pitch deck but an actual reality.

## Features

NYCryptoAI right now only has a handful of features:

- [x] Wallet address fetching
- [x] Balance fetching and display
- [x] Token transfers
- [x] Token swaps
- [x] Wallet transaction history fetching
- [x] Trending tokens information
- [x] Token prices and price change information
- [ ] Generative UI for certain responses
- [ ] Wallet portfolio breakdown
  - How much a user is up or down given a period of time
  - What tokens have performed the best and which are under performing
- [ ] Lending and borrowing
- [ ] Staking using implicit statements like "Stake x SOL for me", the agent should decide which staked SOL asset has best yield and swap to the staked asset using jupiter or orca
- [ ] Liquidity position creation and closing through meteora
- [ ] NFT portfolio fetching and display
- [ ] Plain old wallet dashboard where these can be performed using a simple UI like [Tidus Wallet](https://tiduswallet.com)

## Running the project

In order to run the run the project follow these steps:

1. Clone the repo `git clone https://github.com/tidus-wallet/nycryptoai.git`
2. Install the packages `bun install`
3. Install the pods `cd ios && pod install`
4. Copy the `.env.example` file to `.env` and fill in the required fields `cp .env.example .env`
5. Run the project `bun ios` or `bun android`

## Running the app (android)

To run the app all you need to do is download the APK file [here](./app-apk.zip)
