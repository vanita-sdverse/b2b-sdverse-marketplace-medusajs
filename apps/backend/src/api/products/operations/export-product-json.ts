import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductGovernanceService } from "../services/product-governance-service"

export class ExportProductJsonOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const governanceService = new ProductGovernanceService(req.scope)

      const exportData = await governanceService.exportProductJson(id)

      if (!exportData) {
        return res.status(404).json({
          message: `Product '${id}' not found for JSON export.`,
        })
      }

      // Check if client requested a file download attachment
      const asAttachment = req.query.download === "true" || req.query.download === "1"
      if (asAttachment) {
        res.setHeader("Content-Disposition", `attachment; filename="${exportData.product.handle || id}.json"`)
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        return res.send(JSON.stringify(exportData, null, 2))
      }

      return res.status(200).json(exportData)
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to export product JSON",
        error: error?.message || String(error),
      })
    }
  }
}
