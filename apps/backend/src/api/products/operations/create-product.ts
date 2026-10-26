import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class CreateProductOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const body = (req.body || {}) as any
      const governanceService = new ProductGovernanceService(req.scope)

      if (!body.title?.trim()) {
        return res.status(400).json({ message: "Product title is required." })
      }

      const created = await governanceService.createProduct(body)

      return res.status(201).json({
        message: "Product and variant relations created successfully.",
        product: created,
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to create product",
        error: error?.message || String(error),
      })
    }
  }
}
