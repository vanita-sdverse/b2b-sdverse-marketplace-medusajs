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
  fk_company: z.union([z.string(), z.number()]).nullable().optional(),
  phone: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  salutation: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  send_password_reset_email: z.boolean().nullable().optional(),
  reset_password_token: z.string().nullable().optional(),
})

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const parsed = createCustomerWithProfileSchema.parse(req.body)

  const generatedToken = parsed.send_password_reset_email
    ? `reset_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`
    : parsed.reset_password_token || null

  const resolvedCompanyId = parsed.company_id || (typeof parsed.fk_company === "string" ? parsed.fk_company : null) || parsed.fk_merchant_user || null

  const { result } = await createCustomerWithProfileWorkflow(req.scope).run({
    input: {
      customer: {
        email: parsed.email,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        company_name: parsed.company_name || null,
        phone: parsed.phone,
      },
      profile: {
        reference: parsed.reference,
        customer_reference: parsed.reference,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        email: parsed.email,
        phone: parsed.phone,
        company_name: parsed.company_name || null,
        company_id: resolvedCompanyId,
        fk_merchant_user: resolvedCompanyId,
        salutation: parsed.salutation as Salutation,
        position: parsed.position,
        locale: parsed.locale,
        locale_code: parsed.locale,
        reset_password_token: generatedToken,
        fk_company: parsed.fk_company ? (typeof parsed.fk_company === "number" ? parsed.fk_company : parseInt(parsed.fk_company, 10) || null) : null,
      },
    },
  })

  res.status(201).json({ customer: result, password_reset_sent: !!parsed.send_password_reset_email })
}
