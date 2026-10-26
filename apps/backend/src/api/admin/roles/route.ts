import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listRolesOperation } from "./operations/list-roles"
import { createRoleOperation } from "./operations/create-role"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return listRolesOperation(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return createRoleOperation(req, res)
}
