"use client";

import * as React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";

import { env } from "@/env";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const wagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    ssr: true,
  });

  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
      }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
