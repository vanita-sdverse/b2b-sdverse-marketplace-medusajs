import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GetCompanyOperation } from "../operations/get-company"
import { UpdateCompanyOperation } from "../operations/update-company"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return await GetCompanyOperation.handle(req, res)
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  return await UpdateCompanyOperation.handle(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await UpdateCompanyOperation.handle(req, res)
}
