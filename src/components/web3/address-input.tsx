"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { MagnifyingGlassIcon, ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons"

interface AddressInputProps {
  onAddressSubmit: (address: string) => void
  isLoading: boolean
  currentAddress: string | null
}

const EXAMPLE_ADDRESSES = [
  { label: "vitalik.eth", address: "vitalik.eth", type: "ENS" },
  { label: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", type: "Contract" },
  { label: "USDC Treasury", address: "0x55FE002aefF02F77364de339a1292923A15844B8", type: "Treasury" },
  { label: "Example Wallet", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", type: "Wallet" },
]

export function AddressInput({ onAddressSubmit, isLoading, currentAddress }: AddressInputProps) {
  const [address, setAddress] = useState("")
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")

  const validateAddress = (addr: string) => {
    // Ethereum address validation (0x + 40 hex characters)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    // ENS name validation (basic)
    const ensRegex = /^[a-z0-9-]+\.eth$/

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
      onAddressSubmit(address)
    }
  }

  const handleExampleClick = (exampleAddress: string) => {
    setAddress(exampleAddress)
    validateAddress(exampleAddress)
    onAddressSubmit(exampleAddress)
  }

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
            {EXAMPLE_ADDRESSES.map((example) => (
              <Badge
                key={example.address}
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleExampleClick(example.address)}
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
              <div className="font-mono text-sm font-medium">{currentAddress}</div>
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
