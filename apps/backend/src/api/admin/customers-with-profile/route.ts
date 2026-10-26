import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"
import { createCustomerWithProfileWorkflow } from "../../../workflows/customer-profile/workflows/create-customer-with-profile"

const createCustomerWithProfileSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company_name: z.string().nullable().optional(),
  fk_company: z.string().nullable().optional(),
  company_id: z.string().nullable().optional(),
  fk_merchant_user: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  customer_reference: z.string().nullable().optional(),
  salutation: z.nativeEnum(Salutation).nullable().optional(),
  position: z.string().nullable().optional(),
  locale_code: z.string().nullable().optional(),
  legacy_customer_id: z.number().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const parsed = createCustomerWithProfileSchema.parse(req.body)

  const { result } = await createCustomerWithProfileWorkflow(req.scope).run({
    input: {
      customer: {
        email: parsed.email,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        phone: parsed.phone,
        metadata: parsed.metadata,
      },
      profile: {
        customer_reference: parsed.customer_reference,
        salutation: parsed.salutation,
        position: parsed.position,
        locale_code: parsed.locale_code,
        company_name: parsed.company_name,
        fk_merchant_user: parsed.fk_merchant_user,
        company_id: parsed.company_id,
        fk_company: parsed.fk_company || parsed.company_id,
        legacy_customer_id: parsed.legacy_customer_id,
        metadata: parsed.metadata,
      },
    },
  })

  res.status(201).json({ customer: result })
}
