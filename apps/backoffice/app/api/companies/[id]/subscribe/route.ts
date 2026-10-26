import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const res = await fetch(`${BACKEND_URL}/companies/${id}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to subscribe company" }, { status: res.status })
  } catch (err: any) {
    try {
      const fallback = await fetch(`http://localhost:9000/companies/${id}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (fallback.ok) {
        const data = await fallback.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
    return NextResponse.json({ message: err?.message || "Network error" }, { status: 500 })
  }
}
