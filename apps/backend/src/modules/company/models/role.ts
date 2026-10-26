import { model } from "@medusajs/framework/utils"
import { MODEL_PREFIXES } from "../../../constants"

export const Role = model.define("role", {
  id: model.id({ prefix: MODEL_PREFIXES.ROLE }).primaryKey(),
  role_name: model.text().unique(),
  description: model.text().nullable(),
  permissions: model.json().nullable(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
})

export default Role
