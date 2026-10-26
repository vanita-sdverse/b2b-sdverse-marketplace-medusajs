import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { SELLER_MODULE } from "../../../modules/seller"
import SellerModuleService from "../../../modules/seller/service"
import crypto from "crypto"

export interface ResolveOrCreateCompanyStepInput {
  company_name?: string | null
  company_id?: string | null
  fk_merchant_user?: string | null
  hiring_date?: string | Date | null
}

export interface ResolveOrCreateCompanyStepOutput {
  companyId: string
  companyName: string
  idCompany?: number | null
  sellerId?: string | null
  isNewCompany: boolean
}

export const resolveOrCreateCompanyStep = createStep(
  "resolve-or-create-company-step",
  async (input: ResolveOrCreateCompanyStepInput, { container }) => {
    const companyService: CompanyModuleService = container.resolve(MODULE_NAMES.COMPANY)

    let company: any = null
    let seller: any = null
    let isNewCompany = false

    const requestedId = input.company_id || input.fk_merchant_user
    const requestedName = (input.company_name || "").trim()

    // 1. Try resolving existing company by ID
    if (requestedId) {
      const companiesById = await companyService.listCompanies({ id: requestedId }).catch(() => [])
      if (companiesById.length > 0) {
        company = companiesById[0]
      }
    }

    // 2. Try resolving existing company by Name
    if (!company && requestedName) {
      const companiesByName = await companyService.listCompanies({ name: requestedName }).catch(() => [])
      if (companiesByName.length > 0) {
        company = companiesByName[0]
      }
    }

    // Fetch existing companies to calculate max id_company for integer foreign key
    const allExisting: any[] = (await companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]
    let maxIdCompany = 0
    for (const c of allExisting) {
      const num = Number(c?.id_company) || 0
      if (num > maxIdCompany) {
        maxIdCompany = num
      }
    }

    // Determine hiring date and count subscription expiration date 1 year after hiring
    const hiringDate = input.hiring_date ? new Date(input.hiring_date) : new Date()
    const subscriptionEndDate = new Date(hiringDate)
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)

    // 3. If company does NOT exist, create the company first with 1-year subscription from hiring date
    if (!company) {
      const finalName = requestedName || "Enterprise Fleet Organization"
      const key =
        finalName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
        `comp-${Date.now()}`
      const nextIdCompany = maxIdCompany + 1

      company = await companyService.createCompanies({
        name: finalName,
        key: `${key}-${Date.now().toString().slice(-4)}`,
        uuid: crypto.randomUUID(),
        is_active: true,
        id_company: nextIdCompany,
        subscription_expiration_date: subscriptionEndDate,
        attributes: {
          is_subscribed: true,
          hiring_date: hiringDate.toISOString(),
          subscribed_at: hiringDate.toISOString(),
        },
      })
      isNewCompany = true
    } else {
      const nextIdCompany = company.id_company ? Number(company.id_company) : maxIdCompany + 1
      const updatePayload: Record<string, any> = {
        id: company.id,
      }
      if (!company.id_company) {
        updatePayload.id_company = nextIdCompany
        company.id_company = nextIdCompany
      }
      if (!company.subscription_expiration_date) {
        updatePayload.subscription_expiration_date = subscriptionEndDate
        company.subscription_expiration_date = subscriptionEndDate
      }
      if (Object.keys(updatePayload).length > 1) {
        await companyService.updateCompanies(updatePayload).catch(() => {})
      }
    }

    // 4. Ensure corresponding Seller record is also present/resolved
    try {
      const sellerService: SellerModuleService = container.resolve(SELLER_MODULE)
      const existingSellers = await sellerService.listSellers({ name: company.name }).catch(() => [])
      if (existingSellers.length > 0) {
        seller = existingSellers[0]
      } else {
        const handle = company.key || `sel-${company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        seller = await sellerService.createSellers({
          name: company.name,
          handle,
        })
      }
    } catch (err) {
      // Seller module fallback
    }

    const output: ResolveOrCreateCompanyStepOutput = {
      companyId: company.id,
      companyName: company.name,
      idCompany: company.id_company || null,
      sellerId: seller?.id || company.id,
      isNewCompany,
    }

    return new StepResponse(output, { companyId: company.id, isNewCompany })
  },
  async (compensationData, { container }) => {
    if (compensationData?.isNewCompany && compensationData?.companyId) {
      const companyService: CompanyModuleService = container.resolve(MODULE_NAMES.COMPANY)
      await companyService.deleteCompanies(compensationData.companyId).catch(() => {})
    }
  }
)
