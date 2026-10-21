import { model } from "@medusajs/framework/utils"

export const CustomerRole = model.define("customer_role", {
  id: model.id({ prefix: "crole" }).primaryKey(),
  id_customer: model.text(),
  id_role: model.text(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
})

export default CustomerRole
