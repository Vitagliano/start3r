"use client"

import { useState } from "react"
import { TokenPortfolio } from "@/components/web3/token-portfolio"
import { AddressInput } from "@/components/web3/address-input"
import { fetchTokensByAddress } from "@/lib/alchemy-api"
import { Card, CardContent } from "@/components/ui/card"
import { ClientCodeSection } from "@/components/code/ClientCodeSection"

export default function PortfolioPage() {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleAddressSubmit = async (address: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedTokens = await fetchTokensByAddress(address)
      setCurrentAddress(address)
      setTokens(fetchedTokens)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data')
      setTokens([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Token Portfolio</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">View and manage your token balances</p>
      </header>

      <div className="mb-6 animate-in fade-in duration-300">
        <AddressInput onAddressSubmit={handleAddressSubmit} isLoading={isLoading} currentAddress={currentAddress} />
      </div>

      {error && (
        <div className="mb-6 animate-in fade-in duration-300">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-destructive">
                <strong>Error:</strong> {error}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="animate-in fade-in duration-300">
        <TokenPortfolio tokens={tokens} isLoading={isLoading} hasAddress={!!currentAddress} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time token balances from Ethereum, Base, Polygon, and Avalanche</li>
              <li>• Live USD pricing data from Alchemy API</li>
              <li>• Toggle visibility for individual tokens</li>
              <li>• Address input with validation</li>
              <li>• Quick-access example addresses</li>
              <li>• Responsive grid layout for mobile and desktop</li>
              <li>• Loading states and error handling</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { TokenPortfolio } from "@/components/web3/token-portfolio"

<TokenPortfolio 
  tokens={tokens}
  isLoading={false}
  hasAddress={true}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>

      <ClientCodeSection
        title="Copy the TokenPortfolio component"
        file="src/components/web3/token-portfolio.tsx"
      />
    </>
  )
}
