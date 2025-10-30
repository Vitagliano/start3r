"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowDownUp, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TokenSelector } from "./token-selector"
import { BalanceQuickSelect } from "./balance-quick-select"
import { SlippageSettings } from "./slippage-settings"
import { QuoteRefresh } from "./quote-refresh"
import { UsdValueDisplay } from "./usd-value-display"
import { AVAILABLE_TOKENS } from "@/lib/token-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function SwapComponent() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [slippage, setSlippage] = useState("0.5")
  const [customSlippage, setCustomSlippage] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [refreshCountdown, setRefreshCountdown] = useState(30)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const priceImpact = 0.12
  const exchangeRate = 3500
  const gasFee = 0.0023
  const liquidityProviderFee = 0.003
  const protocolFee = 0.0001

  const fromTokenData = AVAILABLE_TOKENS.find((t) => t.symbol === fromToken)
  const toTokenData = AVAILABLE_TOKENS.find((t) => t.symbol === toToken)

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const calculateToAmount = (amount: string) => {
    const value = Number.parseFloat(amount)
    if (!isNaN(value)) {
      setToAmount((value * exchangeRate).toFixed(2))
    } else {
      setToAmount("")
    }
  }

  const handleRefreshQuote = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      calculateToAmount(fromAmount)
      setIsRefreshing(false)
    }, 500)
  }

  const minReceived = toAmount
    ? (Number.parseFloat(toAmount) * (1 - Number.parseFloat(slippage) / 100)).toFixed(2)
    : "0"

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>Exchange tokens at the best rates</CardDescription>
            </div>
            <SlippageSettings
              slippage={slippage}
              onSlippageChange={setSlippage}
              customSlippage={customSlippage}
              onCustomSlippageChange={setCustomSlippage}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              {/* From Token Section */}
              <div className="w-full space-y-2">
                <Label>From</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => {
                      setFromAmount(e.target.value)
                      calculateToAmount(e.target.value)
                    }}
                    className="flex-[2]"
                  />
                  <div className="flex-1">
                    <TokenSelector
                      tokens={AVAILABLE_TOKENS}
                      selectedToken={fromToken}
                      onSelectToken={setFromToken}
                      showBalance={false}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground">
                    Balance: {fromTokenData?.balance || "0"} {fromToken}
                  </span>
                  <BalanceQuickSelect
                    balance={fromTokenData?.balance || "0"}
                    onAmountSelect={(amount) => {
                      setFromAmount(amount)
                      calculateToAmount(amount)
                    }}
                  />
                </div>
                <UsdValueDisplay amount={fromAmount} price={fromTokenData?.price || 0} />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapTokens}
                className="h-10 w-10 rounded-full mt-2 shrink-0 sm:mt-4"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>

              {/* To Token Section */}
              <div className="w-full space-y-2">
                <Label className="self-start">To</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input type="number" placeholder="0.0" value={toAmount} readOnly className="flex-[2]" />
                  <div className="flex-1">
                    <TokenSelector
                      tokens={AVAILABLE_TOKENS}
                      selectedToken={toToken}
                      onSelectToken={setToToken}
                      showBalance={false}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Balance: {toTokenData?.balance || "0"} {toToken}
                </div>
                <UsdValueDisplay amount={toAmount} price={toTokenData?.price || 1} />
              </div>
            </div>
          </div>

          {fromAmount && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quote Details</span>
                <QuoteRefresh
                  countdown={refreshCountdown}
                  onCountdownChange={setRefreshCountdown}
                  onRefresh={handleRefreshQuote}
                  isRefreshing={isRefreshing}
                  enabled={!!fromAmount}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">
                  1 {fromToken} = {exchangeRate.toLocaleString()} {toToken}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minimum Received</span>
                <span className="font-medium">
                  {minReceived} {toToken}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span
                  className={`font-medium ${priceImpact > 1 ? "text-destructive" : priceImpact > 0.5 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {priceImpact}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="font-medium">{slippage}%</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">LP Fee</span>
                  <span className="font-medium">{liquidityProviderFee} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Protocol Fee</span>
                  <span className="font-medium">{protocolFee} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-medium">~{gasFee} ETH</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Uniswap V3
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    0.3% Pool
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {priceImpact > 1 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High price impact detected ({priceImpact}%). Consider reducing your swap amount or splitting into
                multiple trades.
              </AlertDescription>
            </Alert>
          )}

          {priceImpact > 0.5 && priceImpact <= 1 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Moderate price impact ({priceImpact}%). Your trade may affect the market price.
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!fromAmount || !toAmount}
            onClick={() => setShowReviewModal(true)}
          >
            Review Swap
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Swap</DialogTitle>
            <DialogDescription>Please review your swap details before confirming</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You pay</span>
                <div className="text-right">
                  <div className="font-medium">
                    {fromAmount} {fromToken}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ${(Number.parseFloat(fromAmount || "0") * (fromTokenData?.price || 0)).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You receive</span>
                <div className="text-right">
                  <div className="font-medium">
                    {toAmount} {toToken}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ${(Number.parseFloat(toAmount || "0") * (toTokenData?.price || 1)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span>
                  1 {fromToken} = {exchangeRate.toLocaleString()} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum received</span>
                <span>
                  {minReceived} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price impact</span>
                <span className={priceImpact > 1 ? "text-destructive" : "text-green-500"}>{priceImpact}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total fees</span>
                <span>~{(gasFee + liquidityProviderFee + protocolFee).toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span>Uniswap V3</span>
              </div>
            </div>

            {priceImpact > 1 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  High price impact! You may lose a significant portion of your funds.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button className="w-full" size="lg" onClick={() => setShowReviewModal(false)}>
              Confirm Swap
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
