import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import crypto from "crypto"

export async function editCustomerOperation(
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
  const existingProfiles = await profileService.listCustomerProfiles(
    { id_customer: numericId },
    { take: 1 }
  ).catch(() => [])

  const existing = existingProfiles[0]
  if (!existing) {
    return res.status(404).json({ message: `Customer '${rawId}' not found.` })
  }

  const body = req.body as any

  // 2. Resolve company update if company_id or company_name was provided
  let newFkCompany = existing.fk_company
  const companyNameOrId = body.company_id || body.fk_company || body.company_name

  if (companyNameOrId) {
    const allCompanies: any[] = (await companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]
    let targetCompany = allCompanies.find(
      (c) =>
        c.id === companyNameOrId ||
        String(c.id_company) === String(companyNameOrId) ||
        c.name.toLowerCase() === String(companyNameOrId).trim().toLowerCase()
    )

    if (!targetCompany && body.company_name?.trim()) {
      // Create new company if name was specified and does not exist
      const maxId = allCompanies.reduce((max: number, c: any) => Math.max(max, Number(c?.id_company) || 0), 0)
      const nextId = maxId + 1
      const key = body.company_name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `comp-${Date.now()}`
      targetCompany = await companyService.createCompanies({
        name: body.company_name.trim(),
        key: `${key}-${Date.now().toString().slice(-4)}`,
        uuid: crypto.randomUUID(),
        is_active: true,
        id_company: nextId,
        fk_owner: String(numericId),
      })
    }

    if (targetCompany?.id_company) {
      newFkCompany = targetCompany.id_company
    }
  }

  // 3. Build update object for sdv_customers
  const updatePayload: Record<string, any> = {
    id_customer: numericId,
  }

  if (body.first_name !== undefined) updatePayload.first_name = body.first_name
  if (body.last_name !== undefined) updatePayload.last_name = body.last_name
  if (body.email !== undefined) updatePayload.email = body.email
  if (body.phone !== undefined) updatePayload.phone = body.phone
  if (body.salutation !== undefined) updatePayload.salutation = body.salutation
  if (body.position !== undefined) updatePayload.position = body.position
  if (body.locale !== undefined || body.locale_code !== undefined) {
    updatePayload.locale = body.locale || body.locale_code
  }
  if (newFkCompany !== undefined) {
    updatePayload.fk_company = newFkCompany
  }

  // 4. Perform update
  const updated = await profileService.updateCustomerProfiles(updatePayload)

  // 5. Fetch resolved company name
  let resolvedCompanyName: string | null = null
  if (updated.fk_company) {
    const matched = await companyService.listCompanies({}, { take: 1000 }).catch(() => [])
    const found = (matched as any[]).find(
      (c) => c.id_company === updated.fk_company || String(c.id) === String(updated.fk_company)
    )
    resolvedCompanyName = found?.name || null
  }

  const result = {
    id: `cus_${updated.id_customer}`,
    id_customer: updated.id_customer,
    email: updated.email,
    first_name: updated.first_name,
    last_name: updated.last_name,
    name: `${updated.first_name || ""} ${updated.last_name || ""}`.trim(),
    phone: updated.phone,
    reference: updated.reference,
    customer_reference: updated.reference,
    salutation: updated.salutation,
    position: updated.position,
    locale: updated.locale,
    fk_company: updated.fk_company ? String(updated.fk_company) : null,
    company_name: resolvedCompanyName,
    company: resolvedCompanyName ? { id: updated.fk_company, name: resolvedCompanyName } : null,
    is_active: (updated as any).is_active ?? true,
    status: (updated as any).is_active === false ? "Inactive" : "Verified",
    updated_at: updated.updated_at,
  }

  return res.status(200).json({ customer: result, message: "Customer updated successfully" })
}
