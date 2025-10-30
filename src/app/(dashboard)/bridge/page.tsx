import { BridgeComponent } from "@/components/web3/bridge-component"
import { Card, CardContent } from "@/components/ui/card"

export default function BridgePage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Bridge Assets</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Transfer assets across chains</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <BridgeComponent />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Cross-chain asset transfers with abstracted routing</li>
              <li>• Chain and token selection with search</li>
              <li>• Balance quick-select and recipient address support</li>
              <li>• Real-time fee breakdown and gas estimates</li>
              <li>• Estimated arrival time with range display</li>
              <li>• Live transaction status tracker with message IDs</li>
              <li>• High fee and price impact warnings</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { BridgeComponent } from "@/components/web3/bridge-component"

<BridgeComponent />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
