import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"

export type CreateCustomerProfileStepInput = {
  customer_reference?: string | null
  reference?: string | null
  id_customer?: number | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  salutation?: Salutation | string | null
  position?: string | null
  locale?: string | null
  locale_code?: string | null
  reset_password_token?: string | null
  fk_merchant_user?: string | null
  fk_company?: number | string | null
  company_id?: string | null
  company_name?: string | null
  anonymized_at?: Date | null
  last_login?: Date | null
  registered_at?: Date | null
  legacy_customer_id?: number | null
  metadata?: Record<string, unknown> | null
}

export const createCustomerProfileStep = createStep(
  "create-customer-profile-step",
  async (input: CreateCustomerProfileStepInput, { container }) => {
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
    const cleanProfileInput = {
      first_name: input.first_name,
      last_name: input.last_name,
      reference: input.reference || input.customer_reference,
      salutation: input.salutation,
      email: input.email,
      phone: input.phone,
      fk_company: input.fk_company ? (typeof input.fk_company === "number" ? input.fk_company : parseInt(String(input.fk_company), 10) || null) : null,
      position: input.position,
      locale: input.locale || input.locale_code,
      reset_password_token: input.reset_password_token,
      anonymized_at: input.anonymized_at,
      last_login: input.last_login,
      registered_at: input.registered_at,
    }
    const profile = await (service as any).createCustomerProfiles(cleanProfileInput)
    const profilePk = (profile as any).id_customer ?? (profile as any).id
    return new StepResponse(profile, profilePk)
  },
  async (profileId, { container }) => {
    if (!profileId) {
      return
    }
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
    await (service as any).deleteCustomerProfiles(profileId)
  }
)
