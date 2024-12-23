import { useBalance as useWagmiBalance } from "wagmi";
import { Address } from "viem";
import { useMemo } from "react";
import { web3Config } from "@/components/providers/web3";

export function useNativeBalance(address: Address) {
  const { data, isError, isLoading } = useWagmiBalance({
    config: web3Config,
    address,
  });

  return useMemo(
    () => ({
      balance: data?.value,
      symbol: data?.symbol,
      isError,
      isLoading,
    }),
    [data, isError, isLoading]
  );
}

export function useERC20Balance(address: Address, tokenAddress: Address) {
  const { data, isError, isLoading } = useWagmiBalance({
    config: web3Config,
    address,
    token: tokenAddress,
  });

  return useMemo(
    () => ({
      balance: data?.value,
      symbol: data?.symbol,
      isError,
      isLoading,
    }),
    [data, isError, isLoading]
  );
}
