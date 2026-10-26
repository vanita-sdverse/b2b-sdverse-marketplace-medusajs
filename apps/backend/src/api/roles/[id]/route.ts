import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { GetRoleOperation } from "../operations/get-role"
import { UpdateRoleOperation } from "../operations/update-role"
import { DeleteRoleOperation } from "../operations/delete-role"

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await GetRoleOperation.handle(req, res)
}

export async function PUT(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await UpdateRoleOperation.handle(req, res)
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  return await DeleteRoleOperation.handle(req, res)
}
