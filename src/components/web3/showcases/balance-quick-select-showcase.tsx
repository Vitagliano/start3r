"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BalanceQuickSelect } from "@/components/web3/balance-quick-select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function BalanceQuickSelectShowcase() {
  const [selectedAmount, setSelectedAmount] = useState<string>("")
  const balance = "2.5"

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Quick Select Component</CardTitle>
          <CardDescription>Quick percentage buttons for selecting portions of available balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Basic Usage</Label>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Balance: {balance} ETH</div>
                <BalanceQuickSelect balance={balance} onAmountSelect={handleAmountSelect} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Selected Amount: <Badge variant="secondary">{selectedAmount || "0"} ETH</Badge>
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Quick percentage selection (25%, 50%, 75%, Max)</li>
              <li>• Responsive button layout</li>
              <li>• Touch-friendly on mobile devices</li>
              <li>• Callback function for amount calculation</li>
              <li>• Consistent styling with theme</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { BalanceQuickSelect } from "@/components/web3/balance-quick-select"

const balance = "2.5"

const handleAmountSelect = (amount: string) => {
  setAmount(amount)
}

<BalanceQuickSelect 
  balance={balance} 
  onAmountSelect={handleAmountSelect} 
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
