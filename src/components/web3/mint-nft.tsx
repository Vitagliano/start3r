"use client";

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Wallet,
  Zap,
  Shield,
  ImageIcon,
  Share2,
  Info,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BalanceQuickSelect } from "./balance-quick-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

type SalePhase =
  | "not-started"
  | "allowlist"
  | "public"
  | "paused"
  | "sold-out"
  | "ended";
type MintStatus =
  | "idle"
  | "approving"
  | "minting"
  | "confirming"
  | "success"
  | "error";

interface MintNFTProps {
  // Collection data
  collectionName: string;
  collectionSymbol: string;
  description: string;
  contractAddress: string;
  creatorName: string;
  creatorAvatar: string;
  price: number;
  totalSupply: number;
  minted: number;
  userMinted: number;
  maxPerWallet: number;
  maxPerTx: number;
  salePhase: SalePhase;
  isVerified: boolean;

  // Optional wallet overrides (for testing/development)
  balance?: number;
  wrongNetwork?: boolean;
  needsApproval?: boolean;
  isApproved?: boolean;
}

export function MintNFT({
  collectionName,
  collectionSymbol,
  description,
  contractAddress,
  creatorName,
  creatorAvatar,
  price,
  totalSupply,
  minted,
  userMinted,
  maxPerWallet,
  maxPerTx,
  salePhase,
  isVerified,
  balance: overrideBalance,
  wrongNetwork: overrideWrongNetwork,
  needsApproval = false,
  isApproved = false,
}: MintNFTProps) {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const isConnected = authenticated && ready;
  const walletAddress = wallets && wallets.length > 0 ? wallets[0].address : "";
  const balance = overrideBalance ?? 2.5; // Default balance for demo, can be overridden
  const wrongNetwork = overrideWrongNetwork ?? false;
  const [quantity, setQuantity] = useState(1);
  const [mintStatus, setMintStatus] = useState<MintStatus>("idle");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gasPriority, setGasPriority] = useState(1); // 0: Eco, 1: Standard, 2: Fast
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintedTokenIds, setMintedTokenIds] = useState<number[]>([]);
  const [txHash, setTxHash] = useState("");
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds

  // Countdown timer
  useEffect(() => {
    if (salePhase === "not-started" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, salePhase]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const remaining = totalSupply - minted;
  const percentMinted = (minted / totalSupply) * 100;
  const totalCost = price * quantity;
  const estimatedGas = 0.003 * (gasPriority + 1);
  const totalWithGas = totalCost + estimatedGas;
  const canAfford = balance >= totalWithGas;
  const withinWalletLimit = userMinted + quantity <= maxPerWallet;
  const withinTxLimit = quantity <= maxPerTx;

  const getSaleStatusBadge = () => {
    const variants: Record<
      SalePhase,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      "not-started": { label: "Not Started", variant: "secondary" },
      allowlist: { label: "Allowlist Live", variant: "default" },
      public: { label: "Public Sale Live", variant: "default" },
      paused: { label: "Paused", variant: "outline" },
      "sold-out": { label: "Sold Out", variant: "destructive" },
      ended: { label: "Ended", variant: "secondary" },
    };
    const status = variants[salePhase];
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const canMint = () => {
    if (!isConnected) return { can: false, reason: "Connect wallet to mint" };
    if (wrongNetwork)
      return { can: false, reason: "Switch to Ethereum Mainnet" };
    if (salePhase === "not-started")
      return { can: false, reason: "Sale hasn't started yet" };
    if (salePhase === "paused")
      return { can: false, reason: "Minting is paused" };
    if (salePhase === "sold-out")
      return { can: false, reason: "Collection sold out" };
    if (salePhase === "ended") return { can: false, reason: "Sale has ended" };
    if (!canAfford) return { can: false, reason: "Insufficient funds" };
    if (!withinWalletLimit)
      return {
        can: false,
        reason: `Wallet limit reached (${maxPerWallet} max)`,
      };
    if (!withinTxLimit)
      return {
        can: false,
        reason: `Transaction limit exceeded (${maxPerTx} max)`,
      };
    if (needsApproval && !isApproved)
      return { can: false, reason: "Approve tokens first" };
    return { can: true, reason: "" };
  };

  const mintCheck = canMint();

  const handleApprove = async () => {
    setMintStatus("approving");
    // Simulate approval
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMintStatus("idle");
  };

  const handleMint = async () => {
    setMintStatus("minting");

    // Simulate minting transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMintStatus("confirming");

    // Simulate confirmation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock token IDs
    const tokenIds = Array.from({ length: quantity }, (_, i) => minted + i + 1);
    setMintedTokenIds(tokenIds);
    setTxHash(
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    );
    setMintStatus("success");
    setShowSuccess(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusStep = () => {
    switch (mintStatus) {
      case "approving":
        return 1;
      case "minting":
        return 2;
      case "confirming":
        return 3;
      case "success":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Left Column - Preview */}
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              {/* Collection Preview */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src="/cool-cat-nft.jpg"
                  alt={collectionName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {isVerified && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {getSaleStatusBadge()}
                  </div>
                </div>
              </div>

              {/* Collection Info */}
              <div className="mt-4 space-y-3">
                <div>
                  <h2 className="text-xl font-bold md:text-2xl">
                    {collectionName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {collectionSymbol}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>

                {/* Creator Info */}
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <img
                    src={creatorAvatar || "/placeholder.svg"}
                    alt={creatorName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Created by</p>
                    <p className="text-sm text-muted-foreground">
                      {creatorName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        window.open("https://twitter.com/coolcatsnft", "_blank")
                      }>
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        window.open("https://coolcatsnft.com", "_blank")
                      }>
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Shield className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <code className="flex-1 truncate text-xs">
                    {contractAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => copyToClipboard(contractAddress)}>
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Mint Interface */}
        <div className="space-y-4 md:space-y-6">
          {/* Wallet Connection */}
          {!isConnected ? (
            <Card>
              <CardContent className="p-4 md:p-6">
                <Button className="w-full" size="lg">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : wrongNetwork ? (
            <Card className="border-destructive">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-destructive" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">Wrong Network</p>
                    <p className="text-sm text-muted-foreground">
                      Please switch to Ethereum Mainnet
                    </p>
                  </div>
                  <Button size="sm" className="flex-shrink-0">
                    Switch Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Supply & Countdown */}
          <Card>
            <CardContent className="space-y-4 p-4 md:p-6">
              {/* Supply Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minted</span>
                  <span className="font-medium">
                    {minted.toLocaleString()} / {totalSupply.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentMinted} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{remaining.toLocaleString()} remaining</span>
                  <span>{percentMinted.toFixed(1)}% minted</span>
                </div>
              </div>

              {/* Countdown */}
              {salePhase === "not-started" && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sale starts in</p>
                    <p className="text-lg font-bold text-primary">
                      {formatTime(countdown)}
                    </p>
                  </div>
                </div>
              )}

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">You minted</p>
                  <p className="text-lg font-bold">{userMinted}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Wallet limit</p>
                  <p className="text-lg font-bold">{maxPerWallet}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mint Form */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Mint NFT</CardTitle>
              <CardDescription>
                Select quantity and mint your NFTs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:space-y-6 md:p-6 md:py-0">
              {/* Price */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    Price per NFT
                  </span>
                  <div className="text-right">
                    <p className="text-xl font-bold md:text-2xl">{price} ETH</p>
                    <p className="text-sm text-muted-foreground">
                      ≈ ${(price * 3500).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Quantity</Label>
                  <span className="text-xs text-muted-foreground md:text-sm">
                    Max {maxPerTx} per transaction
                  </span>
                </div>
                <Input
                  type="number"
                  min={1}
                  max={maxPerTx}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        maxPerTx,
                        Math.max(1, Number.parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="text-center text-lg font-semibold"
                />
                <BalanceQuickSelect
                  balance={String(maxPerTx)}
                  onAmountSelect={(amount) =>
                    setQuantity(Math.floor(Number(amount)))
                  }
                />
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({quantity} NFTs)
                  </span>
                  <span className="font-medium">
                    {totalCost.toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated gas</span>
                  <span className="font-medium">
                    {estimatedGas.toFixed(4)} ETH
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <div className="text-right">
                    <p className="text-lg font-bold md:text-xl">
                      {totalWithGas.toFixed(4)} ETH
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ≈ ${(totalWithGas * 3500).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <span className="text-sm text-muted-foreground">
                  Your balance
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    !canAfford && "text-destructive"
                  )}>
                  {balance.toFixed(4)} ETH
                </span>
              </div>

              {/* Advanced Settings */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="text-sm">Advanced Settings</span>
                    {showAdvanced ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Gas Priority</Label>
                      <span className="text-sm text-muted-foreground">
                        {["Eco", "Standard", "Fast"][gasPriority]}
                      </span>
                    </div>
                    <Slider
                      value={[gasPriority]}
                      onValueChange={([value]) => setGasPriority(value)}
                      min={0}
                      max={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Mint Status */}
              {mintStatus !== "idle" && mintStatus !== "success" && (
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <ReloadIcon className="h-5 w-5 flex-shrink-0 animate-spin text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {mintStatus === "approving" && "Approving tokens..."}
                        {mintStatus === "minting" && "Minting NFTs..."}
                        {mintStatus === "confirming" &&
                          "Confirming transaction..."}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please wait, do not close this window
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          step <= getStatusStep() ? "bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {needsApproval && !isApproved && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleApprove}
                    disabled={mintStatus === "approving"}>
                    {mintStatus === "approving" ? (
                      <>
                        <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Approve Tokens
                      </>
                    )}
                  </Button>
                )}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleMint}
                  disabled={!mintCheck.can || mintStatus !== "idle"}>
                  {mintStatus === "minting" || mintStatus === "confirming" ? (
                    <>
                      <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      {mintCheck.can
                        ? `Mint ${quantity} NFT${quantity > 1 ? "s" : ""}`
                        : mintCheck.reason}
                    </>
                  )}
                </Button>
              </div>

              {/* Helper Text */}
              {!mintCheck.can && (
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                  <Info className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {mintCheck.reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl md:text-2xl">
              Mint Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              You've successfully minted {quantity} NFT{quantity > 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Minted NFTs Preview */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {mintedTokenIds.map((tokenId) => (
                <div
                  key={tokenId}
                  className="aspect-square overflow-hidden rounded-lg border border-border">
                  <img
                    src={`/cool-cat-.jpg?height=100&width=100&query=cool+cat+${tokenId}`}
                    alt={`Token #${tokenId}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Token IDs */}
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Token IDs</p>
              <p className="text-sm text-muted-foreground">
                {mintedTokenIds.join(", ")}
              </p>
            </div>

            {/* Transaction Hash */}
            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              <code className="flex-1 truncate text-xs">{txHash}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => copyToClipboard(txHash)}>
                <CopyIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ImageIcon className="h-4 w-4" />
                View NFTs
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <Button className="w-full" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
