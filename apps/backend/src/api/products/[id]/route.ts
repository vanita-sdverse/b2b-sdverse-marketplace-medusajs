import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GetProductOperation } from "../operations/get-product"
import { UpdateProductOperation } from "../operations/update-product"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return await GetProductOperation.handle(req, res)
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  return await UpdateProductOperation.handle(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await UpdateProductOperation.handle(req, res)
}
