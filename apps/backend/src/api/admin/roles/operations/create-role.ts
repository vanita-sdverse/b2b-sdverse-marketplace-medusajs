import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MODULE_NAMES } from "../../../../constants"
import {
  isFixedRole,
  PermissionCode,
} from "../../../../constants/roles"
import CompanyModuleService from "../../../../modules/company/service"

const createRoleSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
})

export async function createRoleOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsed = createRoleSchema.parse(req.body)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  // Verify unique role name
  const existing = await companyService.listRoles({
    role_name: parsed.role_name.trim(),
  })

  if (existing.length > 0) {
    res.status(409).json({ message: `Role '${parsed.role_name}' already exists.` })
    return
  }

  const role = await companyService.createRoles({
    role_name: parsed.role_name.trim(),
    description: parsed.description ? parsed.description.trim() : null,
  })

  const isFixed = isFixedRole((role as any).role_name)

  res.status(201).json({
    role: {
      id: (role as any).id,
      role_name: (role as any).role_name,
      description: (role as any).description,
      permissions: (parsed.permissions as PermissionCode[]) || [],
      isFixed,
      created_at: (role as any).created_at,
      updated_at: (role as any).updated_at,
    },
  })
}
