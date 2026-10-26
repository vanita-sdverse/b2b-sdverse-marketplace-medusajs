import { NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const res = await fetch(`${BACKEND_URL}/customers-list/${id}`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallback = await fetch(`http://localhost:9000/customers-list/${id}`, { cache: "no-store" })
      if (fallback.ok) {
        const data = await fallback.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: "Customer not found" }, { status: 404 })
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  let body: any = {}
  try {
    body = await req.json()
  } catch (e) {}

  try {
    const res = await fetch(`${BACKEND_URL}/customers-list/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to update customer" }, { status: res.status })
  } catch (err: any) {
    try {
      const fallback = await fetch(`http://localhost:9000/customers-list/${id}`, {
        method: "PUT",
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const res = await fetch(`${BACKEND_URL}/customers-list/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ message: err.message || "Failed to delete customer" }, { status: res.status })
  } catch (err: any) {
    try {
      const fallback = await fetch(`http://localhost:9000/customers-list/${id}`, {
        method: "DELETE",
      })
      if (fallback.ok) {
        const data = await fallback.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
    return NextResponse.json({ message: err?.message || "Network error" }, { status: 500 })
  }
}
