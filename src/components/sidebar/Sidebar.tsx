"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
}

const sidebarItems: SidebarItem[] = [
  // { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  // { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "customers", label: "Clientes", icon: Users, href: "/customers" },
  // { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
  // { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
  // { id: "messages", label: "Messages", icon: MessageSquare, href: "/messages", badge: 3 },
  // { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications", badge: 12 },
  // { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

interface SidebarProps {
  className?: string
  defaultCollapsed?: boolean
  onItemClick?: (itemId: string) => void
}

export function Sidebar({ className, defaultCollapsed = false, onItemClick }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    onItemClick?.(itemId)
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="text-sidebar-foreground font-semibold text-lg">Dashboard</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors duration-200 text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-full flex justify-center items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="font-medium text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto px-2 py-0.5 text-xs rounded-full font-medium",
                        isActive
                          ? "bg-sidebar-primary-foreground text-sidebar-primary"
                          : "bg-sidebar-primary text-sidebar-primary-foreground",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-foreground text-sidebar text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn("flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50", isCollapsed && "justify-center")}
        >
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-primary-foreground font-medium text-sm">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground font-medium text-sm truncate">John Doe</p>
              <p className="text-sidebar-foreground/70 text-xs truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
