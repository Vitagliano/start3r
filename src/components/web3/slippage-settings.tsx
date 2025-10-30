"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings } from "lucide-react"

/**
 * Props for the SlippageSettings component
 * @property {string} slippage - Current slippage tolerance percentage
 * @property {function} onSlippageChange - Callback when slippage value changes
 * @property {string} [customSlippage] - Custom slippage input value
 * @property {function} [onCustomSlippageChange] - Callback for custom slippage input
 * @property {boolean} [showAdvancedOptions] - Show additional bridge-specific options
 * @property {"settings" | "settings2"} [icon] - Icon variant to display
 */
interface SlippageSettingsProps {
  slippage: string
  onSlippageChange: (value: string) => void
  customSlippage?: string
  onCustomSlippageChange?: (value: string) => void
  showAdvancedOptions?: boolean
  icon?: "settings" | "settings2"
}

/**
 * SlippageSettings - Configurable slippage tolerance settings popover
 *
 * Allows users to set their slippage tolerance for swaps and bridges.
 * Slippage tolerance determines how much price movement is acceptable
 * before a transaction reverts.
 *
 * Features:
 * - Preset slippage values (0.1%, 0.5%, 1.0%)
 * - Custom slippage input
 * - Optional advanced settings for bridge operations
 * - Clear explanation of slippage tolerance
 * - Reusable across swap and bridge components
 *
 * @example
 * ```tsx
 * import { SlippageSettings } from '@/components/web3/slippage-settings'
 *
 * function SwapComponent() {
 *   const [slippage, setSlippage] = useState("0.5")
 *   const [customSlippage, setCustomSlippage] = useState("")
 *
 *   return (
 *     <SlippageSettings
 *       slippage={slippage}
 *       onSlippageChange={setSlippage}
 *       customSlippage={customSlippage}
 *       onCustomSlippageChange={setCustomSlippage}
 *     />
 *   )
 * }
 * ```
 */
export function SlippageSettings({
  slippage,
  onSlippageChange,
  customSlippage = "",
  onCustomSlippageChange,
  showAdvancedOptions = false,
  icon = "settings",
}: SlippageSettingsProps) {
  const SettingsIcon = icon === "settings2" ? Settings2 : Settings

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Slippage Tolerance</h4>
            {/* Preset slippage buttons */}
            <div className="flex gap-2 mb-2">
              {["0.1", "0.5", "1.0"].map((preset) => (
                <Button
                  key={preset}
                  variant={slippage === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onSlippageChange(preset)
                    if (onCustomSlippageChange) onCustomSlippageChange("")
                  }}
                  className="flex-1"
                >
                  {preset}%
                </Button>
              ))}
            </div>
            {/* Custom slippage input */}
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => {
                  if (onCustomSlippageChange) onCustomSlippageChange(e.target.value)
                  if (e.target.value) onSlippageChange(e.target.value)
                }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </div>
          {/* Advanced options for bridge component */}
          {showAdvancedOptions && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-claim on destination</span>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prefer canonical bridge</span>
                  <Checkbox />
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
