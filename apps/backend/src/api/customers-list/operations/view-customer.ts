import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"

export async function viewCustomerOperation(
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

  // 1. Fetch customer profile
  const profiles = await profileService.listCustomerProfiles(
    { id_customer: numericId },
    { take: 1 }
  ).catch(() => [])

  const profile = profiles[0]
  if (!profile) {
    return res.status(404).json({ message: `Customer '${rawId}' not found.` })
  }

  // 2. Fetch company info
  const companies = await companyService.listCompanies({}, { take: 1000 }).catch(() => [])
  const companyMap = new Map<string, any>()
  let ownedCompany: any = null

  for (const comp of companies) {
    companyMap.set(comp.id, comp)
    if ((comp as any).id_company) {
      companyMap.set(String((comp as any).id_company), comp)
    }
    if (String((comp as any).fk_owner) === String(numericId)) {
      ownedCompany = comp
    }
  }

  const rawFk = profile.fk_company ? String(profile.fk_company) : null
  const matchedCompany = rawFk ? companyMap.get(rawFk) : ownedCompany
  const resolvedName = matchedCompany?.name || (rawFk ? companyMap.get(rawFk)?.name || rawFk : null)
  const companyId = matchedCompany?.id || (matchedCompany?.id_company ? String(matchedCompany.id_company) : rawFk)

  // 3. Fetch customer roles
  const customerRoles = await companyService.listCustomerRoles(
    { id_customer: numericId },
    { take: 50 }
  ).catch(() => [])

  const allRoles = await companyService.listRoles({}, { take: 100 }).catch(() => [])
  const roleIdMap = new Map<string, any>()
  for (const r of allRoles) {
    roleIdMap.set(r.id, r)
  }

  const roles = customerRoles.map((cr: any) => {
    const roleObj = roleIdMap.get(cr.id_role)
    return {
      id: cr.id,
      role_id: cr.id_role,
      role_name: roleObj?.role_name || "Admin",
      description: roleObj?.description || null,
    }
  })

  // If no role assigned yet, fallback to Admin
  if (roles.length === 0) {
    roles.push({
      id: "default-admin",
      role_id: "role_admin",
      role_name: "Admin",
      description: "Default Administrator",
    })
  }

  const result = {
    id: `cus_${profile.id_customer}`,
    id_customer: profile.id_customer,
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
    phone: profile.phone,
    reference: profile.reference,
    customer_reference: profile.reference,
    salutation: profile.salutation,
    position: profile.position,
    locale: profile.locale,
    fk_company: rawFk || (matchedCompany?.id_company ? String(matchedCompany.id_company) : null),
    company_name: resolvedName,
    company: resolvedName ? { id: companyId, name: resolvedName } : null,
    roles,
    is_active: (profile as any).is_active ?? true,
    status: (profile as any).is_active === false ? "Inactive" : "Verified",
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  }

  return res.status(200).json({ customer: result })
}
