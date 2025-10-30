"use client"

import { Button } from "@/components/ui/button"

/**
 * Props for the BalanceQuickSelect component
 * @property {string} balance - Current token balance as a string
 * @property {function} onAmountSelect - Callback fired when a percentage is selected
 * @property {string} [className] - Optional CSS classes for styling
 */
interface BalanceQuickSelectProps {
  balance: string
  onAmountSelect: (amount: string) => void
  className?: string
}

/**
 * BalanceQuickSelect - Quick percentage selection buttons for token amounts
 *
 * Provides convenient buttons to select 25%, 50%, 75%, or 100% (Max) of available balance.
 * Commonly used in swap, bridge, and transfer interfaces for quick amount selection.
 *
 * Features:
 * - Calculates percentage of balance automatically
 * - Formats output to 6 decimal places
 * - Mobile-friendly compact button layout
 * - Consistent styling across the application
 *
 * @example
 * ```tsx
 * import { BalanceQuickSelect } from '@/components/web3/balance-quick-select'
 *
 * function SwapForm() {
 *   const [amount, setAmount] = useState("")
 *   const balance = "2.5" // ETH balance
 *
 *   return (
 *     <div>
 *       <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
 *       <BalanceQuickSelect
 *         balance={balance}
 *         onAmountSelect={setAmount}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function BalanceQuickSelect({ balance, onAmountSelect, className }: BalanceQuickSelectProps) {
  /**
   * Calculate and set the amount based on percentage of balance
   * @param {number} percent - Percentage as decimal (0.25 = 25%, 1 = 100%)
   */
  const handlePercentClick = (percent: number) => {
    const balanceNum = Number.parseFloat(balance || "0")
    const amount = (balanceNum * percent).toFixed(6)
    onAmountSelect(amount)
  }

  return (
    <div className={`flex gap-1 ${className || ""}`}>
      {[0.25, 0.5, 0.75, 1].map((percent) => (
        <Button
          key={percent}
          variant="ghost"
          size="sm"
          onClick={() => handlePercentClick(percent)}
          className="h-6 px-2 text-xs"
        >
          {percent === 1 ? "Max" : `${percent * 100}%`}
        </Button>
      ))}
    </div>
  )
}
