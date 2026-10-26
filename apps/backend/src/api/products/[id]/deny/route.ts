import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DenyProductOperation } from "../../operations/deny-product"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await DenyProductOperation.handle(req, res)
}
