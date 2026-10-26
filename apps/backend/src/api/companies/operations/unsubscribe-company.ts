import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CompanyGovernanceService } from "../services/company-governance-service"

export class UnsubscribeCompanyOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    const rawId = req.params.id
    const governanceService = new CompanyGovernanceService(req.scope)

    const company = await governanceService.resolveCompany(rawId)
    if (!company) {
      return res.status(404).json({ message: `Company '${rawId}' not found.` })
    }

    const result = await governanceService.unsubscribeCompany(company.id)
    const formatted = governanceService.formatCompany(result.company)

    return res.status(200).json({
      company: formatted,
      updated_users_count: result.updatedUsers,
      message: `Company '${company.name}' has been unsubscribed and deactivated along with its users.`,
    })
  }
}
