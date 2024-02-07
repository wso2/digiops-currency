# Deploying Smart Contracts Using Hardhat on WSO2 Private Network

## Table of Contents

- [Deploying Smart Contracts Using Hardhat on WSO2 Private Network](#deploying-smart-contracts-using-hardhat-on-wso2-private-network)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Network Configuration](#network-configuration)
  - [Generating a Wallet Address](#generating-a-wallet-address)
    - [First Method](#first-method)
    - [Second Method](#second-method)
  - [Compiling the Smart Contract](#compiling-the-smart-contract)
  - [Configuring the Smart Contract](#configuring-the-smart-contract)
  - [Deployment Process](#deployment-process)
  - [Smart Contract functions](#smart-contract-functions)
  - [Post-Deployment Steps](#post-deployment-steps)

## Introduction

This guide walks you through the process of deploying smart contracts on a private network named "WSO2" using the Hardhat development environment.

## Network Configuration

Before you begin, you need to add your custom network configuration to the Hardhat config file.

1. Open `hardhat.config.js` in your project directory.
2. Add the `wso2` network configuration:

```javascript
module.exports = {
  networks: {
    wso2: {
      url: "<YOUR_MINER_NODE_RPC_URL>", // Replace with your miner node URL.
      accounts: ["<PRIVATE_KEY>"], // Replace with your private key.
      httpHeaders: {
        Authorization: "Bearer <YOUR_AUTH_TOKEN>" // Replace with your authentication token if required.
      }
    }
    // ... Other network configurations
  }
};
```

Make sure to replace the placeholders (`<YOUR_MINER_NODE_RPC_URL>`, `<PRIVATE_KEY>`, and `<YOUR_AUTH_TOKEN>`) with actual values.

## Generating a Wallet Address

### First Method

Open the wso2 mini wallet application create a new wallet there and copy private key to the hardhat.config.js file under the wso2 network configuration.

### Second Method

You can generate a wallet address and private key in two ways:

1. **Using the WSO2 Wallet App**: Follow the app's guidelines to generate a wallet.
2. **Using the Provided Script**: Run the following command:

```bash
npx hardhat run scripts/generate-wallet.js --network wso2
```

After execution, the console will display the newly generated wallet address and its corresponding private key. Note these down securely.

Upon running the script, you will receive a wallet address and its corresponding private key. Make sure to update these values in the `hardhat.config.js` under the `wso2` network configuration.

**Note**: This wallet address will be the owner of the smart contract. You should secure the private key properly and not share it with anyone.

## Compiling the Smart Contract

Before deployment, it's essential to compile your smart contract to ensure there are no errors and to prepare it for deployment.

In your project directory, run:

```bash
npx hardhat compile
```

This step will generate the necessary artifacts required for deployment.

## Configuring the Smart Contract

Before deploying, you might want to set some initial configurations for your contract. For example, setting the initial token amount:

1. Open `scripts/deploy.js`.
2. Locate and modify the deployment line:

```javascript
const greeter = await Greeter.deploy("<add-token-amount>", {
  gasPrice: 0,
  gasLimit: 5000000
});
```

Replace `<add-token-amount>` with the desired initial token quantity. The provided token amount will be added to the owner's wallet address. If the smart contract supports it, ownership can later be transferred to a different address.

## Deployment Process

1. Install necessary NPM packages (if you haven’t already):

```bash
npm install
```

2. Make sure your smart contract is complete and tested.

```bash
npx hardhat compile
```

3. To deploy the contract, run:

```bash
npx hardhat run scripts/deploy.js --network wso2
```

## Smart Contract functions

| Function Name        | Description                                              |
| -------------------- | -------------------------------------------------------- |
| transfer             | Transfer own wallet tokens to another wallet             |
| transferFrom         | Transfer someone else tokens to another wallet           |
| setAuthorizedWallets | Add remove authorized wallet ( who can mint new tokens)  |
| mintToken            | Mint new tokens                                          |
| airdropTokens        | Airdrop Tokens                                           |
| approve              | Give approval to someone transfer tokens from own wallet |

---

## Post-Deployment Steps

1. **Contract Address**: After deployment, the contract address will be displayed in the console. This is essential for interacting with your contract on the network.
2. **ABI (Application Binary Interface)**: The ABI, which allows you to interact with your contract, can usually be found in the `artifacts/` directory of your Hardhat project, under the contract's name.

---

That's it! You've successfully deployed a smart contract on the WSO2 private network using Hardhat. Ensure to familiarize yourself with best practices and always back up essential data like private keys and contract addresses. Happy coding!
