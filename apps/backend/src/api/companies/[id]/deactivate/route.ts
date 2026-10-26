import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DeactivateCompanyOperation } from "../../operations/deactivate-company"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await DeactivateCompanyOperation.handle(req, res)
}
