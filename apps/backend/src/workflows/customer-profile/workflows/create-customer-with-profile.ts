import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  validateCustomerInputStep,
  ValidateCustomerInput,
} from "../steps/validate-customer-input"
import {
  createCustomerProfileStep,
  CreateCustomerProfileStepInput,
} from "../steps/create-customer-profile"
import {
  resolveOrCreateCompanyStep,
} from "../steps/resolve-or-create-company"
import {
  assignCompanyAdminRoleStep,
} from "../steps/assign-company-admin-role"

export const createCustomerWithProfileWorkflow = createWorkflow(
  "create-customer-with-profile",
  function (input: ValidateCustomerInput) {
    // 1. Validate customer & profile payload
    const validated = validateCustomerInputStep(input)

    // 2. Resolve or create company FIRST
    const companyInput = transform(validated, (data) => ({
      company_name:
        (data.profile as any)?.company_name ||
        (data.customer as any)?.company_name ||
        null,
      company_id:
        (data.profile as any)?.company_id ||
        (data.profile as any)?.fk_company ||
        (data.profile as any)?.fk_merchant_user ||
        null,
      fk_merchant_user: (data.profile as any)?.fk_merchant_user || null,
      hiring_date:
        (data.profile as any)?.hiring_date ||
        (data.customer as any)?.hiring_date ||
        new Date().toISOString(),
    }))
    const companyResult = resolveOrCreateCompanyStep(companyInput)

    // 3. Persist ONLY in sdv_customers table (do not persist in customer table)
    const profileInput = transform({ validated, companyResult }, (data) => ({
      first_name: data.validated.customer.first_name || (data.validated.profile as any)?.first_name || null,
      last_name: data.validated.customer.last_name || (data.validated.profile as any)?.last_name || null,
      email: data.validated.customer.email || (data.validated.profile as any)?.email || null,
      phone: data.validated.customer.phone || (data.validated.profile as any)?.phone || null,
      reference:
        (data.validated.profile as any)?.reference ||
        (data.validated.profile as any)?.customer_reference ||
        null,
      salutation: (data.validated.profile as any)?.salutation || null,
      position: (data.validated.profile as any)?.position || null,
      locale: (data.validated.profile as any)?.locale || (data.validated.profile as any)?.locale_code || "en_US",
      reset_password_token: (data.validated.profile as any)?.reset_password_token || null,
      fk_company:
        data.companyResult.idCompany ||
        (typeof data.companyResult.companyId === "number"
          ? data.companyResult.companyId
          : parseInt(String(data.companyResult.companyId), 10) || null),
      company_id: data.companyResult.companyId,
      company_name: data.companyResult.companyName,
      fk_merchant_user: data.companyResult.sellerId || data.companyResult.companyId,
    } as CreateCustomerProfileStepInput))
    const profile = createCustomerProfileStep(profileInput)

    // 4. Assign company-specific role to this sdv_customers record
    const roleAssignmentInput = transform(
      { profile, companyResult },
      (data) => ({
        customer_id: String((data.profile as any)?.id_customer ?? (data.profile as any)?.id),
        id_customer: Number((data.profile as any)?.id_customer ?? (data.profile as any)?.id) || null,
        company_id: data.companyResult.companyId,
        id_company: data.companyResult.idCompany || null,
        company_name: data.companyResult.companyName,
        customer_email: (data.profile as any)?.email || null,
        is_first_customer: data.companyResult.isNewCompany,
      })
    )
    assignCompanyAdminRoleStep(roleAssignmentInput)

    // 5. Compose workflow response using sdv_customers record
    const response = transform(
      { profile, companyResult },
      (data) => ({
        id: `cus_${(data.profile as any).id_customer ?? (data.profile as any).id}`,
        id_customer: (data.profile as any).id_customer ?? (data.profile as any).id,
        email: (data.profile as any).email,
        first_name: (data.profile as any).first_name,
        last_name: (data.profile as any).last_name,
        phone: (data.profile as any).phone,
        reference: (data.profile as any).reference,
        customer_reference: (data.profile as any).reference,
        salutation: (data.profile as any).salutation,
        position: (data.profile as any).position,
        locale: (data.profile as any).locale,
        customer_profile: data.profile,
        company: {
          id: data.companyResult.companyId,
          name: data.companyResult.companyName,
          seller_id: data.companyResult.sellerId,
        },
        company_name: data.companyResult.companyName,
        fk_company: data.companyResult.companyId,
        role: "Admin",
      })
    )

    return new WorkflowResponse(response)
  }
)
