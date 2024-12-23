import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseBalanceParameters, useBalance, useBlockNumber } from "wagmi";
import { avalancheFuji } from "viem/chains";

/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
export function useWatchBalance(useBalanceParameters: UseBalanceParameters) {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: avalancheFuji.id,
  });
  const { queryKey, ...restUseBalanceReturn } =
    useBalance(useBalanceParameters);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return restUseBalanceReturn;
}
