import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CompanyGovernanceService } from "../services/company-governance-service"

export class DeactivateCompanyOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    const rawId = req.params.id
    const governanceService = new CompanyGovernanceService(req.scope)

    const company = await governanceService.resolveCompany(rawId)
    if (!company) {
      return res.status(404).json({ message: `Company '${rawId}' not found.` })
    }

    const body = (req.body || {}) as any
    const targetStatus = body.is_active !== undefined ? Boolean(body.is_active) : !company.is_active

    const result = await governanceService.setCompanyActiveStatus(company.id, targetStatus)
    const formatted = governanceService.formatCompany(result.company)

    const actionText = targetStatus ? "activated" : "deactivated"

    return res.status(200).json({
      company: formatted,
      updated_users_count: result.updatedUsers,
      message: `Company '${company.name}' and its users have been ${actionText} successfully.`,
    })
  }
}
