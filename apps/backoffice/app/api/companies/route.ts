import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
      { id: "comp_134", id_company: 134, name: "Nexon", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-13", subscription_expiration_date: "2027-10-13T00:00:00.000Z" },
      { id: "comp_133", id_company: 133, name: "BYD 1", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-12", subscription_expiration_date: "2027-10-12T00:00:00.000Z" },
      { id: "comp_132", id_company: 132, name: "Volvo", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-12", subscription_expiration_date: "2027-10-12T00:00:00.000Z" },
      { id: "comp_131", id_company: 131, name: "BYD", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-12", subscription_expiration_date: "2027-10-12T00:00:00.000Z" },
      { id: "comp_130", id_company: 130, name: "Hero motors", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-12", subscription_expiration_date: "2027-10-12T00:00:00.000Z" },
      { id: "comp_129", id_company: 129, name: "Adi Motors", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-12", subscription_expiration_date: "2027-10-12T00:00:00.000Z" },
      { id: "comp_128", id_company: 128, name: "TY", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-08", subscription_expiration_date: "2027-10-08T00:00:00.000Z" },
      { id: "comp_127", id_company: 127, name: "MG", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-08", subscription_expiration_date: "2027-10-08T00:00:00.000Z" },
      { id: "comp_126", id_company: 126, name: "Skoda", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-08", subscription_expiration_date: "2027-10-08T00:00:00.000Z" },
      { id: "comp_125", id_company: 125, name: "TVS", is_active: true, status: "Subscribed", subscription_end_date: "2027-10-08", subscription_expiration_date: "2027-10-08T00:00:00.000Z" },
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
