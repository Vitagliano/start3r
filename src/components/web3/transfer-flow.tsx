"use client";

import { useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookUser, CheckCircle2 } from "lucide-react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useEnsAddress } from "wagmi";

interface AddressBookEntry {
  name: string;
  address: string;
  ens?: string;
}

interface Token {
  symbol: string;
  name: string;
}

interface NFT {
  id: string;
  name: string;
}

interface TransferFlowProps {
  addressBook?: AddressBookEntry[];
  tokens?: Token[];
  nfts?: NFT[];
}

export function TransferFlow({
  addressBook = [],
  tokens = [],
  nfts = [],
}: TransferFlowProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(
    tokens.length > 0 ? tokens[0].symbol : ""
  );
  const isEns = useMemo(
    () => /\.[eE][tT][hH]$/.test(recipient || ""),
    [recipient]
  );
  const { data: resolvedRecipient } = useEnsAddress({
    name: isEns && recipient ? recipient : undefined,
    chainId: 1,
    query: { enabled: isEns && !!recipient },
  });

  const handleAddressBookSelect = (entry: AddressBookEntry) => {
    setRecipient(entry.ens || entry.address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Assets</CardTitle>
        <CardDescription>
          Send tokens or NFTs to another address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="token" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="token">Token Transfer</TabsTrigger>
            <TabsTrigger value="nft">NFT Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="token" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-select">Select Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger id="token-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol} - {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recipient">Recipient Address</Label>
                </div>
                <Input
                  id="recipient"
                  placeholder="0x... or name.eth"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                {resolvedRecipient && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Resolved to {resolvedRecipient}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Quick Select</div>
                <div className="flex flex-wrap gap-2">
                  {addressBook.map((entry) => (
                    <Button
                      key={entry.address}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddressBookSelect(entry)}
                      className="gap-2">
                      {entry.name}
                      {entry.ens && (
                        <Badge variant="secondary">{entry.ens}</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2" size="lg">
                <PaperPlaneIcon className="h-4 w-4" />
                Send {selectedToken}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nft-select">Select NFT</Label>
                <Select>
                  <SelectTrigger id="nft-select">
                    <SelectValue placeholder="Choose an NFT" />
                  </SelectTrigger>
                  <SelectContent>
                    {nfts.map((nft) => (
                      <SelectItem key={nft.id} value={nft.id}>
                        {nft.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nft-recipient">Recipient Address</Label>
                <Input
                  id="nft-recipient"
                  placeholder="0x... or name.eth"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                {resolvedRecipient && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Resolved to {resolvedRecipient}</span>
                  </div>
                )}
              </div>

              <Button className="w-full gap-2" size="lg">
                <PaperPlaneIcon className="h-4 w-4" />
                Transfer NFT
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
