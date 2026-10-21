import { NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/companies`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err) {
    // fallback if internal docker host not available
    try {
      const fallbackRes = await fetch("http://localhost:9000/companies", { cache: "no-store" })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({
    companies: [
      { id: "sel_sdverse", name: "SDVerse" },
      { id: "sel_nordic", name: "Nordic Transport Logistics AB" },
      { id: "sel_scania", name: "Scania Logistics Hub" },
      { id: "sel_man", name: "MAN Truck Repair Berlin" },
    ],
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND_URL}/companies`, {
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
      const res = await fetch("http://localhost:9000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await req.json()),
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json(data, { status: 201 })
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: "Failed to create company" }, { status: 500 })
}
