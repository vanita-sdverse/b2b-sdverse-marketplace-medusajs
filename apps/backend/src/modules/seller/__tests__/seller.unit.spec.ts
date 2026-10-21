import { SELLER_MODULE, Seller, SellerStatus } from "../index"
import SellerModuleService from "../service"

describe("Seller Module Unit Tests", () => {
  it("exports the correct module name", () => {
    expect(SELLER_MODULE).toBe("seller")
  })

  it("defines the Seller model with required schema fields", () => {
    expect(Seller).toBeDefined()
    expect(Seller.name).toBe("Seller")

    const schema = (Seller as any).schema
    expect(schema).toBeDefined()
    expect(schema.id).toBeDefined()
    expect(schema.name).toBeDefined()
    expect(schema.handle).toBeDefined()
    expect(schema.status).toBeDefined()
  })

  it("has valid SellerStatus enum values", () => {
    expect(SellerStatus.PENDING).toBe("pending")
    expect(SellerStatus.ACTIVE).toBe("active")
    expect(SellerStatus.SUSPENDED).toBe("suspended")
    expect(SellerStatus.INACTIVE).toBe("inactive")
  })

  it("exports a valid SellerModuleService class", () => {
    expect(SellerModuleService).toBeDefined()
    expect(typeof SellerModuleService).toBe("function")
  })
})
