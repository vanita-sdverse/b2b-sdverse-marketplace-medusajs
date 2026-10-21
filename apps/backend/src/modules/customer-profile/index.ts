import { Module } from "@medusajs/framework/utils"
import CustomerProfileModuleService from "./service"

export const CUSTOMER_PROFILE_MODULE = "customerProfile"

export default Module(CUSTOMER_PROFILE_MODULE, {
  service: CustomerProfileModuleService,
})

export * from "./models/customer-profile"
export * from "./utils/generate-customer-reference"
