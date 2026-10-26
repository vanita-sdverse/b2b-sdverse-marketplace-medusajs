import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MODULE_NAMES } from "../../../constants"
import { FIXED_MARKETPLACE_ROLES } from "../../../constants/roles"
import CompanyModuleService from "../../../modules/company/service"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"

export interface AssignCompanyAdminRoleStepInput {
  customer_id: string
  id_customer?: number | null
  company_id: string
  id_company?: number | null
  company_name: string
  customer_email?: string | null
  is_first_customer?: boolean
}

export const assignCompanyAdminRoleStep = createStep(
  "assign-company-admin-role-step",
  async (input: AssignCompanyAdminRoleStepInput, { container }) => {
    const companyService: CompanyModuleService = container.resolve(MODULE_NAMES.COMPANY)

    // 1. Resolve company-specific role: e.g. "SDVerse -- vanita.chaudhari.external@sdverse.auto"
    const companyName = (input.company_name || "Company").trim()
    const email = (input.customer_email || "user").trim()
    const roleName = `${companyName} -- ${email}`

    const existingRoles = await companyService.listRoles({
      role_name: roleName,
    }).catch(() => [])

    let targetRole = existingRoles[0]
    if (!targetRole) {
      targetRole = await companyService.createRoles({
        role_name: roleName,
        description: `Company-specific role for ${companyName} (${email})`,
        permissions: ["/", "/products", "/inventory", "/orders", "/analytics", "/profile"] as any,
      })
    }

    // 2. Set this customer as company owner
    await companyService.updateCompanies({
      id: input.company_id,
      fk_owner: input.customer_id,
    }).catch(() => {})

    // 3. Ensure sdv_customers has fk_company set to integer id_company
    const customerNumericId = input.id_customer ? Number(input.id_customer) : null
    if (input.id_company && customerNumericId) {
      try {
        const profileService: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
        await profileService.updateCustomerProfiles({
          id_customer: customerNumericId,
          fk_company: input.id_company,
        }).catch(() => {})
      } catch (e) {}
    }

    // 4. Assign the company-specific CustomerRole record
    let customerRole: any = null
    if (customerNumericId && !isNaN(customerNumericId)) {
      const existing = await companyService.listCustomerRoles({
        id_customer: customerNumericId,
        id_role: targetRole.id,
      }).catch(() => [])

      if (existing.length > 0) {
        customerRole = existing[0]
      } else {
        customerRole = await companyService.createCustomerRoles({
          id_customer: customerNumericId,
          id_role: targetRole.id,
        })
      }
    }

    return new StepResponse(
      { customerRole, role: targetRole },
      customerRole ? (customerRole as any).id : null
    )
  },
  async (customerRoleId, { container }) => {
    if (customerRoleId) {
      const companyService: CompanyModuleService = container.resolve(MODULE_NAMES.COMPANY)
      await companyService.deleteCustomerRoles(customerRoleId).catch(() => {})
    }
  }
)
