import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RoleGovernanceService } from "../services/role-governance-service"

export class DeleteRoleOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const { id } = req.params
      const service = new RoleGovernanceService(req.scope)
      await service.deleteRole(id)

      res.status(200).json({ success: true, message: `Role '${id}' deleted successfully.` })
    } catch (err: any) {
      const status = err.message?.includes("not found") ? 404 : 400
      res.status(status).json({ message: err?.message || "Failed to delete role" })
    }
  }
}
