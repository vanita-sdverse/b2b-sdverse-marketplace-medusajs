import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MODULE_NAMES } from "../../../../constants"
import { isFixedRole } from "../../../../constants/roles"
import CompanyModuleService from "../../../../modules/company/service"

export async function deleteRoleOperation(
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
  if (isFixedRole(role.role_name)) {
    res.status(403).json({
      message: `System role '${role.role_name}' is fixed and cannot be deleted.`,
    })
    return
  }

  // Also remove any assigned customer_roles
  const assigned = await companyService.listCustomerRoles({ id_role: id }).catch(() => [])
  for (const cr of assigned) {
    await companyService.deleteCustomerRoles((cr as any).id).catch(() => {})
  }

  await companyService.deleteRoles(id)

  res.status(200).json({
    id,
    object: "role",
    deleted: true,
  })
}
