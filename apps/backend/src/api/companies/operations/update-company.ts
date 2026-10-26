import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { CompanyGovernanceService } from "../services/company-governance-service"

export class UpdateCompanyOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    const rawId = req.params.id
    const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)
    const governanceService = new CompanyGovernanceService(req.scope)

    const company = await governanceService.resolveCompany(rawId)
    if (!company) {
      return res.status(404).json({ message: `Company '${rawId}' not found.` })
    }

    const body = (req.body || {}) as any

    const updatePayload: Record<string, any> = {
      id: company.id,
    }

    if (body.name && body.name.trim()) {
      updatePayload.name = body.name.trim()
    }

    if (body.subscription_expiration_date !== undefined) {
      updatePayload.subscription_expiration_date = body.subscription_expiration_date
        ? new Date(body.subscription_expiration_date)
        : null
    }

    // Merge attributes
    const currentAttrs = company.attributes || {}
    const newAttrs = {
      ...currentAttrs,
      ...(body.company_type !== undefined ? { company_type: body.company_type } : {}),
      ...(body.company_age !== undefined ? { company_age: body.company_age } : {}),
      ...(body.company_size !== undefined ? { company_size: body.company_size } : {}),
      ...(body.hq_region !== undefined ? { hq_region: body.hq_region } : {}),
      ...(body.automotive_experience !== undefined ? { automotive_experience: body.automotive_experience } : {}),
      ...(body.notify_users !== undefined ? { notify_users: Boolean(body.notify_users) } : {}),
      ...(body.attributes ? body.attributes : {}),
    }

    updatePayload.attributes = newAttrs

    const updated = await companyService.updateCompanies(updatePayload)
    const checked = await governanceService.checkAndEnforceSubscription(updated)
    const formatted = governanceService.formatCompany(checked)

    return res.status(200).json({
      company: formatted,
      message: "Company updated successfully",
    })
  }
}
