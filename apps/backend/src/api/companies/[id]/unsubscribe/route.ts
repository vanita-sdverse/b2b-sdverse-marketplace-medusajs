import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { UnsubscribeCompanyOperation } from "../../operations/unsubscribe-company"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await UnsubscribeCompanyOperation.handle(req, res)
}
