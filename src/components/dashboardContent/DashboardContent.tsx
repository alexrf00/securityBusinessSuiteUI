"use client"

import { Suspense, lazy } from "react"
import { Loader2 } from "lucide-react"

const CustomerView = lazy(() => import("../views/CustomerView"))

interface DashboardContentProps {
  activeView: string
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Loading...</span>
    </div>
  )
}

export function DashboardContent({ activeView }: DashboardContentProps) {
  const renderView = () => {
    switch (activeView) {
      default:
        return <CustomerView />
    }
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingSpinner />}>{renderView()}</Suspense>
      </div>
    </main>
  )
}
