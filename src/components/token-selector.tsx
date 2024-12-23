"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Address, formatEther } from "viem";
import { useWatchBalance } from "@/hooks/use-watch-balance";
import { useAccount } from "wagmi";

interface Token {
  id: string;
  name: string;
  symbol: string;
  address: Address;
  logo: string;
}

const tokens: Token[] = [
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    address: "0x0000000000000000000000000000000000000000",
    logo: "/tokens/avalanche.svg",
  },
  {
    id: "nochill",
    name: "AVAX HAS NO CHILL",
    symbol: "NOCHILL",
    address: "0xAcFb898Cff266E53278cC0124fC2C7C94C8cB9a5",
    logo: "/tokens/nochill.webp",
  },
  {
    id: "swol",
    name: "Swol",
    symbol: "SWOL",
    address: "0x245B532ad64c7FBfeEC9aa42f37291b183cEA91b",
    logo: "/tokens/swol.webp",
  },
  {
    id: "numbergo",
    name: "NumberGoUpTech",
    symbol: "TECH",
    address: "0x5Ac04b69bDE6f67C0bd5D6bA6fD5D816548b066a",
    logo: "/tokens/tech.webp",
  },
  {
    id: "kimbo",
    name: "Kimbo",
    symbol: "KIMBO",
    address: "0x184ff13B3EBCB25Be44e860163A5D8391Dd568c1",
    logo: "/tokens/kimbo.webp",
  },
];

export const TokenSelector = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState<Token>(tokens[0]);
  const [search, setSearch] = React.useState("");

  const { address } = useAccount();

  const { data: nativeBalanceData } = useWatchBalance({
    address: address as Address,
  });

  const { data: erc20BalanceData } = useWatchBalance({
    address: address as Address,
    token: selectedToken.address as Address,
  });

  const filteredTokens = React.useMemo(() => {
    if (!search) return tokens;
    return tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const nativeBalance = nativeBalanceData?.value;
  const nativeSymbol = nativeBalanceData?.symbol;
  const erc20Balance = erc20BalanceData?.value;
  const erc20Symbol = erc20BalanceData?.symbol;

  const balanceDisplay = React.useMemo(() => {
    const balance =
      selectedToken.address === tokens[0].address
        ? formatEther(nativeBalance || BigInt(0))
        : formatEther(erc20Balance || BigInt(0));

    const symbol =
      selectedToken.address === tokens[0].address
        ? nativeSymbol || ""
        : erc20Symbol || "";

    const formattedBalance = Number(balance).toFixed(2);

    return `${formattedBalance} ${symbol}`;
  }, [
    selectedToken.address,
    nativeBalance,
    nativeSymbol,
    erc20Balance,
    erc20Symbol,
  ]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold tracking-tight">Select Token</h2>
        <span className="text-sm text-gray-500">{balanceDisplay}</span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 rounded-md bg-white border-0 hover:bg-white/90 transition-colors shadow">
            <div className="flex items-center gap-3">
              <img
                src={selectedToken.logo}
                alt={selectedToken.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{selectedToken.name}</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] border-0 bg-white rounded-md shadow"
          align="start"
        >
          <Command className="rounded-md" shouldFilter={false}>
            <div className="px-3 pt-3 pb-2">
              <CommandInput
                placeholder="Search token name or symbol..."
                value={search}
                onValueChange={setSearch}
                className="h-12 px-3 bg-transparent focus:ring-0 border-0 outline-none placeholder:text-gray-400"
              />
            </div>
            <CommandList className="max-h-[280px] overflow-y-auto px-2 pb-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
              <CommandEmpty className="pt-6 pb-4 text-center text-gray-500">
                No tokens found.
              </CommandEmpty>
              <CommandGroup>
                <AnimatePresence initial={false}>
                  {filteredTokens.map((token) => (
                    <motion.div
                      key={token.address}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CommandItem
                        onSelect={() => {
                          setSelectedToken(token);
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 py-4 px-2 cursor-pointer rounded-xl data-[highlighted]:bg-gray-100"
                      >
                        <img
                          src={token.logo}
                          alt={token.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-base">
                            {token.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {token.symbol}
                          </span>
                        </div>
                        {token.address === selectedToken.address && (
                          <div className="ml-auto mr-1">
                            <Check size={16} />
                          </div>
                        )}
                      </CommandItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
