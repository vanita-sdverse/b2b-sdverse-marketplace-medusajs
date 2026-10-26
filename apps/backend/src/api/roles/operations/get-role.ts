import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RoleGovernanceService } from "../services/role-governance-service"

export class GetRoleOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const { id } = req.params
      const service = new RoleGovernanceService(req.scope)
      const role = await service.getRole(id)

      if (!role) {
        res.status(404).json({ message: `Role with ID '${id}' not found.` })
        return
      }

      res.status(200).json({ role })
    } catch (err: any) {
      res.status(500).json({ message: err?.message || "Failed to get role" })
    }
  }
}
