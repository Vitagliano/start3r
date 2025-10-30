"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface Approval {
  id: string
  token: string
  spender: string
  spenderName: string
  amount: string
  type: "ERC20" | "ERC721" | "ERC1155"
  approvedAt: string
  risk: "low" | "medium" | "high"
}

const mockApprovals: Approval[] = [
  {
    id: "1",
    token: "USDC",
    spender: "0x1234...5678",
    spenderName: "Uniswap V3",
    amount: "Unlimited",
    type: "ERC20",
    approvedAt: "2024-01-15",
    risk: "low",
  },
  {
    id: "2",
    token: "ETH",
    spender: "0xabcd...efgh",
    spenderName: "OpenSea",
    amount: "All NFTs",
    type: "ERC721",
    approvedAt: "2024-02-20",
    risk: "medium",
  },
  {
    id: "3",
    token: "DAI",
    spender: "0x9876...5432",
    spenderName: "Unknown Contract",
    amount: "Unlimited",
    type: "ERC20",
    approvedAt: "2023-12-01",
    risk: "high",
  },
  {
    id: "4",
    token: "LINK",
    spender: "0x5555...6666",
    spenderName: "1inch",
    amount: "1000",
    type: "ERC20",
    approvedAt: "2024-03-10",
    risk: "low",
  },
]

export function ApprovalsManager() {
  const [approvals, setApprovals] = useState(mockApprovals)

  const handleRevoke = (id: string) => {
    setApprovals(approvals.filter((approval) => approval.id !== id))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filterByType = (type: string) => {
    if (type === "all") return approvals
    return approvals.filter((approval) => approval.type === type)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Approvals</CardTitle>
        <CardDescription>Manage and revoke token allowances</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Review your approvals regularly. Revoke access from contracts you no longer use.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ERC20">ERC-20</TabsTrigger>
            <TabsTrigger value="ERC721">ERC-721</TabsTrigger>
            <TabsTrigger value="ERC1155">ERC-1155</TabsTrigger>
          </TabsList>

          {["all", "ERC20", "ERC721", "ERC1155"].map((type) => (
            <TabsContent key={type} value={type} className="space-y-3">
              {filterByType(type).map((approval) => (
                <div
                  key={approval.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{approval.token}</span>
                      <Badge variant="outline">{approval.type}</Badge>
                      <Badge variant={getRiskColor(approval.risk)}>{approval.risk} risk</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>
                        Spender: <span className="font-mono">{approval.spenderName}</span>
                      </div>
                      <div>
                        Address: <span className="font-mono">{approval.spender}</span>
                      </div>
                      <div>Amount: {approval.amount}</div>
                      <div>Approved: {approval.approvedAt}</div>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleRevoke(approval.id)} className="gap-2">
                    <XCircle className="h-4 w-4" />
                    Revoke
                  </Button>
                </div>
              ))}
              {filterByType(type).length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No approvals found</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
