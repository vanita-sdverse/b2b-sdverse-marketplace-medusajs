import { MedusaService } from "@medusajs/framework/utils"
import Company from "./models/company"
import Role from "./models/role"
import CustomerRole from "./models/customer-role"

class CompanyModuleService extends MedusaService({
  Company,
  SdvCompany: Company,
  Role,
  CustomerRole,
  SdvCustomerRole: CustomerRole,
}) {}

export default CompanyModuleService
