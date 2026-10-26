import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const url = new URL(request.url)
  const isDownload = url.searchParams.get("download") === "true"

  try {
    const res = await fetch(`${BACKEND_URL}/products/${id}/json`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (isDownload) {
        return new NextResponse(JSON.stringify(data, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="${data.product?.handle || id}.json"`,
          },
        })
      }
      return NextResponse.json(data)
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch(`http://localhost:9000/products/${id}/json`, { cache: "no-store" })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        if (isDownload) {
          return new NextResponse(JSON.stringify(data, null, 2), {
            headers: {
              "Content-Type": "application/json",
              "Content-Disposition": `attachment; filename="${data.product?.handle || id}.json"`,
            },
          })
        }
        return NextResponse.json(data)
      }
    } catch (e) {}
  }

  return NextResponse.json({ message: `Failed to export JSON for product '${id}'.` }, { status: 404 })
}
