import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ListCompaniesOperation } from "./operations/list-companies"
import { MODULE_NAMES } from "../../constants"
import CompanyModuleService from "../../modules/company/service"
import crypto from "crypto"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  return await ListCompaniesOperation.handle(req, res)
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const companyService: CompanyModuleService = req.scope.resolve(MODULE_NAMES.COMPANY)
  const body = (req.body || {}) as any
  const name = body.name?.trim()

  if (!name) {
    res.status(400).json({ message: "Company name is required." })
    return
  }

  // Calculate next id_company integer
  const allExisting: any[] = (await companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]
  const maxId = allExisting.reduce((max: number, c: any) => Math.max(max, Number(c?.id_company) || 0), 0)
  const nextId = maxId + 1

  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `comp-${Date.now()}`
  const created = await companyService.createCompanies({
    name,
    key: `${key}-${Date.now().toString().slice(-4)}`,
    uuid: crypto.randomUUID(),
    is_active: true,
    id_company: nextId,
    subscription_expiration_date: body.subscription_expiration_date
      ? new Date(body.subscription_expiration_date)
      : null,
    attributes: body.attributes || {},
  })

  res.status(201).json({ company: created })
}
