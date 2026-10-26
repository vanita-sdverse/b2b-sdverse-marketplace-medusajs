import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const res = await fetch(`${BACKEND_URL}/products/${id}`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch(`http://localhost:9000/products/${id}`, { cache: "no-store" })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: `Product '${id}' not found.` }, { status: 404 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await request.json()

  try {
    const res = await fetch(`${BACKEND_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch(`http://localhost:9000/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: `Failed to update product '${id}'.` }, { status: 500 })
}
