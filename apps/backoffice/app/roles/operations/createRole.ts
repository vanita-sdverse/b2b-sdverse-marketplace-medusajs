import { RoleRecord, PermissionCode } from "../constants"

export interface CreateRolePayload {
  role_name: string
  description?: string | null
  permissions?: string[]
  routes?: string[]
}

export async function createRole(payload: CreateRolePayload): Promise<{ role?: RoleRecord; error?: string }> {
  try {
    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { error: data.message || "Failed to create role." }
    }

    return { role: data.role }
  } catch (err: any) {
    return { error: err.message || "Network error while creating role." }
  }
}
