import { NextResponse } from "next/server"

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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetchBackend("/admin/roles/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to assign role" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const res = await fetchBackend("/admin/roles/assign", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Failed to remove role" }, { status: 500 })
  }
}
