import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CompanyGovernanceService } from "../services/company-governance-service"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"

export class GetCompanyOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    const rawId = req.params.id
    const governanceService = new CompanyGovernanceService(req.scope)
    const profileService: CustomerProfileModuleService = req.scope.resolve(CUSTOMER_PROFILE_MODULE)

    const company = await governanceService.resolveCompany(rawId)
    if (!company) {
      return res.status(404).json({ message: `Company '${rawId}' not found.` })
    }

    const checked = await governanceService.checkAndEnforceSubscription(company)
    const formatted = governanceService.formatCompany(checked)

    // Fetch company users
    const allProfiles: any[] = (await profileService.listCustomerProfiles({}, { take: 1000 }).catch(() => [])) as any[]
    const companyNumericId = checked.id_company ? Number(checked.id_company) : null
    const ownerId = checked.fk_owner ? Number(checked.fk_owner) : null

    const users = allProfiles
      .filter((p) => {
        if (companyNumericId && Number(p.fk_company) === companyNumericId) return true
        if (ownerId && Number(p.id_customer) === ownerId) return true
        return false
      })
      .map((p) => ({
        id: `cus_${p.id_customer}`,
        id_customer: p.id_customer,
        name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
        email: p.email,
        phone: p.phone,
        is_active: p.is_active ?? true,
      }))

    return res.status(200).json({ company: formatted, users })
  }
}
