import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { deactivateCustomerOperation } from "../../operations/deactivate-customer"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await deactivateCustomerOperation(req, res)
}
