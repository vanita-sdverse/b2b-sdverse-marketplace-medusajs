import { Module } from "@medusajs/framework/utils"
import CompanyModuleService from "./service"
import { MODULE_NAMES } from "../../constants"

export const COMPANY_MODULE = MODULE_NAMES.COMPANY

export default Module(COMPANY_MODULE, {
  service: CompanyModuleService,
})

export * from "./models/company"
export * from "./models/role"
export * from "./models/customer-role"
