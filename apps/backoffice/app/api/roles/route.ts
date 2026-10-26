import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

async function fetchBackend(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      cache: "no-store",
    })
    return res
  } catch (err) {
    return await fetch(`http://localhost:9000${path}`, {
      ...options,
      cache: "no-store",
    })
  }
}

export async function GET() {
  try {
    const res = await fetchBackend("/roles")
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    // Fallback to /admin/roles if needed
    const fallback = await fetchBackend("/admin/roles")
    if (fallback.ok) {
      const data = await fallback.json()
      return NextResponse.json(data)
    }
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to fetch roles" }, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetchBackend("/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to create role" }, { status: 500 })
  }
}
