import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class GetProductOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const governanceService = new ProductGovernanceService(req.scope)

      const product = await governanceService.getProductById(id)

      if (!product) {
        return res.status(404).json({
          message: `Product with ID '${id}' not found.`,
        })
      }

      return res.status(200).json({
        product,
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to retrieve product details",
        error: error?.message || String(error),
      })
    }
  }
}
