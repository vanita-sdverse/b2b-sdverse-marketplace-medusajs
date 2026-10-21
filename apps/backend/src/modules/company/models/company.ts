import { model } from "@medusajs/framework/utils"

export const Company = model.define("company", {
  id: model.id({ prefix: "comp" }).primaryKey(),
  fk_owner: model.text().nullable(),
  attributes: model.json().nullable(),
  is_active: model.boolean().default(true),
  key: model.text().unique(),
  name: model.text(),
  subscription_expiration_date: model.dateTime().nullable(),
  uuid: model.text(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
})

export default Company
