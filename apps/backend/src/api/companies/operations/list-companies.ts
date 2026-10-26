import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { CompanyGovernanceService, FormattedCompany } from "../services/company-governance-service"

export class ListCompaniesOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse) {
    const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)
    const governanceService = new CompanyGovernanceService(req.scope)

    // 1. Fetch all companies
    const rawCompanies: any[] = (await companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]

    // 2. Enforce subscription expiry and format
    const formattedList: FormattedCompany[] = []
    for (const company of rawCompanies) {
      const checked = await governanceService.checkAndEnforceSubscription(company)
      formattedList.push(governanceService.formatCompany(checked))
    }

    // Sort descending by id_company (as shown in screenshot: 134, 133, 132...)
    formattedList.sort((a, b) => (Number(b.id_company) || 0) - (Number(a.id_company) || 0))

    return res.status(200).json({ companies: formattedList, count: formattedList.length })
  }
}
