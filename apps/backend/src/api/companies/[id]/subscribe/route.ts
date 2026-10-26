import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SubscribeCompanyOperation } from "../../operations/subscribe-company"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await SubscribeCompanyOperation.handle(req, res)
}
