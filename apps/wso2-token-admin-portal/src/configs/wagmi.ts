import { chainDetails } from "@/data/chain-config";
import { getDefaultConfig, type Chain } from "@rainbow-me/rainbowkit";

const wso2 = {
  id: chainDetails.id,
  name: chainDetails.name,
  iconUrl: chainDetails.iconUrl,
  iconBackground: "#fff",
  nativeCurrency: {
    name: chainDetails.nativeCurrency.name,
    symbol: chainDetails.nativeCurrency.symbol,
    decimals: chainDetails.nativeCurrency.decimals,
  },
  rpcUrls: {
    default: { http: [chainDetails.rpcUrls.default.http[0]] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "WSO2 admin panel",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [wso2],
});
