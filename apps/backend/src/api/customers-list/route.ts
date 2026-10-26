import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_PROFILE_MODULE } from "../../modules/customer-profile"
import CustomerProfileModuleService from "../../modules/customer-profile/service"
import { MODULE_NAMES } from "../../constants"
import CompanyModuleService from "../../modules/company/service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const profileService: CustomerProfileModuleService = req.scope.resolve(CUSTOMER_PROFILE_MODULE)
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)

  // 1. Fetch from sdv_customers table
  const profiles = await profileService.listCustomerProfiles({}, { take: 1000 }).catch(() => [])

  // 2. Fetch companies to resolve company names
  const companies = await companyService.listCompanies({}, { take: 1000 }).catch(() => [])
  const companyMap = new Map<string, any>()
  const ownerCompanyMap = new Map<string, any>()

  for (const comp of companies) {
    companyMap.set(comp.id, comp)
    if ((comp as any).id_company) {
      companyMap.set(String((comp as any).id_company), comp)
    }
    if ((comp as any).fk_owner) {
      ownerCompanyMap.set(String((comp as any).fk_owner), comp)
    }
  }

  const customers = profiles.map((p: any) => {
    const rawFk = p.fk_company ? String(p.fk_company) : null
    let matchedCompany = rawFk ? companyMap.get(rawFk) : null
    if (!matchedCompany && p.id_customer) {
      matchedCompany = ownerCompanyMap.get(String(p.id_customer))
    }

    const resolvedName = matchedCompany?.name || (rawFk ? companyMap.get(rawFk)?.name || rawFk : null)
    const companyId = matchedCompany?.id || (matchedCompany?.id_company ? String(matchedCompany.id_company) : rawFk)

    return {
      id: `cus_${p.id_customer}`,
      id_customer: p.id_customer,
      email: p.email,
      first_name: p.first_name,
      last_name: p.last_name,
      name: `${p.first_name || ""} ${p.last_name || ""}`.trim(),
      phone: p.phone,
      reference: p.reference,
      customer_reference: p.reference,
      salutation: p.salutation,
      position: p.position,
      locale: p.locale,
      fk_company: rawFk || (matchedCompany?.id_company ? String(matchedCompany.id_company) : null),
      company_name: resolvedName,
      company: resolvedName ? { id: companyId, name: resolvedName } : null,
      is_active: p.is_active ?? true,
      status: p.is_active === false ? "Inactive" : "Verified",
      created_at: p.created_at,
      updated_at: p.updated_at,
    }
  })

  res.status(200).json({ customers })
}
