import CustomerModule from "@medusajs/medusa/customer"
import CustomerProfileModule from "../modules/customer-profile"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: CustomerModule.linkable.customer,
    deleteCascade: true,
  },
  CustomerProfileModule.linkable.customerProfile
)
