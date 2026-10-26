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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetchBackend(`/roles/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const fallback = await fetchBackend(`/admin/roles/${params.id}`)
    const data = await fallback.json().catch(() => ({}))
    return NextResponse.json(data, { status: fallback.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to fetch role" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const res = await fetchBackend(`/roles/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const fallback = await fetchBackend(`/admin/roles/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await fallback.json().catch(() => ({}))
    return NextResponse.json(data, { status: fallback.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to update role" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetchBackend(`/roles/${params.id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const fallback = await fetchBackend(`/admin/roles/${params.id}`, {
      method: "DELETE",
    })
    const data = await fallback.json().catch(() => ({}))
    return NextResponse.json(data, { status: fallback.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to delete role" }, { status: 500 })
  }
}
