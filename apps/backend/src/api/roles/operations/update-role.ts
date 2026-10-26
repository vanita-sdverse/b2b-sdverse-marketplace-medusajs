import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { RoleGovernanceService } from "../services/role-governance-service"

const updateRoleSchema = z.object({
  role_name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
})

export class UpdateRoleOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const { id } = req.params
      const parsed = updateRoleSchema.parse(req.body)
      const service = new RoleGovernanceService(req.scope)

      const role = await service.updateRole(id, {
        role_name: parsed.role_name,
        description: parsed.description,
        permissions: parsed.permissions,
        routes: parsed.routes,
      })

      res.status(200).json({ role })
    } catch (err: any) {
      const status = err.message?.includes("not found") ? 404 : 400
      res.status(status).json({ message: err?.message || "Failed to update role" })
    }
  }
}
