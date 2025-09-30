export type Permission = "chat:access" | "jobs:view" | "jobs:execute" | "users:manage" | "system:admin"

export type Role = "admin" | "user"

export interface MinimalUser {
  role?: Role
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["chat:access", "jobs:view", "jobs:execute", "users:manage", "system:admin"],
  user: ["chat:access"],
}

export function hasPermission(user: MinimalUser | null, permission: Permission): boolean {
  if (!user) return false

  const resolvedRole = user.role || "user"
  const userPermissions = ROLE_PERMISSIONS[resolvedRole] || []
  return userPermissions.includes(permission)
}

export function hasAnyPermission(user: MinimalUser | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(user: MinimalUser | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.every((permission) => hasPermission(user, permission))
}

export function canAccessRoute(user: MinimalUser | null, route: string): boolean {
  if (!user) return false

  // Define route permissions
  const routePermissions: Record<string, Permission[]> = {
    "/chat": ["chat:access"],
    "/jobs": ["jobs:view"], // Only admin has jobs:view in current mapping
    "/dashboard": [],
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // No specific permissions required

  return hasAllPermissions(user, requiredPermissions)
}

export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    admin: "Admin",
    user: "User",
  }
  return roleNames[role] || (role as string)
}

export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    admin: "Acceso completo a todas las funciones del sistema",
    user: "Acceso a chat",
  }
  return descriptions[role] || ""
}
