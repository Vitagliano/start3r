import { env } from "@/env";
import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Start3r",
  author: "Vitagliano",
  description: "Easily bootstrap your next web3 application.",
  keywords: [
    "web3",
    "crypto",
    "nft",
    "boilerplate",
    "nextjs",
    "tailwindcss",
    "shadcn",
    "viem",
    "wagmi",
    "avalanche",
    "privy",
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://vitagliano.me",
  },
  links: {
    twitter: "https://x.com/gabrielrvita",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
};
