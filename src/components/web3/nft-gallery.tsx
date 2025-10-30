"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon } from "lucide-react"
import { MagnifyingGlassIcon, PaperPlaneIcon, ReloadIcon } from "@radix-ui/react-icons"

interface NFT {
  id: string
  name: string
  collection: string
  image: string
  attributes: { trait: string; value: string }[]
  tokenId: string
}

interface NftGalleryProps {
  nfts?: NFT[]
  isLoading?: boolean
  hasAddress?: boolean
}

export function NftGallery({ nfts: externalNFTs, isLoading = false, hasAddress = false }: NftGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCollection, setFilterCollection] = useState("all")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

  const mockNFTs: NFT[] = externalNFTs || []

  const collections = ["all", ...Array.from(new Set(mockNFTs.map((nft) => nft.collection)))]

  const filteredNFTs = mockNFTs.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCollection = filterCollection === "all" || nft.collection === filterCollection
    return matchesSearch && matchesCollection
  })

  if (!hasAddress && !isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
          <div className="rounded-full bg-muted p-6">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">No Address Selected</h3>
            <p className="text-sm text-muted-foreground text-balance max-w-md">
              Enter an Ethereum address or ENS name above to view NFT collection
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription>Loading NFT collection...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <ReloadIcon className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching NFTs...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Gallery</CardTitle>
        <CardDescription>Browse and manage your NFT collection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCollection} onValueChange={setFilterCollection}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection} value={collection}>
                  {collection === "all" ? "All Collections" : collection}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNFTs.map((nft) => (
            <Dialog key={nft.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedNFT(nft)}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 p-3">
                    <div className="font-semibold text-sm">{nft.name}</div>
                    <div className="text-xs text-muted-foreground">{nft.collection}</div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedNFT?.name}</DialogTitle>
                  <DialogDescription>{selectedNFT?.collection}</DialogDescription>
                </DialogHeader>
                {selectedNFT && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-lg">
                      <img src={selectedNFT.image || "/placeholder.svg"} alt={selectedNFT.name} className="w-full" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold">Token ID</div>
                        <div className="font-mono text-sm text-muted-foreground">#{selectedNFT.tokenId}</div>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold">Attributes</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedNFT.attributes.map((attr, idx) => (
                            <Badge key={idx} variant="secondary">
                              {attr.trait}: {attr.value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <PaperPlaneIcon className="h-4 w-4" />
                      Transfer NFT
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
