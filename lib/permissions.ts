import type { User } from "./auth"

export type Permission = "chat:access" | "jobs:view" | "jobs:execute" | "users:manage" | "system:admin"

export type Role = "owner" | "worker"

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ["chat:access", "jobs:view", "jobs:execute", "users:manage", "system:admin"],
  worker: ["chat:access", "jobs:view"],
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false

  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return userPermissions.includes(permission)
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.every((permission) => hasPermission(user, permission))
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false

  // Define route permissions
  const routePermissions: Record<string, Permission[]> = {
    "/chat": ["chat:access"],
    "/jobs": ["jobs:view"],
    "/dashboard": [], // All authenticated users can access dashboard
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // No specific permissions required

  return hasAllPermissions(user, requiredPermissions)
}

export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    owner: "Propietario",
    worker: "Trabajador",
  }
  return roleNames[role] || role
}

export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    owner: "Acceso completo a todas las funciones del sistema",
    worker: "Acceso limitado a chat y visualización de trabajos",
  }
  return descriptions[role] || ""
}
