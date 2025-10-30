import type { Chain } from "@/components/web3/chain-selector"

export const AVAILABLE_CHAINS: Chain[] = [
  { id: "ethereum", name: "Ethereum", logo: "/ethereum-abstract.png" },
  { id: "polygon", name: "Polygon", logo: "/polygon-logo.png" },
  { id: "arbitrum", name: "Arbitrum", logo: "/arbitrum-logo-abstract.png" },
  { id: "optimism", name: "Optimism", logo: "/optimism.jpg" },
  { id: "base", name: "Base", logo: "/foundational-structure.png" },
  { id: "avalanche", name: "Avalanche", logo: "/avalanche-logo-abstract.png" },
  { id: "bsc", name: "BNB Chain", logo: "/binance-smart-chain-logo.jpg" },
  { id: "fantom", name: "Fantom", logo: "/fantom-logo.png" },
  { id: "gnosis", name: "Gnosis", logo: "/gnosis-logo.png" },
  { id: "zksync", name: "zkSync Era", logo: "/zksync-logo.png" },
]

export const chains = AVAILABLE_CHAINS
