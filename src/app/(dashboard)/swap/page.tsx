import { SwapComponent } from "@/components/web3/swap-component"
import { Card, CardContent } from "@/components/ui/card"
import { CodeSection } from "@/components/code/CodeSection"

export default function SwapPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Swap Tokens</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Exchange tokens at the best rates</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <SwapComponent />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Router-agnostic swap interface</li>
              <li>• Real-time price quotes with auto-refresh</li>
              <li>• Balance quick-select buttons (25%, 50%, 75%, Max)</li>
              <li>• Price impact and slippage warnings</li>
              <li>• Detailed fee breakdown (LP, protocol, network)</li>
              <li>• Minimum received calculation</li>
              <li>• Review modal before transaction confirmation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { SwapComponent } from "@/components/web3/swap-component"

<SwapComponent />`}
            </pre>
          </CardContent>
        </Card>
      </div>

      <CodeSection title="Copy the SwapComponent component" file="src/components/web3/swap-component.tsx" />
    </>
  )
}
