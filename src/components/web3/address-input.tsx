"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { MagnifyingGlassIcon, ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useEnsAddress, useAccount } from "wagmi"

interface ExampleAddress {
  label: string
  address: string
  type: string
}

interface AddressInputProps {
  onAddressSubmit: (address: string) => void
  isLoading: boolean
  currentAddress: string | null
  exampleAddresses?: ExampleAddress[]
  showConnectedWalletOption?: boolean
}

const DEFAULT_EXAMPLE_ADDRESSES: ExampleAddress[] = [
  { label: "vitalik.eth", address: "vitalik.eth", type: "ENS" },
  { label: "Null Address", address: "0x0000000000000000000000000000000000000000", type: "Address" },
  { label: "Uniswap", address: "0x1F98431c8aD98523631AE4a59f267346ea31F984", type: "Address" },
]

export function AddressInput({
  onAddressSubmit,
  isLoading,
  currentAddress,
  exampleAddresses = DEFAULT_EXAMPLE_ADDRESSES,
  showConnectedWalletOption = true
}: AddressInputProps) {
  const { address: connectedAddress } = useAccount()
  const [address, setAddress] = useState("")
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")

  const isEns = useMemo(() => /\.[eE][tT][hH]$/.test(currentAddress || ""), [currentAddress])
  const { data: resolvedCurrentAddress } = useEnsAddress({
    name: isEns && currentAddress ? currentAddress : undefined,
    chainId: 1,
    query: { enabled: isEns && !!currentAddress }
  })

  const isInputEns = useMemo(() => /\.[eE][tT][hH]$/.test(address), [address])
  const { data: resolvedInputAddress } = useEnsAddress({
    name: isInputEns && address ? address : undefined,
    chainId: 1,
    query: { enabled: isInputEns && !!address && validationState !== "invalid" }
  })

  const validateAddress = (addr: string) => {
    // Ethereum address validation (0x + 40 hex characters)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    // ENS name validation - allow alphanumeric, hyphens, and underscores, case insensitive
    const ensRegex = /^[a-zA-Z0-9_-]+\.eth$/

    if (ethAddressRegex.test(addr) || ensRegex.test(addr)) {
      setValidationState("valid")
      return true
    } else if (addr.length > 0) {
      setValidationState("invalid")
      return false
    } else {
      setValidationState("idle")
      return false
    }
  }

  const handleInputChange = (value: string) => {
    setAddress(value)
    validateAddress(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validationState === "valid") {
      // If it's an ENS name and we have a resolved address, use the resolved address
      const addressToSubmit = resolvedInputAddress || address
      onAddressSubmit(addressToSubmit)
    }
  }

  const handleExampleClick = (exampleAddress: string) => {
    setAddress(exampleAddress)
    validateAddress(exampleAddress)
    onAddressSubmit(exampleAddress)
  }

  const handleConnectedWalletClick = () => {
    if (connectedAddress) {
      setAddress(connectedAddress)
      validateAddress(connectedAddress)
      onAddressSubmit(connectedAddress)
    }
  }

  // Combine default examples with connected wallet option if available
  const allExampleAddresses = useMemo(() => {
    const examples = [...exampleAddresses]
    if (showConnectedWalletOption && connectedAddress) {
      examples.unshift({
        label: "Connected Wallet",
        address: connectedAddress,
        type: "Wallet"
      })
    }
    return examples
  }, [exampleAddresses, showConnectedWalletOption, connectedAddress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Explore Address</CardTitle>
        <CardDescription>Enter an Ethereum address or ENS name to view portfolio data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="text-sm font-medium">Try these examples:</div>
          <div className="flex flex-wrap gap-2">
            {allExampleAddresses.map((example) => (
              <Badge
                key={example.address}
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => example.type === "Wallet" ? handleConnectedWalletClick() : handleExampleClick(example.address)}
              >
                <span className="font-medium">{example.label}</span>
                <span className="ml-1.5 text-xs opacity-70">({example.type})</span>
              </Badge>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="0x... or name.eth"
              value={address}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-9 pr-10"
              disabled={isLoading}
            />
            {validationState === "valid" && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            )}
            {validationState === "invalid" && (
              <ExclamationTriangleIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
            )}
          </div>

          {validationState === "invalid" && (
            <p className="text-sm text-destructive">Please enter a valid Ethereum address or ENS name</p>
          )}

          {currentAddress && (
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Currently viewing:</div>
              <div className="font-mono text-sm font-medium">
                {currentAddress}
                {isEns && resolvedCurrentAddress ? (
                  <span className="ml-2 text-xs opacity-70">({resolvedCurrentAddress})</span>
                ) : null}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={validationState !== "valid" || isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                Explore Address
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
