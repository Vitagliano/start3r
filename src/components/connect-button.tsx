"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const ConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  // Wait for Privy to be ready
  if (!ready) {
    return (
      <div
        aria-hidden={true}
        style={{
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Button disabled>Loading...</Button>
      </div>
    );
  }

  // If not authenticated, show login button
  if (!authenticated) {
    return (
      <Button onClick={login} type="button">
        Connect Wallet
      </Button>
    );
  }

  // Get the first wallet (assuming user has at least one)
  const wallet = wallets && wallets.length > 0 ? wallets[0] : null;
  if (!wallet) {
    return (
      <Button variant="destructive" type="button">
        No wallet found
      </Button>
    );
  }

  const account = {
    address: wallet.address,
    displayName: user?.wallet?.address 
      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      : wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4)
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 flex items-center justify-center">
                <Jazzicon
                  seed={jsNumberForAddress(account.address)}
                />
              </div>
              <span>{account.displayName}</span>
            </div>
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Connected Address</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Create NFT</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuItem>
            <span>AVAX</span>
            <span className="ml-auto">0</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Wrapped AVAX</span>
            <span className="ml-auto">0</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
