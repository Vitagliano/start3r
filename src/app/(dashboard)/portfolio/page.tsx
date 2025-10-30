"use client"

import { useState } from "react"
import { TokenPortfolio } from "@/components/web3/token-portfolio"
import { AddressInput } from "@/components/web3/address-input"
import { generateMockTokens } from "@/lib/mock-data-generator"
import { Card, CardContent } from "@/components/ui/card"

export default function PortfolioPage() {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mockTokens, setMockTokens] = useState<any[]>([])

  const handleAddressSubmit = async (address: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const tokens = generateMockTokens(address)
    setCurrentAddress(address)
    setMockTokens(tokens)
    setIsLoading(false)
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

      <div className="animate-in fade-in duration-300">
        <TokenPortfolio tokens={mockTokens} isLoading={isLoading} hasAddress={!!currentAddress} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time token balance display with USD values</li>
              <li>• Toggle visibility for individual tokens</li>
              <li>• Address input with ENS resolution support</li>
              <li>• Quick-access example addresses</li>
              <li>• Responsive grid layout for mobile and desktop</li>
              <li>• Loading states and empty state handling</li>
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
    </>
  )
}
