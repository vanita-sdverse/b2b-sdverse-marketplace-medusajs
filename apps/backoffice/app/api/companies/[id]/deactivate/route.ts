import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  let body: any = {}
  try {
    body = await req.json()
  } catch (e) {}

  try {
    const res = await fetch(`${BACKEND_URL}/companies/${id}/deactivate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to update company active status" }, { status: res.status })
  } catch (err: any) {
    try {
      const fallback = await fetch(`http://localhost:9000/companies/${id}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (fallback.ok) {
        const data = await fallback.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
    return NextResponse.json({ message: err?.message || "Network error" }, { status: 500 })
  }
}
