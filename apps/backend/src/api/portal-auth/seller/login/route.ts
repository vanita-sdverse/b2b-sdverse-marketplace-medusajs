import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SellerLoginOperation } from "../../operations/seller-login"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await SellerLoginOperation.handle(req, res)
}
