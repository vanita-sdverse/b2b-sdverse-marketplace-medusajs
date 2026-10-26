import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getRoleOperation } from "../operations/get-role"
import { updateRoleOperation } from "../operations/update-role"
import { deleteRoleOperation } from "../operations/delete-role"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return getRoleOperation(req, res)
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  return updateRoleOperation(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return updateRoleOperation(req, res)
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  return deleteRoleOperation(req, res)
}
