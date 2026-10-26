import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MODULE_NAMES } from "../../../../constants"
import CompanyModuleService from "../../../../modules/company/service"

const assignRoleSchema = z.object({
  id_customer: z.number().int(),
  id_role: z.string().min(1),
})

export async function assignRoleOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsed = assignRoleSchema.parse(req.body)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  // Verify role exists
  const roles = await companyService.listRoles({ id: parsed.id_role })
  if (!roles.length) {
    res.status(404).json({ message: `Role with ID '${parsed.id_role}' not found.` })
    return
  }

  // Check if assignment already exists
  const existing = await companyService.listCustomerRoles({
    id_customer: parsed.id_customer,
    id_role: parsed.id_role,
  })

  if (existing.length > 0) {
    res.status(200).json({ customerRole: existing[0] })
    return
  }

  const customerRole = await companyService.createCustomerRoles({
    id_customer: parsed.id_customer,
    id_role: parsed.id_role,
  })

  res.status(201).json({ customerRole })
}
