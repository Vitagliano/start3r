"use client";

import { cn } from "@/lib/utils";
import {
  Wallet,
  ImageIcon,
  Shield,
  ArrowLeftRight,
  Badge as Bridge,
  Menu,
  Layers,
  Box,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaperPlaneIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ConnectButton } from "@/components/connect-button";

const navigationCategories = [
  {
    label: "Components",
    items: [
      { id: "portfolio", label: "Portfolio", icon: Wallet, href: "/portfolio" },
      { id: "nfts", label: "NFTs", icon: ImageIcon, href: "/nfts" },
      { id: "transfer", label: "Transfer", icon: Send, href: "/transfer" },
      { id: "approvals", label: "Approvals", icon: Shield, href: "/approvals" },
      { id: "swap", label: "Swap", icon: ArrowLeftRight, href: "/swap" },
      { id: "bridge", label: "Bridge", icon: Bridge, href: "/bridge" },
      { id: "mint", label: "Mint NFT", icon: ImageIcon, href: "/mint" },
    ],
  },
  {
    label: "Base Components",
    items: [
          {
            id: "connect-button",
            label: "Connect Button",
            icon: Wallet,
            href: "/connect-button",
          },
      {
        id: "token-selector",
        label: "Token Selector",
        icon: Layers,
        href: "/token-selector",
      },
      {
        id: "chain-selector",
        label: "Chain Selector",
        icon: Box,
        href: "/chain-selector",
      },
      {
        id: "balance-quick-select",
        label: "Balance Quick Select",
        icon: Wallet,
        href: "/balance-quick-select",
      },
      {
        id: "slippage-settings",
        label: "Slippage Settings",
        icon: Shield,
        href: "/slippage-settings",
      },
    ],
  },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? (
          <Cross2Icon className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0 h-dvh max-h-dvh overflow-hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        <Link
          href="/"
          className="flex h-16 items-center border-b border-sidebar-border px-6 hover:bg-sidebar-accent/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                S3
              </span>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              Start3r
            </span>
          </div>
        </Link>

        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {navigationCategories.map((category) => (
            <div key={category.label} className="space-y-1">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category.label}
              </h3>
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-3 text-sidebar-foreground transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}>
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto sticky bottom-0 border-t border-sidebar-border bg-sidebar p-4">
          <ConnectButton />
        </div>
      </aside>
    </>
  );
}
