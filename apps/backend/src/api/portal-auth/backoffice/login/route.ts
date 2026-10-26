import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BackofficeLoginOperation } from "../../operations/backoffice-login"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await BackofficeLoginOperation.handle(req, res)
}
