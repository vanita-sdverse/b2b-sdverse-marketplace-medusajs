import { NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/customers-list`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch("http://localhost:9000/customers-list", { cache: "no-store" })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ customers: [] })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND_URL}/customers-with-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { status: 201 })
    }

    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to create customer" }, { status: res.status })
  } catch (err: any) {
    try {
      const fallbackRes = await fetch("http://localhost:9000/customers-with-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await req.json()),
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data, { status: 201 })
      }
    } catch (e) {}
    return NextResponse.json({ message: err.message || "Network error" }, { status: 500 })
  }
}
