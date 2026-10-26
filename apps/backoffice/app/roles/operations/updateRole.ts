import { RoleRecord, PermissionCode } from "../constants"

export interface UpdateRolePayload {
  role_name?: string
  description?: string | null
  permissions?: string[]
  routes?: string[]
}

export async function updateRole(
  id: string,
  payload: UpdateRolePayload
): Promise<{ role?: RoleRecord; error?: string }> {
  try {
    const res = await fetch(`/api/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { error: data.message || "Failed to update role." }
    }

    return { role: data.role }
  } catch (err: any) {
    return { error: err.message || "Network error while updating role." }
  }
}
