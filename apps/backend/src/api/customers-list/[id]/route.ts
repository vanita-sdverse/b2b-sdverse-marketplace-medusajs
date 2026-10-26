import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { viewCustomerOperation } from "../operations/view-customer"
import { editCustomerOperation } from "../operations/edit-customer"
import { deleteCustomerOperation } from "../operations/delete-customer"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  return await viewCustomerOperation(req, res)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  return await editCustomerOperation(req, res)
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  return await editCustomerOperation(req, res)
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  return await deleteCustomerOperation(req, res)
}
