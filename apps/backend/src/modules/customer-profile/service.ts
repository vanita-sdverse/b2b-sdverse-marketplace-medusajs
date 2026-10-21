import { MedusaService } from "@medusajs/framework/utils"
import CustomerProfile from "./models/customer-profile"

class CustomerProfileModuleService extends MedusaService({
  CustomerProfile,
}) {}

export default CustomerProfileModuleService
