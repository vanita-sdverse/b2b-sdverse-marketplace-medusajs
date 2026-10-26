import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams.toString()
  const targetUrl = searchParams ? `${BACKEND_URL}/products?${searchParams}` : `${BACKEND_URL}/products`

  try {
    const res = await fetch(targetUrl, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackUrl = searchParams ? `http://localhost:9000/products?${searchParams}` : `http://localhost:9000/products`
      const fallbackRes = await fetch(fallbackUrl, { cache: "no-store" })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({
    products: [],
    count: 0,
    message: "Failed to connect to product service.",
  }, { status: 500 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { status: 201 })
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch("http://localhost:9000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await request.json().catch(() => ({}))),
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data, { status: 201 })
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
}
