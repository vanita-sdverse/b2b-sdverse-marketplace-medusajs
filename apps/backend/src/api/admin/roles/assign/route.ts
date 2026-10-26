import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { assignRoleOperation } from "../operations/assign-role"
import { removeRoleOperation } from "../operations/remove-role"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return assignRoleOperation(req, res)
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  return removeRoleOperation(req, res)
}
