import { BalanceQuickSelectShowcase } from "@/components/web3/showcases/balance-quick-select-showcase"

export default function BalanceQuickSelectPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Balance Quick Select</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
          Quick percentage buttons for balance selection
        </p>
      </header>

      <div className="animate-in fade-in duration-300">
        <BalanceQuickSelectShowcase />
      </div>
    </>
  )
}
