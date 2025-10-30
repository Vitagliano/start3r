import { MintNFT } from "@/components/web3/mint-nft"
import { Card, CardContent } from "@/components/ui/card"

export default function MintPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Mint NFT</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Mint NFTs from verified collections</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <MintNFT />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Collection preview with verified badge</li>
              <li>• Real-time supply tracking with progress bar</li>
              <li>• Countdown timer for sale phases</li>
              <li>• Quantity selector with quick-select buttons</li>
              <li>• Gas priority settings (Low, Medium, High)</li>
              <li>• Approval flow for ERC20 payments</li>
              <li>• Multi-step transaction status tracker</li>
              <li>• Success modal with minted token previews</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { MintNFT } from "@/components/web3/mint-nft"

<MintNFT />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
