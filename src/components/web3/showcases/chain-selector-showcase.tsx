"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChainSelector } from "@/components/web3/chain-selector";
import { chains } from "@/lib/chain-data";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function ChainSelectorShowcase() {
  const [selectedChain, setSelectedChain] = useState("ethereum");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chain Selector Component</CardTitle>
          <CardDescription>
            A reusable blockchain network selector with search functionality and
            chain logos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Basic Usage</Label>
              <ChainSelector
                chains={chains}
                selectedChain={selectedChain}
                onSelectChain={setSelectedChain}
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Selected Chain:{" "}
                <Badge variant="secondary">{selectedChain}</Badge>
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time search filtering by chain name</li>
              <li>• Chain logos and network display</li>
              <li>• Keyboard navigation support</li>
              <li>• Responsive popover design</li>
              <li>• Supports all major blockchain networks</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { ChainSelector } from "@/components/web3/chain-selector"

const [selectedChain, setSelectedChain] = useState("ethereum")

<ChainSelector 
  chains={chains} 
  selectedChain={selectedChain} 
  onSelectChain={setSelectedChain} 
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
