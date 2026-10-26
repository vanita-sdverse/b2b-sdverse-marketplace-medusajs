import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MODULE_NAMES } from "../../../../constants"
import CompanyModuleService from "../../../../modules/company/service"

const removeRoleSchema = z.object({
  id_customer: z.number().int(),
  id_role: z.string().min(1),
})

export async function removeRoleOperation(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsed = removeRoleSchema.parse(req.body)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  const existing = await companyService.listCustomerRoles({
    id_customer: parsed.id_customer,
    id_role: parsed.id_role,
  })

  if (!existing.length) {
    res.status(404).json({ message: "Customer role assignment not found." })
    return
  }

  for (const cr of existing) {
    await companyService.deleteCustomerRoles((cr as any).id)
  }

  res.status(200).json({ deleted: true })
}
