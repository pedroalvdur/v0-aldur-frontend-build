"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageSquare, Settings, LogOut, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { canViewJobs } = usePermissions()
  const { logout } = useAuth()

  const navigation = [
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
      current: pathname === "/chat",
      show: true,
    },
    {
      name: "Trabajos",
      href: "/jobs",
      icon: Settings,
      current: pathname === "/jobs",
      show: canViewJobs(),
    },
  ]

  return (
    <div className="flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo/Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Aldur</h2>
            <p className="text-sm text-sidebar-foreground/70">Operaciones</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" className="md:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.filter((n) => n.show).map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  item.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={async () => {
            await logout()
            onClose?.()
          }}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
