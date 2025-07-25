## WS02 Token Transactional API

## Overview

The transactional-api is designed to interact with a smart contract deployed on the WSO2 blockchain. This API provides an abstraction over the underlying smart contract, offering a simplified way to perform token transactions. The master wallet address and its private key are stored securely as environment variables, ensuring both safety and ease of access. By leveraging these stored values, the API offers functionality to send tokens to any specified address.

## Configuration

### Environment Setup

1. Navigate to the root directory of the project.
2. Locate the `.env.example` file.
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file and provide the appropriate values for the following variables:
   - `WALLET_PRIVATE_KEY_<CLIENT_ID>`: The private key of the wallet for Client ID.
   - `RPC_URL`: The RPC endpoint for your blockchain node.
   - `MAIN_CONTRACT_ADDRESS`: The deployed contract address for the main token contract.


### Wallet & Contract Configuration (Per-Client)

Each client must have a single entry in `src/config/client-address-mapping.json`:

```json
{
  "CLIENT_ID_A": {
    "PUBLIC_WALLET_ADDRESS": "<address-for-this-client>",
    "USE_CASE": "<usecase-for-this-client>",
    "CONTRACT_ADDRESS": "<optional-contract-address>"
  },
  ...
}
```
- If `contractAddress` is omitted, the service will use the `MAIN_CONTRACT_ADDRESS` from the `.env` file by default.
- The `walletAddress` is public and used for blockchain operations.

**Private Key Secret:**
- Each client must set an environment variable named `WALLET_PRIVATE_KEY_<CLIENT_ID>` (e.g., `WALLET_PRIVATE_KEY_CLIENT_ID_A`) with their private key. This should be set as a secret.
- The service will load the private key from this environment variable at runtime.

### Blockchain Configuration

To correctly interact with the WSO2 blockchain, you'll also need to update the smart contract's ABI, address, and the RPC URL.

1. Navigate to the `src/config/blockchain.config.ts` file in the project directory.
2. Update the following values as per your needs:

- `contractAbi`: This should contain the ABI (Application Binary Interface) of your deployed smart contract.
- `contractAddress`: Set this to the address where your smart contract has been deployed.
- `rpcUrl`: This is the Remote Procedure Call URL that allows interaction with the WSO2 blockchain. Update it to the appropriate URL.
- `chainID`: This is the ID of the blockchain network. Update it to the appropriate value. (WS02 chain default is `10000`)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

# Transactional API Documentation

## Endpoints

### 1. Get master wallet balance

- **Method**: `GET`
- **Endpoint**: `{{base_url}}/api/v1/blockchain/master-wallet-balance`
- **Description**: This endpoint retrieves the balance of the master wallet.

#### Expected Response:

```json
{
  "message": "success",
  "httpCode": 200,
  "payload": {
    "masterWalletAddress": "0x7ab4Cc54C37BF34979F3aF0e9Ee949ebE9A11039",
    "balance": "1199900.0",
    "tokenBalanceUnFormatted": "1199900000000000",
    "decimals": 9
  }
}
```

### 2. Get token balance by wallet address

- **Method**: `GET`
- **Endpoint**: `{{base_url}}/api/v1/blockchain/get-balance/0x21b1Ea8fF3d2Fab4b8Af04D4d666B3F8cFdB62b9`
- **Description**: This endpoint retrieves the token balance for a specified wallet address.

#### Expected Response:

```json
{
  "message": "success",
  "httpCode": 200,
  "payload": {
    "balance": "100.0",
    "tokenBalanceUnFormatted": "100000000000",
    "decimals": 9
  }
}
```

### 3. Transfer token to wallet address

- **Method**: `POST`
- **Endpoint**: `{{base_url}}/api/v1/blockchain/transfer-token`
- **Description**: This endpoint allows for transferring tokens to a specified wallet address.
- **Body**:
  ```json
  {
    "recipientWalletAddress": "0x21b1Ea8fF3d2Fab4b8Af04D4d666B3F8cFdB62b9",
    "amount": 100
  }
  ```

#### Expected Response:

```json
{
  "message": "success",
  "httpCode": 200,
  "payload": {
    "txHash": "0xd8ef78149b0a31a7575c31e97cdda3cc0f7e7cad97a2ace0e9d0270e9ab3b158",
    "status": 1,
    "committedBlockNumber": 33488387
  }
}
```

### 4. Get transaction details by tx hash

- **Method**: `GET`
- **Endpoint**: `{{base_url}}/api/v1/blockchain/get-transaction-details/0xd8ef78149b0a31a7575c31e97cdda3cc0f7e7cad97a2ace0e9d0270e9ab3b158`
- **Description**: This endpoint retrieves detailed information for a specified transaction hash.

#### Expected Response:

```json
{
  "message": "success",
  "httpCode": 200,
  "payload": {
    "txDetails": {
      "hash": "0xd8ef78149b0a31a7575c31e97cdda3cc0f7e7cad97a2ace0e9d0270e9ab3b158",
      "type": 2,
      "accessList": [],
      "blockHash": "0x6b10e4433faffced84b338fde453314cf616e7676ef8ce2788b4219f48081e77",
      "blockNumber": 33488387,
      "transactionIndex": 0,
      "confirmations": 8,
      "from": "0x7ab4Cc54C37BF34979F3aF0e9Ee949ebE9A11039",
      "gasPrice": {
        "type": "BigNumber",
        "hex": "0x0826299e00"
      },
      "maxPriorityFeePerGas": {
        "type": "BigNumber",
        "hex": "0x0826299e00"
      },
      "maxFeePerGas": {
        "type": "BigNumber",
        "hex": "0x0826299e00"
      },
      "gasLimit": {
        "type": "BigNumber",
        "hex": "0x8759"
      },
      "to": "0x775ca26bA934F3fa2A3968a9EAdEbF800cdE5d7F",
      "value": {
        "type": "BigNumber",
        "hex": "0x00"
      },
      "nonce": 1692,
      "data": "0xa9059cbb00000000000000000000000021b1ea8ff3d2fab4b8af04d4d666b3f8cfdb62b9000000000000000000000000000000000000000000000000000000174876e800",
      "r": "0xb11f0680d7e67ea3a884ca4cd690164dd831a8a230abfb9feef7dcba7f259627",
      "s": "0x3d555603d2d34696ee754069cee6e0f1fdce48756749ec028652f47cefc52524",
      "v": 1,
      "creates": null,
      "chainId": 97
    },
    "decodedData": {
      "args": [
        "0x21b1Ea8fF3d2Fab4b8Af04D4d666B3F8cFdB62b9",
        {
          "type": "BigNumber",
          "hex": "0x174876e800"
        }
      ],
      "functionFragment": {
        "type": "function",
        "name": "transfer",
        "constant": false,
        "inputs": [
          {
            "name": "recipient",
            "type": "address",
            "indexed": null,
            "components": null,
            "arrayLength": null,
            "arrayChildren": null,
            "baseType": "address",
            "_isParamType": true
          },
          {
            "name": "amount",
            "type": "uint256",
            "indexed": null,
            "components": null,
            "arrayLength": null,
            "arrayChildren": null,
            "baseType": "uint256",
            "_isParamType": true
          }
        ],
        "outputs": [
          {
            "name": null,
            "type": "bool",
            "indexed": null,
            "components": null,
            "arrayLength": null,
            "arrayChildren": null,
            "baseType": "bool",
            "_isParamType": true
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "gas": null,
        "_isFragment": true
      },
      "name": "transfer",
      "signature": "transfer(address,uint256)",
      "sighash": "0xa9059cbb",
      "value": {
        "type": "BigNumber",
        "hex": "0x00"
      }
    }
  }
}
```

---

This documentation provides a detailed overview of each API endpoint, including its purpose, request parameters, and expected responses.
