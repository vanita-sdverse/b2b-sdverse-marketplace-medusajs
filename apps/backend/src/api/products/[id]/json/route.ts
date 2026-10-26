import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ExportProductJsonOperation } from "../../operations/export-product-json"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return await ExportProductJsonOperation.handle(req, res)
}
