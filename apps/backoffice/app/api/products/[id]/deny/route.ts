import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  let body = {}
  try {
    body = await request.json()
  } catch (e) {}

  try {
    const res = await fetch(`${BACKEND_URL}/products/${id}/deny`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch(`http://localhost:9000/products/${id}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: `Failed to execute marketplace denial for '${id}'.` }, { status: 500 })
}
