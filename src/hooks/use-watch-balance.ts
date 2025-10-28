import { useEffect, useState } from "react";
import { Address } from "viem";
import { useWallets } from "@privy-io/react-auth";

interface UseBalanceParameters {
  address: Address;
  token?: Address;
}

/**
 * Wrapper around Privy's wallet balance functionality. Updates data periodically.
 */
export function useWatchBalance(useBalanceParameters: UseBalanceParameters) {
  const { wallets } = useWallets();
  const [data, setData] = useState<{
    value: bigint | null;
    symbol: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!useBalanceParameters.address || !wallets || wallets.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);
        
        const wallet = wallets[0];
        
        if (useBalanceParameters.token) {
          // ERC20 token balance
          // For now, return placeholder data
          setData({
            value: BigInt(0),
            symbol: 'TOKEN'
          });
        } else {
          // Native balance
          const balance = await wallet.getBalance();
          setData({
            value: balance,
            symbol: 'AVAX'
          });
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [useBalanceParameters.address, useBalanceParameters.token, wallets]);

  return {
    data,
    isLoading,
    isError
  };
}
