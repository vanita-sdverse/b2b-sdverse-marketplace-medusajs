import { model } from "@medusajs/framework/utils"
import { MODEL_PREFIXES } from "../../../constants"

export const CustomerRole = model.define("sdv_customer_role", {
  id: model.id({ prefix: MODEL_PREFIXES.CUSTOMER_ROLE }).primaryKey(),
  id_customer: model.number(),
  id_role: model.text(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
})

export const SdvCustomerRole = CustomerRole
export default CustomerRole
