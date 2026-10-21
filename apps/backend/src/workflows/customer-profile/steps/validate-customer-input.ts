import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"
import { generateCustomerReference } from "../../../modules/customer-profile/utils/generate-customer-reference"
import { SELLER_MODULE } from "../../../modules/seller"
import SellerModuleService from "../../../modules/seller/service"

export type ValidateCustomerInput = {
  customer: {
    email: string
    first_name?: string | null
    last_name?: string | null
    company_name?: string | null
    phone?: string | null
    metadata?: Record<string, unknown> | null
  }
  profile?: {
    customer_reference?: string | null
    date_of_birth?: string | null
    gender?: Gender | null
    salutation?: Salutation | null
    position?: string | null
    locale_code?: string | null
    fk_merchant_user?: string | null
    company_id?: string | null
    company_name?: string | null
    legacy_customer_id?: number | null
    metadata?: Record<string, unknown> | null
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function validateCustomerInput(
  input: ValidateCustomerInput,
  container: { resolve: (key: string) => any }
) {
  // 1. Email validation
  if (!input.customer?.email || !EMAIL_REGEX.test(input.customer.email.trim())) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "A valid email address is required to create a customer."
    )
  }

  // 2. Gender validation
  if (input.profile?.gender && !Object.values(Gender).includes(input.profile.gender)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid gender: '${input.profile.gender}'. Allowed values: ${Object.values(Gender).join(", ")}`
    )
  }

  // 3. Salutation validation
  if (input.profile?.salutation && !Object.values(Salutation).includes(input.profile.salutation)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid salutation: '${input.profile.salutation}'. Allowed values: ${Object.values(Salutation).join(", ")}`
    )
  }

  // 4. Date of birth validation (if present)
  if (input.profile?.date_of_birth) {
    const parsedDate = new Date(input.profile.date_of_birth)
    if (isNaN(parsedDate.getTime())) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid date_of_birth format. Expected valid date string (e.g. YYYY-MM-DD)."
      )
    }
  }

  // 5. Customer reference handling & uniqueness check
  const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
  let customerReference = input.profile?.customer_reference?.trim()

  if (customerReference) {
    const existing = await service.listCustomerProfiles({
      customer_reference: customerReference,
    })
    if (existing.length > 0) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `Customer reference '${customerReference}' is already in use.`
      )
    }
  } else {
    customerReference = generateCustomerReference()
  }

  // 6. Company & fk_merchant_user handling
  let resolvedCompanyId = input.profile?.company_id || input.profile?.fk_merchant_user || null
  let resolvedCompanyName = input.profile?.company_name || input.customer?.company_name || null

  try {
    const sellerService: SellerModuleService = container.resolve(SELLER_MODULE)

    if (resolvedCompanyId) {
      // Existing company ID provided -> verify existence
      const [existingSeller] = await sellerService.listSellers({ id: resolvedCompanyId })
      if (existingSeller) {
        resolvedCompanyName = existingSeller.name
      }
    } else if (resolvedCompanyName && resolvedCompanyName.trim().length > 0) {
      // Company name provided -> check if company exists or create new
      const trimmedName = resolvedCompanyName.trim()
      const existingSellers = await sellerService.listSellers({ name: trimmedName })

      if (existingSellers.length > 0) {
        resolvedCompanyId = existingSellers[0].id
      } else {
        // Create new seller/company
        const handle = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `comp-${Date.now()}`
        const createdSeller = await sellerService.createSellers({
          name: trimmedName,
          handle,
        })
        resolvedCompanyId = createdSeller.id
      }
    }
  } catch (err) {
    // If seller module is not available or error, keep values gracefully
  }

  const validatedCustomerData = {
    ...input.customer,
    email: input.customer.email.trim().toLowerCase(),
    company_name: resolvedCompanyName,
  }

  const validatedProfileData = {
    ...input.profile,
    customer_reference: customerReference,
    company_id: resolvedCompanyId,
    company_name: resolvedCompanyName,
    fk_merchant_user: resolvedCompanyId,
  }

  return {
    customer: validatedCustomerData,
    profile: validatedProfileData,
  }
}

export const validateCustomerInputStep = createStep(
  "validate-customer-input-step",
  async (input: ValidateCustomerInput, { container }) => {
    const validated = await validateCustomerInput(input, container)
    return new StepResponse(validated)
  }
)
