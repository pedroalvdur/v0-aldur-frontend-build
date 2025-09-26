"use client"

import { useAuth } from "@/contexts/auth-context"
import { hasPermission, hasAnyPermission, hasAllPermissions, type Permission, canAccessRoute } from "@/lib/permissions"

export function usePermissions() {
  const { user, isOwner, isWorker } = useAuth()

  return {
    user,
    isOwner,
    isWorker,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    canAccessRoute: (route: string) => canAccessRoute(user, route),

    // Convenience methods for common permissions
    canChat: () => hasPermission(user, "chat:access"),
    canViewJobs: () => hasPermission(user, "jobs:view"),
    canExecuteJobs: () => hasPermission(user, "jobs:execute"),
    canManageUsers: () => hasPermission(user, "users:manage"),
    canAdminSystem: () => hasPermission(user, "system:admin"),
  }
}
