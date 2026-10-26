import { model } from "@medusajs/framework/utils"
import { MODEL_PREFIXES } from "../../../constants"

export const Company = model.define("sdv_company", {
  id: model.id({ prefix: MODEL_PREFIXES.COMPANY }).primaryKey(),
  id_company: model.number().nullable(),
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

export const SdvCompany = Company
export default Company
