"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

/**
 * Chain interface representing a blockchain network
 * @property {string} id - Unique chain identifier (e.g., "ethereum", "polygon")
 * @property {string} name - Human-readable chain name (e.g., "Ethereum", "Polygon")
 * @property {string} logo - URL to chain logo image
 */
export interface Chain {
  id: string
  name: string
  logo: string
}

/**
 * Props for the ChainSelector component
 * @property {Chain[]} chains - Array of available blockchain networks
 * @property {string} selectedChain - Currently selected chain ID
 * @property {function} onSelectChain - Callback fired when a chain is selected
 * @property {string} [className] - Optional CSS classes for styling
 * @property {string} [placeholder] - Placeholder text when no chain is selected
 */
interface ChainSelectorProps {
  chains: Chain[]
  selectedChain: string
  onSelectChain: (chainId: string) => void
  className?: string
  placeholder?: string
}

/**
 * ChainSelector - A searchable dropdown component for selecting blockchain networks
 *
 * Features:
 * - Real-time search filtering by chain name or ID
 * - Displays chain logos and names
 * - Optimized with useMemo for performance
 * - Keyboard navigation support
 * - Mobile-responsive design
 *
 * @example
 * ```tsx
 * import { ChainSelector } from '@/components/web3/chain-selector'
 * import { chains } from '@/lib/chain-data'
 *
 * function BridgeComponent() {
 *   const [fromChain, setFromChain] = useState("ethereum")
 *
 *   return (
 *     <ChainSelector
 *       chains={chains}
 *       selectedChain={fromChain}
 *       onSelectChain={setFromChain}
 *       placeholder="Select source chain"
 *     />
 *   )
 * }
 * ```
 */
export function ChainSelector({
  chains,
  selectedChain,
  onSelectChain,
  className,
  placeholder = "Select chain",
}: ChainSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Find the currently selected chain data for display
  const selectedChainData = chains.find((chain) => chain.id === selectedChain)

  // Memoized filtered chains for performance optimization
  const filteredChains = useMemo(() => {
    if (!searchQuery) return chains
    const query = searchQuery.toLowerCase()
    return chains.filter((chain) => chain.name.toLowerCase().includes(query) || chain.id.toLowerCase().includes(query))
  }, [chains, searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background hover:bg-muted/50 transition-colors", className)}
        >
          {selectedChainData ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedChainData.logo || "/placeholder.svg"}
                alt={selectedChainData.name}
                className="h-5 w-5 rounded-full"
              />
              <span className="font-medium">{selectedChainData.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b border-border px-3">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search chains..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {filteredChains.map((chain) => (
                <CommandItem
                  key={chain.id}
                  value={chain.id}
                  onSelect={() => {
                    onSelectChain(chain.id)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img src={chain.logo || "/placeholder.svg"} alt={chain.name} className="h-6 w-6 rounded-full" />
                    <div className="flex flex-col">
                      <span className="font-medium">{chain.name}</span>
                    </div>
                  </div>
                  <CheckIcon className={cn("ml-auto h-4 w-4", selectedChain === chain.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
