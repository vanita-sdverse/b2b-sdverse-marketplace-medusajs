import { model } from "@medusajs/framework/utils"

export enum SellerStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}

export const Seller = model.define("seller", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
  status: model.enum(SellerStatus).default(SellerStatus.PENDING),
})

export default Seller
