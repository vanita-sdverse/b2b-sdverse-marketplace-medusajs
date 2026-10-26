export interface AssignRolePayload {
  id_customer: number
  id_role: string
}

export async function assignRole(payload: AssignRolePayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/roles/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { success: false, error: data.message || "Failed to assign role." }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while assigning role." }
  }
}

export async function removeRole(payload: AssignRolePayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/roles/assign", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { success: false, error: data.message || "Failed to remove role." }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while removing role." }
  }
}
