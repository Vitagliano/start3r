import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-center w-full h-full text-white"
        style={{
          background:
            "linear-gradient(to right bottom, rgb(17, 24, 39), rgb(75, 85, 99))",
        }}
      >
        <h1 tw="text-8xl">{siteConfig.name}</h1>
        <h2 tw="text-4xl">{siteConfig.description}</h2>
        <div tw="flex flex-col items-center justify-center mt-8">
          <div tw="text-xl">
            Next.js · Ethereum · Privy · Viem · Avalanche
          </div>
          <div tw="text-xl mt-2">Tailwind · Shadcn UI · and more..</div>
        </div>
      </div>
    )
  );
}
