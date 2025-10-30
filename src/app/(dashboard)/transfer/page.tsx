import { TransferFlow } from "@/components/web3/transfer-flow"
import { Card, CardContent } from "@/components/ui/card"

export default function TransferPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Transfer Assets</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Send tokens and NFTs to any address</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <TransferFlow />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Token and NFT transfer support</li>
              <li>• Address book for saved recipients</li>
              <li>• ENS name resolution</li>
              <li>• Amount validation and balance checking</li>
              <li>• Gas estimation and priority settings</li>
              <li>• Transaction confirmation modal</li>
              <li>• Success feedback with explorer links</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { TransferFlow } from "@/components/web3/transfer-flow"

<TransferFlow />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
