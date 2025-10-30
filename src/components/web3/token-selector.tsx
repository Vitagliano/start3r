"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

/**
 * Token interface representing a cryptocurrency or token
 * @property {string} symbol - Token ticker symbol (e.g., "ETH", "USDC")
 * @property {string} name - Full token name (e.g., "Ethereum", "USD Coin")
 * @property {string} [logo] - Optional URL to token logo image
 * @property {string} [balance] - Optional user balance for this token
 * @property {string} [address] - Optional contract address for the token
 */
export interface Token {
  symbol: string
  name: string
  logo?: string
  balance?: string
  address?: string
  price?: number
}

/**
 * Props for the TokenSelector component
 * @property {Token[]} tokens - Array of available tokens to select from
 * @property {string} selectedToken - Currently selected token symbol
 * @property {function} onSelectToken - Callback fired when a token is selected
 * @property {string} [className] - Optional CSS classes for styling
 * @property {boolean} [showBalance] - Whether to display token balances (default: true)
 */
interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: string
  onSelectToken: (token: string) => void
  className?: string
  showBalance?: boolean
}

/**
 * TokenSelector - A searchable dropdown component for selecting cryptocurrency tokens
 *
 * Features:
 * - Real-time search filtering by token symbol or name
 * - Displays token logos, names, and optional balances
 * - Keyboard navigation support
 * - Responsive design with mobile-friendly touch targets
 *
 * @example
 * ```tsx
 * import { TokenSelector } from '@/components/web3/token-selector'
 * import { tokens } from '@/lib/token-data'
 *
 * function MyComponent() {
 *   const [selectedToken, setSelectedToken] = useState("ETH")
 *
 *   return (
 *     <TokenSelector
 *       tokens={tokens}
 *       selectedToken={selectedToken}
 *       onSelectToken={setSelectedToken}
 *       showBalance={true}
 *     />
 *   )
 * }
 * ```
 */
export function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  className,
  showBalance = true,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Find the currently selected token data for display
  const selectedTokenData = tokens.find((token) => token.symbol === selectedToken)

  // Filter tokens based on search query (matches symbol or name)
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background hover:bg-muted/50", className)}
        >
          <div className="flex items-center gap-2">
            {selectedTokenData?.logo && (
              <img
                src={selectedTokenData.logo || "/placeholder.svg"}
                alt={selectedTokenData.symbol}
                className="h-5 w-5 rounded-full"
              />
            )}
            <span className="font-semibold">{selectedToken}</span>
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b border-border px-3">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {filteredTokens.map((token) => (
                <CommandItem
                  key={token.symbol}
                  value={token.symbol}
                  onSelect={() => {
                    onSelectToken(token.symbol)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {token.logo && (
                      <img src={token.logo || "/placeholder.svg"} alt={token.symbol} className="h-8 w-8 rounded-full" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold">{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showBalance && token.balance && (
                      <span className="text-sm text-muted-foreground">{token.balance}</span>
                    )}
                    <CheckIcon className={cn("h-4 w-4", selectedToken === token.symbol ? "opacity-100" : "opacity-0")} />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
