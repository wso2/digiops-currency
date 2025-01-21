# WSO2 Wallet Application Initial Configuration Guide

The WSO2 Wallet Application is a React-based web application built using ReactJS. This guide will walk you through the initial setup and configuration steps to get you up and running with the application.

## Prerequisites

1. Ensure you have a package manager installed (e.g., npm or yarn).
2. Node.js should be installed for package management.

## Installation

1. Install the required npm packages using your package manager:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
2. Run the application:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

## Before run the application you may need to configure below configuration

1. Rename the `.env.example` file to `.env`.
2. Update the `REACT_APP_RPC_ENDPOINT` value in the `.env` file with the correct RPC endpoint. This connection will enable the wallet application to communicate with the blockchain.

## Smart Contract Integration

To fully utilize the wallet application, it should interact with WSO2 token smart contract functions deployed on the WSO2 blockchain.

1. Access the Solidity implementation of the smart contract in the GitHub repository under the "smart contract directory". The link to this repository can be found in your provided resources.
2. Within the application, navigate to `src/constants/config.js`.
3. Update the following configuration values:

   - `CONTRACT_ADDRESS`
   - `CHAIN_ID`
   - `CONTRACT_ABI`

   Note: If there are updates to the smart contract in the future, refer to the smart contract repository for the updated deployment address and ABI. We use Hardhat for smart contract deployment, and the Hardhat deployed address and ABI will be essential for updating the config file.

4. For demonstration purposes, the following configurations were previously used: `MASTER_WALLET_ADDRESS`, `SECONDARY_WALLET_ADDRESS`, and `MASTER_WALLET_PRIVATE_KEY`. These values were used to showcase the automated transaction feature during the testing phase and are no longer required.

## Authentication with the Miner Node

If you're using the RPC URL deployed on the WSO2 core, authentication is necessary.

1. The RPC client creation code is located in `src/services/blockchain.service.js`.
2. Locate the `getRPCProvider()` method:

```javascript
export const getRPCProvider = async () => {
  // Get the API key from local storage
  const apiKey = await getAccessToken();
  const connection = {
    url: RPC_ENDPOINT,
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };

  const provider = new ethers.providers.StaticJsonRpcProvider(
    { url: RPC_ENDPOINT },
    CHAIN_ID
  );
  return provider;
};
```

3. The application has an integrated method to retrieve the access token. The token can be added as a header for the RPC client. This step is crucial if the RPC endpoint has an authentication mechanism.
4. Upon successful configuration and startup of the application, you should see a green dot indicating "Connection Successful" on the wallet application's home page.

---

With these steps completed, your WSO2 Wallet Application should be correctly configured and ready to use. Ensure to refer back to relevant documentation and repositories for updates and more in-depth information.
