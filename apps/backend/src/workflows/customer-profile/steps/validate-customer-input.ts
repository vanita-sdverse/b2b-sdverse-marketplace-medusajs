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
    reference?: string | null
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


  // 3. Salutation validation
  if (input.profile?.salutation && !Object.values(Salutation).includes(input.profile.salutation as Salutation)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid salutation: '${input.profile.salutation}'. Allowed values: ${Object.values(Salutation).join(", ")}`
    )
  }

  // 5. Customer reference handling & uniqueness check
  const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
  let customerReference = (input.profile?.reference || input.profile?.customer_reference)?.trim()

  if (customerReference) {
    const existing = await service.listCustomerProfiles({
      reference: customerReference,
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

  const { company_name: _cName, ...cleanCustomerData } = (input.customer || {}) as any
  const validatedCustomerData = {
    ...cleanCustomerData,
    email: input.customer.email.trim().toLowerCase(),
    metadata: {
      ...(input.customer?.metadata || {}),
      ...(_cName ? { company_name: _cName } : {}),
    },
  }

  const parsedFkCompany = input.profile?.fk_company
    ? typeof input.profile.fk_company === "number"
      ? input.profile.fk_company
      : parseInt(String(input.profile.fk_company), 10) || null
    : null

  const validatedProfileData = {
    ...input.profile,
    reference: customerReference,
    customer_reference: customerReference,
    fk_company: parsedFkCompany,
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
