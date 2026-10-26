import {
  MODULE_NAMES,
  MARKETPLACE_ROLES,
  MARKETPLACE_ROLE_DESCRIPTIONS,
  MODEL_PREFIXES,
  COMPANY_DEFAULTS,
} from "../../../constants"
import CompanyModule, {
  COMPANY_MODULE,
  Company,
  Role,
  CustomerRole,
} from "../index"
import CompanyModuleService from "../service"

describe("Company Module Unit Tests", () => {
  describe("Module Definition and Exports", () => {
    it("exports the correct module name from shared constants", () => {
      expect(COMPANY_MODULE).toBe(MODULE_NAMES.COMPANY)
      expect(COMPANY_MODULE).toBe("company")
    })

    it("exports a valid Medusa module definition", () => {
      expect(CompanyModule).toBeDefined()
      expect(CompanyModule.linkable).toBeDefined()
      expect(CompanyModule.linkable.sdvCompany).toBeDefined()
    })

    it("exports CompanyModuleService class", () => {
      expect(CompanyModuleService).toBeDefined()
      expect(typeof CompanyModuleService).toBe("function")
    })
  })

  describe("Company Model Schema", () => {
    it("defines the Company model with correct name and prefix", () => {
      expect(Company).toBeDefined()
      expect(Company.name).toBe("SdvCompany")

      const parsedId = (Company as any).schema.id.parse("id")
      expect(parsedId.primaryKey).toBe(true)
      expect(parsedId.dataType.options.prefix).toBe(MODEL_PREFIXES.COMPANY)
      expect(parsedId.dataType.options.prefix).toBe("comp")
    })

    it("defines all required Company business and audit fields", () => {
      const schema = (Company as any).schema
      expect(schema.fk_owner).toBeDefined()
      expect(schema.attributes).toBeDefined()
      expect(schema.is_active).toBeDefined()
      expect(schema.key).toBeDefined()
      expect(schema.name).toBeDefined()
      expect(schema.subscription_expiration_date).toBeDefined()
      expect(schema.uuid).toBeDefined()
      expect(schema.id_company).toBeDefined()
      expect(schema.created_by).toBeDefined()
      expect(schema.updated_by).toBeDefined()
    })

    it("sets Company key as unique and is_active default to true", () => {
      const schema = (Company as any).schema
      const parsedKey = schema.key.parse("key")
      expect(parsedKey.indexes.some((idx: any) => idx.type === "unique")).toBe(true)

      const parsedActive = schema.is_active.parse("is_active")
      expect(parsedActive.defaultValue).toBe(true)
    })
  })

  describe("Role Model Schema", () => {
    it("defines the Role model with correct name and prefix", () => {
      expect(Role).toBeDefined()
      expect(Role.name).toBe("Role")

      const parsedId = (Role as any).schema.id.parse("id")
      expect(parsedId.primaryKey).toBe(true)
      expect(parsedId.dataType.options.prefix).toBe(MODEL_PREFIXES.ROLE)
      expect(parsedId.dataType.options.prefix).toBe("role")
    })

    it("defines all required Role fields and audit columns", () => {
      const schema = (Role as any).schema
      expect(schema.role_name).toBeDefined()
      const parsedRoleName = schema.role_name.parse("role_name")
      expect(parsedRoleName.indexes.some((idx: any) => idx.type === "unique")).toBe(true)

      expect(schema.description).toBeDefined()
      expect(schema.created_by).toBeDefined()
      expect(schema.updated_by).toBeDefined()
    })
  })

  describe("CustomerRole Model Schema", () => {
    it("defines CustomerRole model with correct name and prefix", () => {
      expect(CustomerRole).toBeDefined()
      expect(CustomerRole.name).toBe("SdvCustomerRole")

      const parsedId = (CustomerRole as any).schema.id.parse("id")
      expect(parsedId.primaryKey).toBe(true)
      expect(parsedId.dataType.options.prefix).toBe(MODEL_PREFIXES.CUSTOMER_ROLE)
      expect(parsedId.dataType.options.prefix).toBe("crole")
    })

    it("defines customer and role foreign keys and audit columns", () => {
      const schema = (CustomerRole as any).schema
      expect(schema.id_customer).toBeDefined()
      const parsedIdCustomer = schema.id_customer.parse("id_customer")
      expect(parsedIdCustomer.dataType.name).toBe("number")
      expect(schema.id_role).toBeDefined()
      expect(schema.created_by).toBeDefined()
      expect(schema.updated_by).toBeDefined()
    })
  })

  describe("Shared Constants & Marketplace Roles", () => {
    it("defines exactly 5 distinct marketplace roles", () => {
      const roles = Object.values(MARKETPLACE_ROLES)
      expect(roles).toHaveLength(5)
      expect(new Set(roles).size).toBe(5)
      expect(roles).toContain("Admin")
      expect(roles).toContain("Product Creator")
      expect(roles).toContain("Product Activator")
      expect(roles).toContain("Inquiry Approver")
      expect(roles).toContain("Product Consumer")
    })

    it("has detailed descriptions for each marketplace role", () => {
      for (const role of Object.values(MARKETPLACE_ROLES)) {
        expect(MARKETPLACE_ROLE_DESCRIPTIONS[role]).toBeDefined()
        expect(MARKETPLACE_ROLE_DESCRIPTIONS[role].length).toBeGreaterThan(10)
      }
    })

    it("defines company subscription duration default of 365 days", () => {
      expect(COMPANY_DEFAULTS.SUBSCRIPTION_DURATION_DAYS).toBe(365)
    })

    it("defines expected model prefixes", () => {
      expect(MODEL_PREFIXES.COMPANY).toBe("comp")
      expect(MODEL_PREFIXES.ROLE).toBe("role")
      expect(MODEL_PREFIXES.CUSTOMER_ROLE).toBe("crole")
      expect(MODEL_PREFIXES.CUSTOMER_PROFILE).toBe("cprof")
    })
  })
})
