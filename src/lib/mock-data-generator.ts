export function generateMockTokens(address: string) {
  const seed = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (min: number, max: number, index: number) => {
    const x = Math.sin(seed + index) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }

  const tokens = [
    { symbol: "ETH", name: "Ethereum", logo: "/ethereum-abstract.png" },
    { symbol: "USDC", name: "USD Coin", logo: "/usdc-coins.png" },
    { symbol: "UNI", name: "Uniswap", logo: "/uniswap-concept.png" },
    { symbol: "LINK", name: "Chainlink", logo: "/chainlink-abstract.png" },
    { symbol: "AAVE", name: "Aave", logo: "/aave-logo.png" },
    { symbol: "MATIC", name: "Polygon", logo: "/polygon-logo.png" },
  ]

  const numTokens = Math.floor(random(3, 6, 0))
  const selectedTokens = tokens.slice(0, numTokens)

  return selectedTokens.map((token, index) => ({
    id: `${index + 1}`,
    symbol: token.symbol,
    name: token.name,
    balance: random(0.1, 1000, index + 1).toFixed(token.symbol === "USDC" ? 2 : 4),
    usdValue: random(100, 10000, index + 10),
    change24h: random(-10, 15, index + 20),
    logo: token.logo,
  }))
}

export function generateMockNFTs(address: string) {
  const seed = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (min: number, max: number, index: number) => {
    const x = Math.sin(seed + index) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }

  const collections = [
    { name: "Cosmic Apes", prefix: "Cosmic Ape", image: "/nft-ape.jpg" },
    { name: "Digital Punks", prefix: "Digital Punk", image: "/nft-punk.jpg" },
    { name: "Art Blocks", prefix: "Art Block", image: "/generative-art.jpg" },
    { name: "Doodles", prefix: "Doodle", image: "/nft-doodle.jpg" },
    { name: "Cool Cats", prefix: "Cool Cat", image: "/cool-cat-nft.jpg" },
  ]

  const backgrounds = ["Purple", "Blue", "Green", "Orange", "Pink", "Cosmic"]
  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
  const traits = ["Laser Eyes", "Crown", "Shades", "Hat", "Hoodie", "Suit"]

  const numNFTs = Math.floor(random(2, 8, 0))

  return Array.from({ length: numNFTs }, (_, index) => {
    const collection = collections[Math.floor(random(0, collections.length, index))]
    const tokenId = Math.floor(random(1000, 9999, index + 100))

    return {
      id: `${index + 1}`,
      name: `${collection.prefix} #${tokenId}`,
      collection: collection.name,
      image: collection.image,
      attributes: [
        { trait: "Background", value: backgrounds[Math.floor(random(0, backgrounds.length, index + 200))] },
        { trait: "Trait", value: traits[Math.floor(random(0, traits.length, index + 300))] },
        { trait: "Rarity", value: rarities[Math.floor(random(0, rarities.length, index + 400))] },
      ],
      tokenId: tokenId.toString(),
    }
  })
}

export function generateMockApprovals() {
  return [
    {
      id: "1",
      token: "USDC",
      spender: "0x1234...5678",
      spenderName: "Uniswap V3",
      amount: "Unlimited",
      type: "ERC20" as const,
      approvedAt: "2024-01-15",
      risk: "low" as const,
    },
    {
      id: "2",
      token: "ETH",
      spender: "0xabcd...efgh",
      spenderName: "OpenSea",
      amount: "All NFTs",
      type: "ERC721" as const,
      approvedAt: "2024-02-20",
      risk: "medium" as const,
    },
    {
      id: "3",
      token: "DAI",
      spender: "0x9876...5432",
      spenderName: "Unknown Contract",
      amount: "Unlimited",
      type: "ERC20" as const,
      approvedAt: "2023-12-01",
      risk: "high" as const,
    },
    {
      id: "4",
      token: "LINK",
      spender: "0x5555...6666",
      spenderName: "1inch",
      amount: "1000",
      type: "ERC20" as const,
      approvedAt: "2024-03-10",
      risk: "low" as const,
    },
  ]
}
