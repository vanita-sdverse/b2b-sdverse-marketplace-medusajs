import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { RoleGovernanceService } from "../services/role-governance-service"

const createRoleSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
})

export class CreateRoleOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const parsed = createRoleSchema.parse(req.body)
      const service = new RoleGovernanceService(req.scope)

      const role = await service.createRole({
        role_name: parsed.role_name,
        description: parsed.description,
        permissions: parsed.permissions,
        routes: parsed.routes,
      })

      res.status(201).json({ role })
    } catch (err: any) {
      const status = err.message?.includes("already exists") ? 409 : 400
      res.status(status).json({ message: err?.message || "Failed to create role" })
    }
  }
}
