import {
  CUSTOMER_PROFILE_MODULE,
  CustomerProfile,
  Gender,
  Salutation,
  generateCustomerReference,
} from "../index"
import CustomerProfileModuleService from "../service"

describe("Customer Profile Module Unit Tests", () => {
  it("exports the correct module name", () => {
    expect(CUSTOMER_PROFILE_MODULE).toBe("customerProfile")
  })

  it("defines the CustomerProfile model with all required schema fields", () => {
    expect(CustomerProfile).toBeDefined()
    expect(CustomerProfile.name).toBe("CustomerProfile")

    const schema = (CustomerProfile as any).schema
    expect(schema).toBeDefined()
    expect(schema.id).toBeDefined()
    expect(schema.customer_reference).toBeDefined()
    expect(schema.date_of_birth).toBeDefined()
    expect(schema.gender).toBeDefined()
    expect(schema.salutation).toBeDefined()
    expect(schema.position).toBeDefined()
    expect(schema.locale_code).toBeDefined()
    expect(schema.anonymized_at).toBeDefined()
    expect(schema.last_login).toBeDefined()
    expect(schema.registered_at).toBeDefined()
    expect(schema.legacy_customer_id).toBeDefined()
  })

  it("has valid Gender semantic enum values", () => {
    expect(Gender.MALE).toBe("male")
    expect(Gender.FEMALE).toBe("female")
    expect(Gender.OTHER).toBe("other")
    expect(Gender.UNSPECIFIED).toBe("unspecified")
  })

  it("has valid Salutation semantic enum values", () => {
    expect(Salutation.MR).toBe("mr")
    expect(Salutation.MS).toBe("ms")
    expect(Salutation.MRS).toBe("mrs")
    expect(Salutation.DR).toBe("dr")
    expect(Salutation.OTHER).toBe("other")
  })

  it("exports a valid CustomerProfileModuleService class", () => {
    expect(CustomerProfileModuleService).toBeDefined()
    expect(typeof CustomerProfileModuleService).toBe("function")
  })

  describe("Customer Reference Generation", () => {
    it("generates a well-formed reference with default prefix", () => {
      const ref = generateCustomerReference()
      expect(ref).toMatch(/^CUS-[0-9A-Z]+-[0-9A-F]+$/)
    })

    it("supports custom prefix", () => {
      const ref = generateCustomerReference("WW")
      expect(ref.startsWith("WW-")).toBe(true)
    })

    it("generates unique values on consecutive calls", () => {
      const set = new Set<string>()
      for (let i = 0; i < 50; i++) {
        set.add(generateCustomerReference())
      }
      expect(set.size).toBe(50)
    })
  })
})
