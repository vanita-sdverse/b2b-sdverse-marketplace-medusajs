import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ListProductsOperation } from "./operations/list-products"
import { CreateProductOperation } from "./operations/create-product"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return await ListProductsOperation.handle(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await CreateProductOperation.handle(req, res)
}
