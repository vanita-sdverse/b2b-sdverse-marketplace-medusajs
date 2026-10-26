import { MedusaService } from "@medusajs/framework/utils"
import CustomerProfile from "./models/customer-profile"

class CustomerProfileModuleService extends MedusaService({
  CustomerProfile,
  SdvCustomers: CustomerProfile,
}) {}

export default CustomerProfileModuleService
