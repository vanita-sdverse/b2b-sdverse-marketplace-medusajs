import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { createCustomersStep, createRemoteLinkStep } from "@medusajs/core-flows"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import {
  validateCustomerInputStep,
  ValidateCustomerInput,
} from "../steps/validate-customer-input"
import { createCustomerProfileStep } from "../steps/create-customer-profile"

export const createCustomerWithProfileWorkflow = createWorkflow(
  "create-customer-with-profile",
  function (input: ValidateCustomerInput) {
    const validated = validateCustomerInputStep(input)

    const customerInput = transform(validated, (data) => [data.customer])
    const customers = createCustomersStep(customerInput)

    const profileInput = transform(validated, (data) => data.profile)
    const profile = createCustomerProfileStep(profileInput)

    const linkData = transform(
      { customer: customers, profile },
      (data) => [
        {
          [Modules.CUSTOMER]: {
            customer_id: data.customer[0].id,
          },
          [CUSTOMER_PROFILE_MODULE]: {
            customer_profile_id: data.profile.id,
          },
        },
      ]
    )

    createRemoteLinkStep(linkData)

    const response = transform(
      { customer: customers, profile },
      (data) => ({
        ...data.customer[0],
        customer_profile: data.profile,
      })
    )

    return new WorkflowResponse(response)
  }
)
