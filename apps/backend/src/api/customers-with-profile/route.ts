import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Gender, Salutation } from "../../modules/customer-profile/models/customer-profile"
import { createCustomerWithProfileWorkflow } from "../../workflows/customer-profile/workflows/create-customer-with-profile"

const createCustomerWithProfileSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company_name: z.string().nullable().optional(),
  company_id: z.string().nullable().optional(),
  fk_merchant_user: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  customer_reference: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
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
        company_name: parsed.company_name,
        phone: parsed.phone,
        metadata: parsed.metadata,
      },
      profile: {
        customer_reference: parsed.customer_reference,
        date_of_birth: parsed.date_of_birth,
        gender: parsed.gender,
        salutation: parsed.salutation,
        position: parsed.position,
        locale_code: parsed.locale_code,
        fk_merchant_user: parsed.fk_merchant_user || parsed.company_id,
        company_id: parsed.company_id,
        company_name: parsed.company_name,
        legacy_customer_id: parsed.legacy_customer_id,
        metadata: parsed.metadata,
      },
    },
  })

  res.status(201).json({ customer: result })
}
