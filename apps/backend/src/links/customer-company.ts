import CustomerModule from "@medusajs/medusa/customer"
import CompanyModule from "../modules/company"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  CustomerModule.linkable.customer,
  CompanyModule.linkable.company
)
