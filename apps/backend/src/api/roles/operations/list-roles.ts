import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RoleGovernanceService } from "../services/role-governance-service"

export class ListRolesOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const service = new RoleGovernanceService(req.scope)
      const roles = await service.listRoles()
      res.status(200).json({ roles, count: roles.length })
    } catch (err: any) {
      res.status(500).json({ message: err?.message || "Failed to list roles" })
    }
  }
}
