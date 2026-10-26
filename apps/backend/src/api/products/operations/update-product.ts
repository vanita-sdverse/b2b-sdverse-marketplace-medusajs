import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class UpdateProductOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const body = (req.body || {}) as any
      const governanceService = new ProductGovernanceService(req.scope)

      const updated = await governanceService.updateProduct(id, body)

      if (!updated) {
        return res.status(404).json({
          message: `Product with ID '${id}' not found for update.`,
        })
      }

      return res.status(200).json({
        message: "Product and variants updated successfully.",
        product: updated,
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to update product",
        error: error?.message || String(error),
      })
    }
  }
}
