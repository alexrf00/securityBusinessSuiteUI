"use client"

import { useAuth } from "@/auth/providers/auth-provider"
import { AuthLayout } from "@/auth/components/auth-layout"
import { useState } from "react"
import { DashboardContent } from "@/components/dashboardContent/DashboardContent"
import { Sidebar } from "@/components/sidebar/Sidebar"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [activeView, setActiveView] = useState("dashboard")
  const handleSidebarItemClick = (item: string) => {
    setActiveView(item)
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthLayout />
  }

  return (
    <div className="flex h-screen bg-background">
        <Sidebar onItemClick={handleSidebarItemClick} />
        <DashboardContent activeView={activeView}/>
    </div>
  )
}
