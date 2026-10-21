import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SELLER_MODULE } from "../../../modules/seller"
import SellerModuleService from "../../../modules/seller/service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const sellerService: SellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellers = await sellerService.listSellers({}, { take: 100 })
  res.status(200).json({ companies: sellers })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const sellerService: SellerModuleService = req.scope.resolve(SELLER_MODULE)
  const { name } = req.body as { name: string }

  if (!name || !name.trim()) {
    res.status(400).json({ message: "Company name is required." })
    return
  }

  const trimmedName = name.trim()
  const existing = await sellerService.listSellers({ name: trimmedName })

  if (existing.length > 0) {
    res.status(200).json({ company: existing[0] })
    return
  }

  const handle = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `comp-${Date.now()}`
  const created = await sellerService.createSellers({
    name: trimmedName,
    handle,
  })

  res.status(201).json({ company: created })
}
