import { model } from "@medusajs/framework/utils"

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

export const CustomerProfile = model.define("customer_profile", {
  id: model.id().primaryKey(),
  customer_reference: model.text().unique().searchable(),
  date_of_birth: model.text().nullable(),
  gender: model.enum(Gender).nullable(),
  salutation: model.enum(Salutation).nullable(),
  position: model.text().nullable(),
  locale_code: model.text().nullable(),
  fk_merchant_user: model.text().nullable(),
  company_id: model.text().nullable(),
  company_name: model.text().nullable(),
  anonymized_at: model.dateTime().nullable(),
  last_login: model.dateTime().nullable(),
  registered_at: model.dateTime().nullable(),
  fk_company: model.text().nullable(),
  created_by: model.text().nullable(),
  updated_by: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CustomerProfile
