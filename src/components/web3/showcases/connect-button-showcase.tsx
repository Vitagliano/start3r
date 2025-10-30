"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectButton } from "@/components/connect-button"

export function ConnectButtonShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Button Component</CardTitle>
          <CardDescription>
            Authentication via Privy with address avatar, dropdown actions, and disconnect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ConnectButton />
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Usage</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">{`import { ConnectButton } from "@/components/connect-button"

<ConnectButton />`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


