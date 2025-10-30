import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// Define supported networks for the Alchemy NFT API
const SUPPORTED_NETWORKS = [
  "eth-mainnet",
  "base-mainnet",
  "polygon-mainnet",
  "avax-mainnet",
] as const;

type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

// Network endpoints for Alchemy NFT API
const NETWORK_ENDPOINTS: Record<SupportedNetwork, string> = {
  "eth-mainnet": "https://eth-mainnet.g.alchemy.com/nft/v3",
  "base-mainnet": "https://base-mainnet.g.alchemy.com/nft/v3",
  "polygon-mainnet": "https://polygon-mainnet.g.alchemy.com/nft/v3",
  "avax-mainnet": "https://avax-mainnet.g.alchemy.com/nft/v3",
} as const;

interface AlchemyNFTAttribute {
  trait_type: string;
  value: string;
}

interface AlchemyNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: AlchemyNFTAttribute[];
}

interface AlchemyNFTRaw {
  tokenUri?: string;
  metadata?: AlchemyNFTMetadata;
  error?: string;
}

interface AlchemyNFTImage {
  cachedUrl?: string;
  thumbnailUrl?: string;
  pngUrl?: string;
  contentType?: string;
  size?: number;
  originalUrl?: string;
}

interface AlchemyNFTContract {
  address: string;
  name?: string;
  symbol?: string;
  totalSupply?: string;
  tokenType: string;
  contractDeployer?: string;
  deployedBlockNumber?: number;
  openSeaMetadata?: {
    floorPrice?: number;
    collectionName?: string;
    collectionSlug?: string;
    safelistRequestStatus?: string;
    imageUrl?: string;
    description?: string;
    externalUrl?: string;
    twitterUsername?: string;
    discordUrl?: string;
    bannerImageUrl?: string;
    lastIngestedAt?: string;
  };
  isSpam?: boolean;
  spamClassifications?: string[];
}

interface AlchemyNFT {
  contract: AlchemyNFTContract;
  tokenId: string;
  tokenType: string;
  name?: string;
  description?: string;
  tokenUri?: string;
  image: AlchemyNFTImage;
  animation?: {
    cachedUrl?: string;
    contentType?: string;
    size?: number;
    originalUrl?: string;
  };
  raw: AlchemyNFTRaw;
  collection?: {
    name?: string;
    slug?: string;
    externalUrl?: string;
    bannerImageUrl?: string;
  };
  mint?: {
    mintAddress?: string;
    blockNumber?: number;
    timestamp?: string;
    transactionHash?: string;
  };
  owners?: string[] | null;
  timeLastUpdated?: string;
  balance: string;
  acquiredAt?: {
    blockTimestamp?: string | null;
    blockNumber?: number | null;
  };
}

interface AlchemyNFTResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  validAt: {
    blockNumber: number;
    blockHash: string;
    blockTimestamp: string;
  };
  pageKey?: string;
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

/**
 * Fetches NFTs for a specific network
 */
async function fetchNFTsForNetwork(
  network: SupportedNetwork,
  address: string
): Promise<NFT[]> {
  const endpoint = NETWORK_ENDPOINTS[network];

  try {
    const baseUrl = `${endpoint}/${env.ALCHEMY_API_KEY}/getNFTsForOwner`;
    const params = new URLSearchParams({
      owner: address,
      withMetadata: "true",
      pageSize: "100", // Maximum allowed by Alchemy
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch NFTs for ${network}: ${response.status}`);
      return [];
    }

    const data: AlchemyNFTResponse = await response.json();

    // Transform Alchemy response to our NFT interface
    return data.ownedNfts
      .filter((nft) => !nft.contract.isSpam) // Filter out spam NFTs
      .map((nft, index) => {
        // Get attributes from raw metadata
        const attributes: { trait: string; value: string }[] = [];

        if (nft.raw.metadata?.attributes) {
          nft.raw.metadata.attributes.forEach((attr) => {
            if (attr.trait_type && attr.value) {
              attributes.push({
                trait: attr.trait_type,
                value: attr.value,
              });
            }
          });
        }

        // Use the best available image
        const imageUrl =
          nft.image.cachedUrl ||
          nft.image.thumbnailUrl ||
          nft.image.pngUrl ||
          nft.image.originalUrl ||
          "/placeholder.svg";

        return {
          id: `${network}-${nft.contract.address}-${nft.tokenId}-${index}`,
          name: nft.name || `Token #${nft.tokenId}`,
          collection:
            nft.contract.openSeaMetadata?.collectionName ||
            nft.collection?.name ||
            nft.contract.name ||
            "Unknown Collection",
          image: imageUrl,
          attributes,
          tokenId: nft.tokenId,
          contractAddress: nft.contract.address,
          tokenType: nft.tokenType,
          description: nft.description || nft.raw.metadata?.description,
        };
      });
  } catch (error) {
    console.error(`Error fetching NFTs for ${network}:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

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

    // Fetch NFTs from all supported networks in parallel
    const networkPromises = SUPPORTED_NETWORKS.map((network) =>
      fetchNFTsForNetwork(network, resolvedAddress)
    );
    const networkResults = await Promise.all(networkPromises);

    // Flatten results from all networks
    const allNFTs = networkResults.flat();

    return NextResponse.json({
      nfts: allNFTs,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch NFTs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
