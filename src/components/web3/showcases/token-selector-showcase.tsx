"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "@/components/web3/token-selector"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AVAILABLE_TOKENS } from "@/lib/token-data"

export function TokenSelectorShowcase() {
  const [selectedToken, setSelectedToken] = useState("ETH")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Selector Component</CardTitle>
          <CardDescription>
            A reusable token selector with search functionality, token logos, and balance display
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Basic Usage</Label>
              <TokenSelector tokens={AVAILABLE_TOKENS} selectedToken={selectedToken} onSelectToken={setSelectedToken} />
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="text-sm text-muted-foreground">
                Selected Token: <Badge variant="secondary">{selectedToken}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time search filtering by symbol or name</li>
              <li>• Token logos and balance display</li>
              <li>• Keyboard navigation support</li>
              <li>• Responsive popover design</li>
              <li>• Touch-friendly on mobile devices</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { TokenSelector } from "@/components/web3/token-selector"
import { AVAILABLE_TOKENS } from "@/lib/token-data"

const [selectedToken, setSelectedToken] = useState("ETH")

<TokenSelector 
  tokens={AVAILABLE_TOKENS}
  selectedToken={selectedToken} 
  onSelectToken={setSelectedToken} 
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
