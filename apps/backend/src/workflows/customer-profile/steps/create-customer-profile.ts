import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"

export type CreateCustomerProfileStepInput = {
  customer_reference: string
  date_of_birth?: string | null
  gender?: Gender | null
  salutation?: Salutation | null
  position?: string | null
  locale_code?: string | null
  fk_merchant_user?: string | null
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
    const profile = await service.createCustomerProfiles(input)
    return new StepResponse(profile, profile.id)
  },
  async (profileId, { container }) => {
    if (!profileId) {
      return
    }
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
    await service.deleteCustomerProfiles(profileId)
  }
)
