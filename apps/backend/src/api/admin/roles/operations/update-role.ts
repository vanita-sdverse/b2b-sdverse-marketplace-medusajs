import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MODULE_NAMES } from "../../../../constants"
import {
  isFixedRole,
  ROLE_DEFAULT_PERMISSIONS,
  PermissionCode,
} from "../../../../constants/roles"
import CompanyModuleService from "../../../../modules/company/service"

const updateRoleSchema = z.object({
  role_name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
})

export async function updateRoleOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const parsed = updateRoleSchema.parse(req.body)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  const roles = await companyService.listRoles({ id })
  if (!roles.length) {
    res.status(404).json({ message: `Role with ID '${id}' not found.` })
    return
  }

  const existingRole = roles[0] as any
  const isFixed = isFixedRole(existingRole.role_name)

  // Prevent renaming fixed system roles
  if (isFixed && parsed.role_name && parsed.role_name !== existingRole.role_name) {
    res.status(400).json({
      message: `System role '${existingRole.role_name}' cannot be renamed.`,
    })
    return
  }

  const updatePayload: Record<string, any> = {
    id,
    ...(parsed.role_name ? { role_name: parsed.role_name.trim() } : {}),
    ...(parsed.description !== undefined ? { description: parsed.description } : {}),
  }

  const updated = await companyService.updateRoles(updatePayload)

  const permissions: PermissionCode[] =
    (parsed.permissions as PermissionCode[]) ||
    ROLE_DEFAULT_PERMISSIONS[(updated as any).role_name] ||
    []

  res.status(200).json({
    role: {
      id: (updated as any).id,
      role_name: (updated as any).role_name,
      description: (updated as any).description,
      permissions,
      isFixed,
      created_at: (updated as any).created_at,
      updated_at: (updated as any).updated_at,
    },
  })
}
