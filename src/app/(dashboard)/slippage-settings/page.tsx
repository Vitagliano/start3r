import { SlippageSettingsShowcase } from "@/components/web3/showcases/slippage-settings-showcase"

export default function SlippageSettingsPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Slippage Settings</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
          Configure slippage tolerance and advanced settings
        </p>
      </header>

      <div className="animate-in fade-in duration-300">
        <SlippageSettingsShowcase />
      </div>
    </>
  )
}
