// Define supported networks for the Alchemy API
export const SUPPORTED_NETWORKS = [
  "eth-mainnet",
  "base-mainnet",
  "polygon-mainnet",
  "avax-mainnet",
] as const;

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  usdValue: number;
  change24h: number;
  logo: string;
  network: string;
  tokenAddress: string;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  attributes: { trait: string; value: string }[];
  tokenId: string;
  contractAddress: string;
  tokenType: string;
  description?: string;
}

/**
 * Fetches token balances for a wallet address across multiple EVM networks
 * @param address - The wallet address to fetch tokens for
 * @param networks - Array of networks to query (defaults to all supported networks)
 * @returns Promise<Token[]> - Array of tokens with balances and metadata
 */
export async function fetchTokensByAddress(
  address: string,
  networks: SupportedNetwork[] = [...SUPPORTED_NETWORKS]
): Promise<Token[]> {
  try {
    const response = await fetch("/api/portfolio/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        networks,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Alchemy API response:", data);
    return data.tokens;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw new Error(
      `Failed to fetch token data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetches NFTs owned by a wallet address across all supported networks
 * @param address - The wallet address to fetch NFTs for
 * @returns Promise<NFT[]> - Array of NFTs with metadata
 */
export async function fetchNFTsByAddress(address: string): Promise<NFT[]> {
  try {
    const response = await fetch("/api/portfolio/nfts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw new Error(
      `Failed to fetch NFTs: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validates if an address is a valid Ethereum address
 * @param address - The address to validate
 * @returns boolean
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates if a string is a valid ENS name
 * @param name - The name to validate
 * @returns boolean
 */
export function isValidEnsName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+\.eth$/.test(name);
}
