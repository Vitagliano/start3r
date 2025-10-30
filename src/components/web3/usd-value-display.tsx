interface UsdValueDisplayProps {
  amount: string
  price: number
  className?: string
}

/**
 * UsdValueDisplay - Displays the USD equivalent value of a token amount
 *
 * Calculates and displays the approximate USD value based on token amount
 * and current price. Returns null if amount is zero or empty.
 *
 * Features:
 * - Automatic USD conversion calculation
 * - Formatted to 2 decimal places
 * - Null rendering for zero/empty amounts
 * - Consistent styling with muted text
 *
 * @example
 * ```tsx
 * import { UsdValueDisplay } from '@/components/web3/usd-value-display'
 *
 * function TokenInput() {
 *   const amount = "2.5"
 *   const ethPrice = 3500 // $3500 per ETH
 *
 *   return (
 *     <div>
 *       <Input value={amount} />
 *       <UsdValueDisplay amount={amount} price={ethPrice} />
 *       // Displays: ≈ $8750.00 USD
 *     </div>
 *   )
 * }
 * ```
 */
export function UsdValueDisplay({ amount, price, className }: UsdValueDisplayProps) {
  // Calculate USD value: amount * price, formatted to 2 decimals
  const usdValue = amount ? (Number.parseFloat(amount) * price).toFixed(2) : "0"

  // Don't render anything if amount is empty or zero
  if (!amount || amount === "0") return null

  return <div className={`text-xs text-muted-foreground ${className || ""}`}>≈ ${usdValue} USD</div>
}
