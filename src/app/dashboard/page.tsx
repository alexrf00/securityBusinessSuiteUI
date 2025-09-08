"use client"
import { DashboardContent } from "@/components/dashboardContent/DashboardContent";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useState } from "react";

export default function DashboardPage() {
    const [activeView, setActiveView] = useState("dashboard")
    const handleSidebarItemClick = (item: string) => {
      setActiveView(item)
    }
        return (
        <div className="flex h-screen bg-background">
            <Sidebar onItemClick={handleSidebarItemClick} />
            <DashboardContent activeView={activeView}/>
        </div>
      )
}