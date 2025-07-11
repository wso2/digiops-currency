# WSO2 Admin Panel

WSO2 blockchain integrations.

## Prerequisites

- **Node.js** (v20 or newer recommended)
- **npm** or **yarn**

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Environment Variables**

   Copy the sample environment file and update it with your configuration:

   ```bash
   cp .env.sample .env.local
   ```

   Edit `.env.local` and set the following variables:

   - `VITE_PROJECT_ID`: [Create a WalletConnect Cloud project](https://cloud.walletconnect.com/) and add its ID here.
   - `VITE_CHAIN_ID`: Chain ID of the blockchain network.
   - `VITE_RPC_END_POINT`: RPC endpoint URL of the network.
   - `VITE_CONTRACT_ADDRESS`: Address of the smart contract to interact with.

3. **Update the Contract ABI**

   Replace the placeholder ABI in `src/data/abi.ts` with your contract’s ABI:

   ```ts
   export const ABI = [
     // Your contract ABI here
   ] as const;
   ```

4. **Configure the Custom Chain Adapter**

   Update `src/data/chain-config.ts` with your chain details:

   ```ts
   export const chainDetails: Chain = {
     id: Number(import.meta.env.VITE_CHAIN_ID),
     name: "WSO2",
     iconUrl: "",
     iconBackground: "#fff",
     nativeCurrency: {
       name: "Wso2",
       symbol: "WS02",
       decimals: 9,
     },
     rpcUrls: {
       default: {
         http: [import.meta.env.VITE_RPC_END_POINT as string],
       },
     },
     blockExplorers: {
       default: {
         name: "WSO2 Explorer",
         url: "",
       },
     },
   };
   ```

5. **Run the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Build for Production

```bash
npm run build
# or
yarn build
```

## Add wso2 network to MetaMask

1. Open MetaMask and click on the network dropdown.
2. Click on "Add Network".
3. Fill in the following details:
   - Network Name: WSO2
   - New RPC URL: RPC URL
   - Chain ID: chain ID of WSO2 network
   - Currency Symbol: WSO2
   - Block Explorer URL: (optional)
4. Click "Save".
5. Switch to the WSO2 network in MetaMask.

## Project Structure

- `src/` — Main source code
- `src/components/` — UI and functional components
- `src/data/abi.ts` — Contract ABI and addresses
- `src/configs/` — Wagmi/RainbowKit configuration
- `src/data/chain-config.ts` — Custom chain configuration
