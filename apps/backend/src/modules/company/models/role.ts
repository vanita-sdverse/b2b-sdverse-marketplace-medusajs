import { model } from "@medusajs/framework/utils"

export const Role = model.define("role", {
  id: model.id({ prefix: "role" }).primaryKey(),
  role_name: model.text().unique(),
  description: model.text().nullable(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
})

export default Role
