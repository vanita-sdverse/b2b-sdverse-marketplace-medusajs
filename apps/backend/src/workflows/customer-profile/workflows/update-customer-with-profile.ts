import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { updateCustomersStep } from "@medusajs/core-flows"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"
import { updateCustomerProfileStep } from "../steps/update-customer-profile"

export type UpdateCustomerWithProfileWorkflowInput = {
  id: string
  customer?: {
    first_name?: string | null
    last_name?: string | null
    company_name?: string | null
    phone?: string | null
    metadata?: Record<string, unknown> | null
  }
  profile?: {
    salutation?: Salutation | null
    position?: string | null
    locale_code?: string | null
    metadata?: Record<string, unknown> | null
  }
}

export const updateCustomerWithProfileWorkflow = createWorkflow(
  "update-customer-with-profile",
  function (input: UpdateCustomerWithProfileWorkflowInput) {
    // 1. Update customer profile
    const profileStepInput = transform(input, (data) => ({
      customer_id: data.id,
      profileData: data.profile || {},
    }))

    const profileResult = updateCustomerProfileStep(profileStepInput)

    // 2. Update core customer fields
    const updateCustomerInput = transform(input, (data) => ({
      selector: { id: data.id },
      update: data.customer || {},
    }))

    updateCustomersStep(updateCustomerInput)

    const response = transform(
      { input, profileResult },
      (data) => ({
        customer_id: data.input.id,
        profile: data.profileResult.profile,
      })
    )

    return new WorkflowResponse(response)
  }
)
