import { model } from "@medusajs/framework/utils"
import { MODEL_PREFIXES } from "../../../constants"

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  UNSPECIFIED = "unspecified",
}

export enum Salutation {
  MR = "mr",
  MS = "ms",
  MRS = "mrs",
  DR = "dr",
  OTHER = "other",
}


export const CustomerProfile = model.define("sdv_customers", {
  id_customer: model.autoincrement().primaryKey(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  reference: model.text().searchable().nullable(),
  salutation: model.text().nullable(),
  email: model.text().searchable().nullable(),
  phone: model.text().nullable(),
  fk_company: model.number().nullable(),
  position: model.text().nullable(),
  locale: model.text().nullable(),
  reset_password_token: model.text().nullable(),
  is_active: model.boolean().default(true),
  anonymized_at: model.dateTime().nullable(),
  last_login: model.dateTime().nullable(),
  registered_at: model.dateTime().nullable(),
})

export const SdvCustomers = CustomerProfile
export default CustomerProfile

