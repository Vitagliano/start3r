"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Zap,
  ArrowLeftRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Wallet,
  RefreshCw,
} from "lucide-react"
import { TokenSelector } from "./token-selector"
import { ChainSelector } from "./chain-selector"
import { BalanceQuickSelect } from "./balance-quick-select"
import { SlippageSettings } from "./slippage-settings"
import { QuoteRefresh } from "./quote-refresh"
import { UsdValueDisplay } from "./usd-value-display"
import { AVAILABLE_TOKENS } from "@/lib/token-data"
import { AVAILABLE_CHAINS } from "@/lib/chain-data"
import { CopyIcon } from "@radix-ui/react-icons"

export function BridgeComponent() {
  const [fromChain, setFromChain] = useState("ethereum")
  const [toChain, setToChain] = useState("polygon")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("ETH")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sameWallet, setSameWallet] = useState(true)
  const [slippage, setSlippage] = useState("0.5")
  const [customSlippage, setCustomSlippage] = useState("")
  const [isApproved, setIsApproved] = useState(false)
  const [refreshCountdown, setRefreshCountdown] = useState(30)
  const [bridgeStatus, setBridgeStatus] = useState<"idle" | "approving" | "bridging" | "completed">("idle")

  const estimatedTimeMin = 3
  const estimatedTimeMax = 5
  const bridgeFee = 0.0015
  const relayerFee = 0.0008
  const sourceGasFee = 0.0023
  const destGasFee = 0.0012
  const priceImpact = 0.12

  const handleSwapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const handleRefreshQuote = () => {
    // Refresh logic
  }

  const selectedTokenData = AVAILABLE_TOKENS.find((t) => t.symbol === selectedToken)
  const totalFees = bridgeFee + relayerFee + sourceGasFee + destGasFee
  const amountReceived = amount ? Math.max(0, Number.parseFloat(amount) - totalFees) : 0
  const minReceived = amountReceived * (1 - Number.parseFloat(slippage) / 100)
  const usdValue = amount ? Number.parseFloat(amount) * (selectedTokenData?.price || 0) : 0
  const usdReceived = amountReceived * (selectedTokenData?.price || 0)

  const showHighFeeWarning = amount && totalFees / Number.parseFloat(amount) > 0.05
  const showPriceImpactWarning = priceImpact > 1

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Bridge Assets</CardTitle>
            <CardDescription>Transfer tokens across different chains</CardDescription>
          </div>
          <SlippageSettings
            slippage={slippage}
            onSlippageChange={setSlippage}
            customSlippage={customSlippage}
            onCustomSlippageChange={setCustomSlippage}
            showAdvancedOptions={true}
            icon="settings2"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="w-full flex-1 space-y-2">
              <Label>From Chain</Label>
              <ChainSelector
                chains={AVAILABLE_CHAINS}
                selectedChain={fromChain}
                onSelectChain={setFromChain}
                placeholder="Select source chain"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapChains}
              className="mt-2 h-8 w-8 shrink-0 rounded-full hover:bg-muted transition-colors sm:mt-8"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="w-full flex-1 space-y-2">
              <Label>To Chain</Label>
              <ChainSelector
                chains={AVAILABLE_CHAINS}
                selectedChain={toChain}
                onSelectChain={setToChain}
                placeholder="Select destination chain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Token & Amount</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-[2]"
              />
              <TokenSelector
                tokens={AVAILABLE_TOKENS}
                selectedToken={selectedToken}
                onSelectToken={setSelectedToken}
                showBalance={false}
                className="flex-1"
              />
            </div>
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">
                Balance: {selectedTokenData?.balance || "0"} {selectedToken}
              </span>
              <BalanceQuickSelect balance={selectedTokenData?.balance || "0"} onAmountSelect={setAmount} />
            </div>
            <UsdValueDisplay amount={amount} price={selectedTokenData?.price || 0} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Recipient Address</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="same-wallet"
                  checked={sameWallet}
                  onCheckedChange={(checked) => setSameWallet(checked as boolean)}
                />
                <label htmlFor="same-wallet" className="text-xs text-muted-foreground cursor-pointer">
                  Same wallet
                </label>
              </div>
            </div>
            {!sameWallet && (
              <Input
                placeholder="0x... or ENS name"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            )}
          </div>
        </div>

        {amount && (
          <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bridge Quote</span>
              <QuoteRefresh
                countdown={refreshCountdown}
                onCountdownChange={setRefreshCountdown}
                onRefresh={handleRefreshQuote}
                enabled={!!amount}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">You will receive</span>
              <div className="text-right">
                <div className="font-semibold">
                  {amountReceived.toFixed(6)} {selectedToken}
                </div>
                <div className="text-xs text-muted-foreground">≈ ${usdReceived.toFixed(2)} USD</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Minimum received</span>
              <span className="font-medium">
                {minReceived.toFixed(6)} {selectedToken}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Bridge Fee</span>
                <span>
                  {bridgeFee} {selectedToken}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Relayer Fee</span>
                <span>
                  {relayerFee} {selectedToken}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Source Gas</span>
                <span>
                  ~{sourceGasFee} {selectedToken}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Destination Gas</span>
                <span>
                  ~{destGasFee} {selectedToken}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Estimated Time
              </span>
              <span className="font-medium">
                {estimatedTimeMin}-{estimatedTimeMax} min
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bridge Provider</span>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Fast Bridge
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="text-xs">Direct • 1 hop</span>
            </div>

            {showPriceImpactWarning && (
              <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 p-2 text-xs text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>High price impact ({priceImpact.toFixed(2)}%). Consider bridging a smaller amount.</span>
              </div>
            )}

            {showHighFeeWarning && (
              <div className="flex items-start gap-2 rounded-md bg-orange-500/10 p-2 text-xs text-orange-600 dark:text-orange-500">
                <Info className="h-3 w-3 mt-0.5 shrink-0" />
                <span>
                  Fees are {((totalFees / Number.parseFloat(amount)) * 100).toFixed(1)}% of transfer amount. Consider
                  bridging a larger amount for better efficiency.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          {!isApproved && amount && (
            <Button
              className="w-full bg-transparent"
              size="lg"
              variant="outline"
              onClick={() => setIsApproved(true)}
              disabled={bridgeStatus === "approving"}
            >
              {bridgeStatus === "approving" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Approve {selectedToken}
                </>
              )}
            </Button>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!amount || !isApproved}
            onClick={() => setBridgeStatus("bridging")}
          >
            {bridgeStatus === "bridging" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Bridging...
              </>
            ) : (
              `Bridge ${selectedToken}`
            )}
          </Button>
        </div>

        {bridgeStatus === "bridging" && (
          <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bridge Status</span>
              <Badge variant="secondary" className="gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                In Progress
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Approved</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Transaction sent</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Waiting for confirmations (2/12)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
                <span>Relaying to destination</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
                <span>Completed</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Source TX</span>
                <Button variant="ghost" size="sm" className="h-6 gap-1 px-2">
                  <span>0x1234...5678</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Message ID</span>
                <Button variant="ghost" size="sm" className="h-6 gap-1 px-2">
                  <span>msg_abc123</span>
                  <CopyIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
