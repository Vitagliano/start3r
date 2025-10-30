"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface QuoteRefreshProps {
  countdown: number
  onCountdownChange: (value: number) => void
  onRefresh: () => void
  isRefreshing?: boolean
  enabled?: boolean
}

export function QuoteRefresh({
  countdown,
  onCountdownChange,
  onRefresh,
  isRefreshing = false,
  enabled = true,
}: QuoteRefreshProps) {
  useEffect(() => {
    if (enabled && !isRefreshing && countdown > 0) {
      const timer = setInterval(() => {
        onCountdownChange(countdown - 1)
        if (countdown <= 1) {
          onRefresh()
          onCountdownChange(30)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [enabled, isRefreshing, countdown, onCountdownChange, onRefresh])

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{countdown}s</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          onRefresh()
          onCountdownChange(30)
        }}
        disabled={isRefreshing}
        className="h-6 w-6"
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
