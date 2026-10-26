import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class ListProductsOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const governanceService = new ProductGovernanceService(req.scope)
      const { search, status, category } = req.query as {
        search?: string
        status?: string
        category?: string
      }

      const products = await governanceService.listProducts({
        search,
        status,
        category,
      })

      return res.status(200).json({
        products,
        count: products.length,
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to list products with variant relations",
        error: error?.message || String(error),
      })
    }
  }
}
