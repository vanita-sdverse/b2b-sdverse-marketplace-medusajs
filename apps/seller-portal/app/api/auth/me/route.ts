import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/portal-auth/seller/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (e) {
    try {
      const fallback = await fetch(`http://localhost:9000/portal-auth/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      })
      if (fallback.ok) {
        const data = await fallback.json()
        return NextResponse.json(data)
      }
    } catch (err) {}
  }

  return NextResponse.json({ message: "Could not refresh permissions" }, { status: 500 })
}
