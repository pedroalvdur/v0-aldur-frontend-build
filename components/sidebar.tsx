"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageSquare, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
      current: pathname === "/chat",
    },
    {
      name: "Trabajos",
      href: "/jobs",
      icon: Settings,
      current: pathname === "/jobs",
    },
  ]

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo/Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Aldur</h2>
        <p className="text-sm text-sidebar-foreground/70">Operaciones</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href}>
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
          onClick={() => {
            // TODO: Implement logout
            console.log("Logout clicked")
          }}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
