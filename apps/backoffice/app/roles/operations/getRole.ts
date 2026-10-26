import { RoleRecord } from "../constants"

export async function getRole(id: string): Promise<RoleRecord | null> {
  try {
    const res = await fetch(`/api/roles/${id}`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return data.role || null
    }
  } catch (err) {
    console.error(`Failed to get role ${id}:`, err)
  }
  return null
}
