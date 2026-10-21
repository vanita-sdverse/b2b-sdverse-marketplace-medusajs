import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { Gender, Salutation } from "../../../../../modules/customer-profile/models/customer-profile"
import { updateCustomerWithProfileWorkflow } from "../../../../../workflows/customer-profile/workflows/update-customer-with-profile"

const updateCustomerProfileSchema = z.object({
  customer: z
    .object({
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
      company_name: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    })
    .optional(),
  profile: z
    .object({
      date_of_birth: z.string().nullable().optional(),
      gender: z.nativeEnum(Gender).nullable().optional(),
      salutation: z.nativeEnum(Salutation).nullable().optional(),
      position: z.string().nullable().optional(),
      locale_code: z.string().nullable().optional(),
      metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    })
    .optional(),
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.params.id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = {
    entity: "customer",
    fields: [
      "id",
      "email",
      "first_name",
      "last_name",
      "company_name",
      "phone",
      "created_at",
      "updated_at",
      "customer_profile.*",
      "addresses.*",
    ],
    filters: { id: customerId },
  }

  const [customer] = (await remoteQuery(query)) as any[]

  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer with ID '${customerId}' not found.`
    )
  }

  res.status(200).json({
    customer,
    profile: customer.customer_profile || null,
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.params.id
  const parsed = updateCustomerProfileSchema.parse(req.body)

  const { result } = await updateCustomerWithProfileWorkflow(req.scope).run({
    input: {
      id: customerId,
      customer: parsed.customer,
      profile: parsed.profile,
    },
  })

  res.status(200).json({ result })
}
