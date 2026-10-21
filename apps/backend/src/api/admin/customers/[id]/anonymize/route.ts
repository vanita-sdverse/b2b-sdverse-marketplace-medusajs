import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { anonymizeCustomerWorkflow } from "../../../../../workflows/customer-profile/workflows/anonymize-customer"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.params.id

  const { result } = await anonymizeCustomerWorkflow(req.scope).run({
    input: {
      id: customerId,
    },
  })

  res.status(200).json({ anonymized: result })
}
