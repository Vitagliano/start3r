import { ConnectButtonShowcase } from "@/components/web3/showcases/connect-button-showcase"
import { CodeSection } from "@/components/code/CodeSection"

export default function ConnectButtonPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Connect Button</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
          Wallet connect button with account dropdown and disconnect
        </p>
      </header>

      <div className="animate-in fade-in duration-300">
        <ConnectButtonShowcase />
      </div>

      <CodeSection
        title="Copy the ConnectButton component"
        file="src/components/connect-button.tsx"
      />
    </>
  )
}


