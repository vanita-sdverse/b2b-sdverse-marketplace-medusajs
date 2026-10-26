export async function deleteRole(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/roles/${id}`, {
      method: "DELETE",
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { success: false, error: data.message || "Failed to delete role." }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while deleting role." }
  }
}
