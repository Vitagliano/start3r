"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Code2, Blocks, Rocket, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

export function HomePage() {
  const features = [
    {
      name: "Production Ready",
      description: "Battle-tested components used in real web3 applications",
      icon: CheckCircle2,
    },
    {
      name: "Lightning Fast",
      description: "Optimized for performance with Next.js 16 and React 19",
      icon: Zap,
    },
    {
      name: "Fully Typed",
      description: "Complete TypeScript coverage for better developer experience",
      icon: Code2,
    },
    {
      name: "Modular Design",
      description: "Mix and match components to build exactly what you need",
      icon: Blocks,
    },
    {
      name: "Mobile First",
      description: "Responsive design that works beautifully on any device",
      icon: Sparkles,
    },
    {
      name: "Easy Integration",
      description: "Drop into any Next.js project and start building immediately",
      icon: Rocket,
    },
  ]

  const stats = [
    { value: "10+", label: "Components" },
    { value: "100%", label: "Type Safe" },
    { value: "0", label: "Dependencies" },
  ]

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <div className="space-y-6 md:space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium text-primary">Web3 Development Kit</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Ship Web3 Apps
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              10x Faster
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl md:text-2xl">
            Start3r is the ultimate boilerplate for building modern web3 applications. Stop reinventing the wheel and
            start shipping features.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="gap-2 text-base" asChild>
            <Link href="/portfolio">
              Explore Components
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to build web3</h2>
          <p className="text-lg text-muted-foreground">From token swaps to NFT galleries, we've got you covered</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.name}
                className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Tech Stack Section */}
      

      {/* CTA Section */}
      
    </div>
  )
}
