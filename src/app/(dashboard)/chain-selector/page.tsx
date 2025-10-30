import { ChainSelectorShowcase } from "@/components/web3/showcases/chain-selector-showcase"

export default function ChainSelectorPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Chain Selector</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Search and select blockchain networks</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <ChainSelectorShowcase />
      </div>
    </>
  )
}
