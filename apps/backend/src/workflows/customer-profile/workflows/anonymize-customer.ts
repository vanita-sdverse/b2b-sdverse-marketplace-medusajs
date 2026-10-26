import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { updateCustomersStep } from "@medusajs/core-flows"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"

export type AnonymizeCustomerInput = {
  id: string
}

const recordAnonymizationTimestampStep = createStep(
  "record-anonymization-timestamp-step",
  async (customerId: string, { container }) => {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)

    const query = {
      entity: "customer",
      fields: ["id", "customer_profile.*"],
      filters: { id: customerId },
    }
    const [customer] = (await remoteQuery(query)) as any[]
    const existingProfile = customer?.customer_profile || customer?.sdv_customers
    const profilePk = existingProfile?.id_customer ?? existingProfile?.id

    if (!profilePk) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No profile found for customer '${customerId}'`
      )
    }

    const previousAnonymizedAt = existingProfile.anonymized_at
    const now = new Date()

    const updated = await (service as any).updateCustomerProfiles({
      id_customer: profilePk,
      anonymized_at: now,
      position: null,
    })

    return new StepResponse(updated, { profileId: profilePk, previousAnonymizedAt })
  },
  async (compensationData, { container }) => {
    if (!compensationData) return
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)
    await (service as any).updateCustomerProfiles({
      id_customer: compensationData.profileId,
      anonymized_at: compensationData.previousAnonymizedAt,
    })
  }
)

export const anonymizeCustomerWorkflow = createWorkflow(
  "anonymize-customer",
  function (input: AnonymizeCustomerInput) {
    // 1. Redact PII in Medusa core customer using transform
    const updateCustomerInput = transform(input, (data) => ({
      selector: { id: data.id },
      update: {
        first_name: "Anonymized",
        last_name: "Customer",
        email: `anonymized-${data.id}@deleted.invalid`,
        phone: null,
      },
    }))

    updateCustomersStep(updateCustomerInput)

    // 2. Record timestamp and redact sensitive profile attributes
    const customerIdInput = transform(input, (data) => data.id)
    const updatedProfile = recordAnonymizationTimestampStep(customerIdInput)

    const response = transform(
      { input, updatedProfile },
      (data) => ({
        customer_id: data.input.id,
        profile: data.updatedProfile,
      })
    )

    return new WorkflowResponse(response)
  }
)
