import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class DenyProductOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const body = (req.body || {}) as { reason?: string; action?: "deny" | "approve" }
      const governanceService = new ProductGovernanceService(req.scope)

      if (body.action === "approve") {
        const approved = await governanceService.approveProductByMarketplace(id)
        if (!approved) {
          return res.status(404).json({ message: `Product '${id}' not found.` })
        }
        return res.status(200).json({
          message: `Product '${approved.title}' has been approved by the marketplace.`,
          product: approved,
        })
      }

      const denied = await governanceService.denyProductByMarketplace(id, body.reason)

      if (!denied) {
        return res.status(404).json({
          message: `Product '${id}' not found to deny.`,
        })
      }

      return res.status(200).json({
        message: `Product '${denied.title}' has been marked as DENIED by the marketplace.`,
        product: denied,
        denial_reason: denied.denial_reason,
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to perform marketplace denial action",
        error: error?.message || String(error),
      })
    }
  }
}
