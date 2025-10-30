"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { ReloadIcon } from "@radix-ui/react-icons"

interface Token {
  id: string
  symbol: string
  name: string
  balance: string
  usdValue: number
  change24h: number
  logo: string
}

interface TokenPortfolioProps {
  tokens?: Token[]
  isLoading?: boolean
  hasAddress?: boolean
}

export function TokenPortfolio({ tokens: externalTokens, isLoading = false, hasAddress = false }: TokenPortfolioProps) {
  const [hideSmallBalances, setHideSmallBalances] = useState(false)
  const [showBalances, setShowBalances] = useState(true)

  const tokens: Token[] = externalTokens || []

  const totalValue = tokens.reduce((sum, token) => sum + token.usdValue, 0)
  const filteredTokens = hideSmallBalances ? tokens.filter((token) => token.usdValue >= 100) : tokens

  if (!hasAddress && !isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
          <div className="rounded-full bg-muted p-6">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">No Address Selected</h3>
            <p className="text-sm text-muted-foreground text-balance max-w-md">
              Enter an Ethereum address or ENS name above to view token portfolio and balances
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Token Portfolio</CardTitle>
              <CardDescription>Loading token balances...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <ReloadIcon className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching portfolio data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Token Portfolio</CardTitle>
            <CardDescription>Your token balances and values</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowBalances(!showBalances)} className="h-8 w-8">
            {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-3xl font-bold">
            {showBalances ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="hide-small" checked={hideSmallBalances} onCheckedChange={setHideSmallBalances} />
          <Label htmlFor="hide-small" className="text-sm">
            Hide small balances
          </Label>
        </div>

        <div className="space-y-3">
          {filteredTokens.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <img src={token.logo || "/placeholder.svg"} alt={token.name} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-semibold">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{showBalances ? token.balance : "••••"}</div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">
                    {showBalances ? `$${token.usdValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••"}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 ${token.change24h >= 0 ? "text-accent" : "text-destructive"}`}
                  >
                    {token.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(token.change24h).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
