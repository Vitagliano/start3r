"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SlippageSettings } from "@/components/web3/slippage-settings"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function SlippageSettingsShowcase() {
  const [slippage, setSlippage] = useState("0.5")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slippage Settings Component</CardTitle>
          <CardDescription>
            Configure slippage tolerance with preset options and custom input, includes advanced settings for bridge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Basic Usage (Swap)</Label>
              <SlippageSettings slippage={slippage} onSlippageChange={setSlippage} />
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Current Slippage: <Badge variant="secondary">{slippage}%</Badge>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">With Advanced Settings (Bridge)</Label>
              <SlippageSettings slippage={slippage} onSlippageChange={setSlippage} showAdvancedOptions icon="settings2" />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Preset slippage options (0.1%, 0.5%, 1.0%)</li>
              <li>• Custom slippage input with validation</li>
              <li>• Warning indicators for high slippage</li>
              <li>• Optional advanced settings for bridge operations</li>
              <li>• Responsive popover design</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { SlippageSettings } from "@/components/web3/slippage-settings"

const [slippage, setSlippage] = useState("0.5")

// Basic usage
<SlippageSettings 
  slippage={slippage} 
  onSlippageChange={setSlippage} 
/>

// With advanced settings (for bridge)
<SlippageSettings 
  slippage={slippage} 
  onSlippageChange={setSlippage}
  showAdvancedOptions
  icon="settings2"
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
