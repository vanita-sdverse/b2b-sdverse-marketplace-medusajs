import { createCustomerWithProfileWorkflow } from "../workflows/create-customer-with-profile"
import { updateCustomerWithProfileWorkflow } from "../workflows/update-customer-with-profile"
import { anonymizeCustomerWorkflow } from "../workflows/anonymize-customer"
import { validateCustomerInput } from "../steps/validate-customer-input"
import { Salutation } from "../../../modules/customer-profile/models/customer-profile"

describe("Customer Profile Workflows", () => {
  it("defines createCustomerWithProfileWorkflow", () => {
    expect(createCustomerWithProfileWorkflow).toBeDefined()
    expect(createCustomerWithProfileWorkflow.getName()).toBe("create-customer-with-profile")
  })

  it("defines updateCustomerWithProfileWorkflow", () => {
    expect(updateCustomerWithProfileWorkflow).toBeDefined()
    expect(updateCustomerWithProfileWorkflow.getName()).toBe("update-customer-with-profile")
  })

  it("defines anonymizeCustomerWorkflow", () => {
    expect(anonymizeCustomerWorkflow).toBeDefined()
    expect(anonymizeCustomerWorkflow.getName()).toBe("anonymize-customer")
  })

  describe("validateCustomerInput logic", () => {
    const mockContainer = {
      resolve: jest.fn().mockReturnValue({
        listCustomerProfiles: jest.fn().mockResolvedValue([]),
      }),
    }

    it("rejects invalid email addresses", async () => {
      await expect(
        validateCustomerInput(
          { customer: { email: "invalid-email" } },
          mockContainer
        )
      ).rejects.toThrow(/valid email address is required/)
    })

    it("validates and accepts valid customer and profile payload", async () => {
      const result = await validateCustomerInput(
        {
          customer: {
            email: "Test.User@example.com",
            first_name: "Test",
            last_name: "User",
          },
          profile: {
            salutation: Salutation.MS,
            position: "Engineer",
            locale_code: "en_US",
          },
        },
        mockContainer
      )

      expect(result).toBeDefined()
      expect(result.customer.email).toBe("test.user@example.com")
      expect(result.profile.customer_reference).toMatch(/^CUS-/)
      expect(result.profile.salutation).toBe("ms")
    })

    it("rejects invalid salutation enum values", async () => {
      await expect(
        validateCustomerInput(
          {
            customer: { email: "valid@example.com" },
            profile: { salutation: "alien" as any },
          },
          mockContainer
        )
      ).rejects.toThrow(/Invalid salutation/)
    })

    it("rejects duplicate customer references", async () => {
      const duplicateContainer = {
        resolve: jest.fn().mockReturnValue({
          listCustomerProfiles: jest.fn().mockResolvedValue([{ id: "prof_123" }]),
        }),
      }

      await expect(
        validateCustomerInput(
          {
            customer: { email: "valid@example.com" },
            profile: { customer_reference: "EXISTING_REF" },
          },
          duplicateContainer
        )
      ).rejects.toThrow(/already in use/)
    })
  })
})
