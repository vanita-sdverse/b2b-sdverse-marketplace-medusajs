import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"

export async function deleteCustomerOperation(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const rawId = req.params.id
  const numericId = parseInt(rawId.replace(/^cus_/, ""), 10)

  if (!numericId || isNaN(numericId)) {
    return res.status(400).json({ message: `Invalid customer ID format: '${rawId}'` })
  }

  const profileService: CustomerProfileModuleService = req.scope.resolve(CUSTOMER_PROFILE_MODULE)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  // 1. Verify existence
  const profiles = await profileService.listCustomerProfiles(
    { id_customer: numericId },
    { take: 1 }
  ).catch(() => [])

  if (profiles.length === 0) {
    return res.status(404).json({ message: `Customer '${rawId}' not found.` })
  }

  // 2. Remove associated customer roles
  try {
    const customerRoles = await companyService.listCustomerRoles(
      { id_customer: numericId },
      { take: 100 }
    ).catch(() => [])

    for (const cr of customerRoles) {
      await companyService.deleteCustomerRoles((cr as any).id).catch(() => {})
    }
  } catch (err) {
    // Role cleanup fallback
  }

  // 3. Clear owner link on companies if this customer was the owner
  try {
    const ownedCompanies = await companyService.listCompanies(
      { fk_owner: String(numericId) } as any,
      { take: 10 }
    ).catch(() => [])

    for (const comp of ownedCompanies) {
      await companyService.updateCompanies({
        id: comp.id,
        fk_owner: null,
      }).catch(() => {})
    }
  } catch (err) {}

  // 4. Delete customer record from sdv_customers
  await (profileService as any).deleteCustomerProfiles({ id_customer: numericId })

  return res.status(200).json({
    success: true,
    id: rawId,
    message: `Customer '${rawId}' has been deleted successfully.`,
  })
}
