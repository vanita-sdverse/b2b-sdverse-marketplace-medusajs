import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"

export async function deactivateCustomerOperation(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const rawId = req.params.id
  const numericId = parseInt(rawId.replace(/^cus_/, ""), 10)

  if (!numericId || isNaN(numericId)) {
    return res.status(400).json({ message: `Invalid customer ID format: '${rawId}'` })
  }

  const profileService: CustomerProfileModuleService = req.scope.resolve(CUSTOMER_PROFILE_MODULE)

  // 1. Fetch current customer
  const profiles = await profileService.listCustomerProfiles(
    { id_customer: numericId },
    { take: 1 }
  ).catch(() => [])

  const current = profiles[0]
  if (!current) {
    return res.status(404).json({ message: `Customer '${rawId}' not found.` })
  }

  // 2. Determine new status: if is_active provided in body, use it; otherwise toggle
  const body = (req.body as any) || {}
  const currentStatus = (current as any).is_active ?? true
  const newActiveStatus = body.is_active !== undefined ? Boolean(body.is_active) : !currentStatus

  // 3. Update customer profile
  const updated = await profileService.updateCustomerProfiles({
    id_customer: numericId,
    is_active: newActiveStatus,
    anonymized_at: newActiveStatus ? null : new Date(),
  })

  const statusLabel = newActiveStatus ? "Active" : "Deactivated"

  return res.status(200).json({
    id: `cus_${updated.id_customer}`,
    id_customer: updated.id_customer,
    is_active: (updated as any).is_active,
    status: (updated as any).is_active ? "Verified" : "Inactive",
    message: `Customer ${statusLabel.toLowerCase()} successfully`,
  })
}
