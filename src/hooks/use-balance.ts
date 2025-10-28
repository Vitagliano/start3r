import { Address } from "viem";
import { useMemo, useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";

export function useNativeBalance(address: Address) {
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !wallets || wallets.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);
        
        // Use Privy's wallet to get balance
        const wallet = wallets[0];
        const balance = await wallet.getBalance();
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching native balance:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, wallets]);

  return useMemo(
    () => ({
      balance,
      symbol: 'AVAX', // Avalanche native token
      isError,
      isLoading,
    }),
    [balance, isError, isLoading]
  );
}

export function useERC20Balance(address: Address, tokenAddress: Address) {
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [symbol, setSymbol] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !wallets || wallets.length === 0 || !tokenAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);
        
        // Use Privy's wallet to get ERC20 balance
        const wallet = wallets[0];
        
        // ERC20 balance reading requires contract interaction
        // For now, we'll return a placeholder
        // In a real implementation, you'd use the wallet's provider to read contract state
        setBalance(BigInt(0));
        setSymbol('TOKEN');
      } catch (error) {
        console.error('Error fetching ERC20 balance:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, wallets, tokenAddress]);

  return useMemo(
    () => ({
      balance,
      symbol,
      isError,
      isLoading,
    }),
    [balance, symbol, isError, isLoading]
  );
}
