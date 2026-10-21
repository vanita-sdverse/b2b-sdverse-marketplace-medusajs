import { Module } from "@medusajs/framework/utils"
import CompanyModuleService from "./service"

export const COMPANY_MODULE = "companyModuleService"

export default Module(COMPANY_MODULE, {
  service: CompanyModuleService,
})

export * from "./models/company"
export * from "./models/role"
export * from "./models/customer-role"
