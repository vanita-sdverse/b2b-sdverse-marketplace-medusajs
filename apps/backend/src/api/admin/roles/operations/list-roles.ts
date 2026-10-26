import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MODULE_NAMES } from "../../../../constants"
import {
  ROLE_DEFAULT_PERMISSIONS,
  isFixedRole,
  PermissionCode,
} from "../../../../constants/roles"
import CompanyModuleService from "../../../../modules/company/service"

export async function listRolesOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  const roles = await companyService.listRoles({}, { take: 100 })
  const customerRoles = await companyService.listCustomerRoles({}, { take: 1000 }).catch(() => [])

  // Count active members per role
  const countMap: Record<string, number> = {}
  for (const cr of customerRoles) {
    const roleId = cr.id_role
    countMap[roleId] = (countMap[roleId] || 0) + 1
  }

  const enrichedRoles = roles.map((r: any) => {
    const isFixed = isFixedRole(r.role_name)
    const permissions: PermissionCode[] =
      ROLE_DEFAULT_PERMISSIONS[r.role_name] ||
      (r.metadata?.permissions as PermissionCode[]) ||
      []

    return {
      id: r.id,
      role_name: r.role_name,
      description: r.description || null,
      permissions,
      isFixed,
      userCount: countMap[r.id] || 0,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }
  })

  res.status(200).json({ roles: enrichedRoles })
}
