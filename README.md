# Start3r - Web3 Starter Template

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with Web3 functionality using [Privy](https://privy.io).

## Features

- **Privy Wallet Integration**: Seamless wallet connection with support for embedded wallets and external wallets
- **Avalanche Network Support**: Built for the Avalanche C-Chain and Fuji testnet
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components
- **TypeScript**: Full type safety throughout the application
- **Token Selector**: Interactive token selection with balance display
- **Theme Support**: Dark/light mode with system preference detection

## Getting Started

### Prerequisites

1. Create a Privy account at [https://privy.io](https://privy.io)
2. Create a new app in the Privy Dashboard
3. Get your Privy App ID from the dashboard

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Privy Configuration

The app is configured to work with Privy's wallet system:

- **Embedded Wallets**: Automatically created for users without existing wallets
- **External Wallets**: Support for MetaMask, WalletConnect, and other popular wallets
- **Avalanche Networks**: Configured for both mainnet (43114) and testnet (43113)

### Key Components

- `src/components/providers/web3.tsx` - Privy provider configuration
- `src/components/connect-button.tsx` - Wallet connection button with dropdown
- `src/components/token-selector.tsx` - Token selection with balance display
- `src/hooks/use-balance.ts` - Balance fetching hooks for native and ERC20 tokens
- `src/hooks/use-watch-balance.ts` - Real-time balance monitoring

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Privy Documentation](https://docs.privy.io) - learn about Privy wallet integration
- [Avalanche Documentation](https://docs.avax.network) - learn about the Avalanche network
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com) - re-usable components

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
