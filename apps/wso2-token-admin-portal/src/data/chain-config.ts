import type { Chain } from "@rainbow-me/rainbowkit";
import type { Hex } from "viem";

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as Hex;

export const chainDetails: Chain = {
  id: Number(import.meta.env.VITE_CHAIN_ID) as number,
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
