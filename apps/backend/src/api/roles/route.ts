import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ListRolesOperation } from "./operations/list-roles"
import { CreateRoleOperation } from "./operations/create-role"

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await ListRolesOperation.handle(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await CreateRoleOperation.handle(req, res)
}
