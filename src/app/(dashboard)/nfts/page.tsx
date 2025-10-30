"use client"

import { useState } from "react"
import { NftGallery } from "@/components/web3/nft-gallery"
import { AddressInput } from "@/components/web3/address-input"
import { generateMockNFTs } from "@/lib/mock-data-generator"
import { Card, CardContent } from "@/components/ui/card"
import { ClientCodeSection } from "@/components/code/ClientCodeSection"

export default function NFTsPage() {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mockNFTs, setMockNFTs] = useState<any[]>([])

  const handleAddressSubmit = async (address: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const nfts = generateMockNFTs(address)
    setCurrentAddress(address)
    setMockNFTs(nfts)
    setIsLoading(false)
  }

  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">NFT Gallery</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Browse and manage your NFT collection</p>
      </header>

      <div className="mb-6 animate-in fade-in duration-300">
        <AddressInput onAddressSubmit={handleAddressSubmit} isLoading={isLoading} currentAddress={currentAddress} />
      </div>

      <div className="animate-in fade-in duration-300">
        <NftGallery nfts={mockNFTs} isLoading={isLoading} hasAddress={!!currentAddress} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Grid layout with responsive columns</li>
              <li>• Filtering by collection and attributes</li>
              <li>• Image viewer with attribute display</li>
              <li>• Transfer capabilities with address book</li>
              <li>• Address input with ENS resolution</li>
              <li>• Loading states and empty state handling</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { NftGallery } from "@/components/web3/nft-gallery"

<NftGallery 
  nfts={nfts}
  isLoading={false}
  hasAddress={true}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>

      <ClientCodeSection
        title="Copy the NftGallery component"
        file="src/components/web3/nft-gallery.tsx"
      />
    </>
  )
}
