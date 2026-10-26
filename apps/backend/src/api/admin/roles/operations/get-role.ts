import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MODULE_NAMES } from "../../../../constants"
import {
  ROLE_DEFAULT_PERMISSIONS,
  isFixedRole,
  PermissionCode,
} from "../../../../constants/roles"
import CompanyModuleService from "../../../../modules/company/service"

export async function getRoleOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  const roles = await companyService.listRoles({ id })
  if (!roles.length) {
    res.status(404).json({ message: `Role with ID '${id}' not found.` })
    return
  }

  const role = roles[0] as any
  const isFixed = isFixedRole(role.role_name)
  const permissions: PermissionCode[] =
    ROLE_DEFAULT_PERMISSIONS[role.role_name] ||
    (role.metadata?.permissions as PermissionCode[]) ||
    []

  res.status(200).json({
    role: {
      id: role.id,
      role_name: role.role_name,
      description: role.description || null,
      permissions,
      isFixed,
      created_at: role.created_at,
      updated_at: role.updated_at,
    },
  })
}
