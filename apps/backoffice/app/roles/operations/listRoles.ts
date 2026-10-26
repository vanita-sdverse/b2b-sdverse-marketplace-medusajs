import { RoleRecord } from "../constants"

export async function listRoles(): Promise<RoleRecord[]> {
  try {
    const res = await fetch("/api/roles", { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.roles)) {
        return data.roles
      }
    }
  } catch (err) {
    console.error("Failed to list roles:", err)
  }
  return []
}
