import { TokenSelectorShowcase } from "@/components/web3/showcases/token-selector-showcase"
import { CodeSection } from "@/components/code/CodeSection"

export default function TokenSelectorPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Token Selector</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
          Search and select tokens with real-time filtering
        </p>
      </header>

      <div className="animate-in fade-in duration-300">
        <TokenSelectorShowcase />
      </div>

      <CodeSection
        title="Copy the TokenSelector component"
        file="src/components/web3/token-selector.tsx"
      />
    </>
  )
}
