import { ApprovalsManager } from "@/components/web3/approvals-manager"
import { Card, CardContent } from "@/components/ui/card"

export default function ApprovalsPage() {
  return (
    <>
      <header className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">Approvals Manager</h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">Review and revoke token allowances</p>
      </header>

      <div className="animate-in fade-in duration-300">
        <ApprovalsManager />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• List all ERC-20, ERC-721, and ERC-1155 allowances</li>
              <li>• Filter by token type and spender</li>
              <li>• Risk indicators for suspicious contracts</li>
              <li>• Bulk revoke functionality</li>
              <li>• Last activity timestamps</li>
              <li>• Clear interface with confirmation dialogs</li>
              <li>• Transaction status feedback</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-6">
            <h4 className="font-semibold">Usage Example</h4>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`import { ApprovalsManager } from "@/components/web3/approvals-manager"

<ApprovalsManager />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
