"use client"

import { useAuth } from "@/contexts/auth-context"
import { hasPermission, hasAnyPermission, type Permission } from "@/lib/permissions"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
  roles?: ("owner" | "worker")[]
}

export function RoleGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  roles = [],
}: RoleGuardProps) {
  const { user } = useAuth()

  // Check role-based access
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check single permission
  if (permission && !hasPermission(user, permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? permissions.every((p) => hasPermission(user, p))
      : hasAnyPermission(user, permissions)

    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function OwnerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard roles={["owner"]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function WorkerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard roles={["worker"]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function RequirePermission({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}) {
  return (
    <RoleGuard permission={permission} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
