import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { Gender, Salutation } from "../../../modules/customer-profile/models/customer-profile"
import { generateCustomerReference } from "../../../modules/customer-profile/utils/generate-customer-reference"

export type UpdateCustomerProfileStepInput = {
  customer_id: string
  profileData: {
    salutation?: Salutation | null
    position?: string | null
    locale_code?: string | null
    metadata?: Record<string, unknown> | null
  }
}

type CompensationData = {
  action: "update" | "create"
  profileId: string | number
  previousState?: {
    salutation?: Salutation | null
    position?: string | null
    locale_code?: string | null
    metadata?: Record<string, unknown> | null
  }
}

export const updateCustomerProfileStep = createStep(
  "update-customer-profile-step",
  async (input: UpdateCustomerProfileStepInput, { container }) => {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)

    // Query existing linked customer_profile
    const query = {
      entity: "customer",
      fields: ["id", "customer_profile.*"],
      filters: { id: input.customer_id },
    }
    const [customer] = (await remoteQuery(query)) as any[]
    const existingProfile = customer?.customer_profile || customer?.sdv_customers
    const profilePk = existingProfile?.id_customer ?? existingProfile?.id

    if (profilePk) {
      // Store previous state for rollback compensation
      const previousState = {
        salutation: existingProfile.salutation,
        position: existingProfile.position,
        locale_code: existingProfile.locale_code,
        metadata: existingProfile.metadata,
      }

      const updated = await (service as any).updateCustomerProfiles({
        id_customer: profilePk,
        ...input.profileData,
      })

      const compensation: CompensationData = {
        action: "update",
        profileId: profilePk,
        previousState,
      }

      return new StepResponse(
        { profile: updated, isNew: false },
        compensation
      )
    } else {
      // Profile didn't exist yet, create and link it
      const newProfile = await (service as any).createCustomerProfiles({
        customer_reference: generateCustomerReference(),
        ...input.profileData,
      })
      const newProfilePk = (newProfile as any).id_customer ?? (newProfile as any).id

      await remoteLink.create([
        {
          [Modules.CUSTOMER]: {
            customer_id: input.customer_id,
          },
          [CUSTOMER_PROFILE_MODULE]: {
            sdv_customers_id_customer: newProfilePk,
          },
        },
      ])

      const compensation: CompensationData = {
        action: "create",
        profileId: newProfilePk,
      }

      return new StepResponse(
        { profile: newProfile, isNew: true },
        compensation
      )
    }
  },
  async (compensationData: CompensationData | undefined, { container }) => {
    if (!compensationData) return

    const service: CustomerProfileModuleService = container.resolve(CUSTOMER_PROFILE_MODULE)

    if (compensationData.action === "update" && compensationData.profileId && compensationData.previousState) {
      await (service as any).updateCustomerProfiles({
        id_customer: compensationData.profileId,
        ...compensationData.previousState,
      })
    } else if (compensationData.action === "create" && compensationData.profileId) {
      await (service as any).deleteCustomerProfiles(compensationData.profileId)
    }
  }
)
