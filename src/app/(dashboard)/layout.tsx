"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="mx-auto max-w-7xl p-4 pt-20 sm:p-6 md:p-8 lg:p-10 lg:pt-10">{children}</div>
      </main>
    </div>
  )
}
