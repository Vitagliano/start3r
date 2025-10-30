import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// Define supported networks for the Alchemy API
export const SUPPORTED_NETWORKS = [
  "eth-mainnet",
  "base-mainnet",
  "polygon-mainnet",
  "avax-mainnet",
] as const;

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

interface AlchemyTokenResponse {
  address: string;
  network: string;
  tokenAddress: string;
  tokenBalance: string;
  tokenMetadata: {
    decimals: number;
    logo: string | null;
    name: string;
    symbol: string;
  };
  tokenPrices: Array<{
    currency: string;
    value: string;
    lastUpdatedAt: string;
  }>;
  error?: string;
}

interface AlchemyApiResponse {
  data: {
    tokens: AlchemyTokenResponse[];
    pageKey?: string;
  };
}

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

/**
 * Validates if an address is a valid Ethereum address
 * @param address - The address to validate
 * @returns boolean
 */
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates if a string is a valid ENS name
 * @param name - The name to validate
 * @returns boolean
 */
function isValidEnsName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+\.eth$/.test(name);
}

/**
 * Resolves an ENS name to an Ethereum address
 * @param ensName - The ENS name to resolve
 * @returns Promise<string | null> - The resolved address or null if not found
 */
async function resolveEnsName(ensName: string): Promise<string | null> {
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const address = await client.getEnsAddress({
      name: ensName,
    });

    return address;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address, networks = SUPPORTED_NETWORKS } = await request.json();

    let resolvedAddress = address;

    // Handle ENS names
    if (isValidEnsName(address)) {
      const resolved = await resolveEnsName(address);
      if (!resolved) {
        return NextResponse.json(
          { error: "Could not resolve ENS name to an Ethereum address" },
          { status: 400 }
        );
      }
      resolvedAddress = resolved;
    } else if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address or ENS name format" },
        { status: 400 }
      );
    }

    const url = `https://api.g.alchemy.com/data/v1/${env.ALCHEMY_API_KEY}/assets/tokens/by-address`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addresses: [
          {
            address: resolvedAddress,
            networks,
          },
        ],
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `Alchemy API error: ${response.status} ${response.statusText}`
      );
    }

    const data: AlchemyApiResponse = await response.json();

    // Transform Alchemy response to our Token interface
    const tokens: Token[] = data.data.tokens
      .filter((token) => !token.error) // Filter out tokens with errors
      .map((token, index) => {
        // Find USD price if available
        const usdPrice = token.tokenPrices.find(
          (price) => price.currency === "usd"
        );

        // Convert token balance to readable format
        const decimals = token.tokenMetadata.decimals || 18;
        const balance = (
          parseFloat(token.tokenBalance) / Math.pow(10, decimals)
        ).toString();

        // Calculate USD value
        const usdValue = usdPrice
          ? parseFloat(usdPrice.value) * parseFloat(balance)
          : 0;

        return {
          id: `${token.network}-${token.tokenAddress}-${index}`,
          symbol: token.tokenMetadata.symbol,
          name: token.tokenMetadata.name,
          balance,
          usdValue,
          change24h: 0, // Alchemy doesn't provide 24h change, set to 0 for now
          logo: token.tokenMetadata.logo || "/placeholder.svg",
          network: token.network,
          tokenAddress: token.tokenAddress,
        };
      })
      // Sort by USD value descending
      .sort((a, b) => b.usdValue - a.usdValue);

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch token data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
