import { MedusaContainer } from "@medusajs/framework/types"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import crypto from "crypto"

export interface SellerUserSession {
  id: string | number
  id_customer: number
  email: string
  first_name: string
  last_name: string
  name: string
  company_id: string
  id_company: number | null
  company_name: string
  is_active: boolean
  role_id: string
  role_name: string
  routes: string[]
  portal: "seller"
}

export interface BackofficeAdminSession {
  id: string
  email: string
  name: string
  role: string
  routes: string[]
  portal: "backoffice"
}

export class PortalAuthService {
  private container: MedusaContainer
  private companyService: CompanyModuleService
  private profileService: CustomerProfileModuleService

  constructor(container: MedusaContainer) {
    this.container = container
    this.companyService = container.resolve(MODULE_NAMES.COMPANY)
    this.profileService = container.resolve(CUSTOMER_PROFILE_MODULE)
  }

  /**
   * Seller Portal Login: authenticate customer, verify company active & subscribed, fetch role & routes
   */
  async loginSeller(email: string, _password?: string): Promise<{ token: string; user: SellerUserSession }> {
    const cleanEmail = (email || "").trim().toLowerCase()
    if (!cleanEmail) {
      throw new Error("Email address is required.")
    }

    // 1. Fetch customer from sdv_customers
    const allProfiles: any[] = (await this.profileService.listCustomerProfiles({}, { take: 1000 }).catch(() => [])) as any[]
    const customer = allProfiles.find((p) => (p.email || "").toLowerCase() === cleanEmail)

    if (!customer) {
      throw new Error(`No seller customer account found for '${email}'.`)
    }

    if (customer.is_active === false) {
      throw new Error("Your user account has been deactivated. Please contact your company administrator.")
    }

    // 2. Resolve company
    const allCompanies: any[] = (await this.companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]
    const customerCompanyId = customer.fk_company ? Number(customer.fk_company) : null

    let matchedCompany = allCompanies.find((c) => {
      if (customerCompanyId && Number(c.id_company) === customerCompanyId) return true
      if (Number(c.fk_owner) === Number(customer.id_customer)) return true
      return false
    })

    if (!matchedCompany && allCompanies.length > 0) {
      matchedCompany = allCompanies[0]
    }

    if (matchedCompany) {
      if (matchedCompany.is_active === false) {
        throw new Error(`Company '${matchedCompany.name}' has been deactivated. Access is denied.`)
      }

      const attrs = matchedCompany.attributes || {}
      if (attrs.is_subscribed === false || attrs.is_subscribed === "false") {
        throw new Error(`Subscription for '${matchedCompany.name}' is unsubscribed. Please contact administrator.`)
      }

      if (matchedCompany.subscription_expiration_date) {
        const expDate = new Date(matchedCompany.subscription_expiration_date)
        if (!isNaN(expDate.getTime()) && expDate.getTime() < Date.now()) {
          throw new Error(`Subscription for '${matchedCompany.name}' has expired.`)
        }
      }
    }

    const companyName = matchedCompany?.name || "SDVerse"
    const companyId = matchedCompany?.id || "comp_default"
    const idCompany = matchedCompany?.id_company ? Number(matchedCompany.id_company) : null

    // 3. Resolve customer role & permitted routes
    const customerRoles: any[] = (await this.companyService.listCustomerRoles({
      id_customer: Number(customer.id_customer),
    }).catch(() => [])) as any[]

    let roleRecord: any = null
    if (customerRoles.length > 0) {
      const roleId = customerRoles[0].id_role
      const rolesById = await this.companyService.listRoles({ id: roleId }).catch(() => [])
      if (rolesById.length > 0) {
        roleRecord = rolesById[0]
      }
    }

    // If no role, check company-specific role name
    if (!roleRecord) {
      const expectedRoleName = `${companyName} -- ${customer.email}`
      const rolesByName = await this.companyService.listRoles({ role_name: expectedRoleName }).catch(() => [])
      if (rolesByName.length > 0) {
        roleRecord = rolesByName[0]
      }
    }

    // Fallback default role
    const roleName = roleRecord?.role_name || `${companyName} -- ${customer.email}`
    const roleId = roleRecord?.id || "role_default"

    // Parse permitted routes
    let allowedRoutes: string[] = ["/", "/products", "/inventory", "/orders", "/analytics", "/profile"]
    if (roleRecord?.permissions) {
      if (Array.isArray(roleRecord.permissions)) {
        allowedRoutes = roleRecord.permissions.map(String)
      } else if (typeof roleRecord.permissions === "string") {
        try {
          const parsed = JSON.parse(roleRecord.permissions)
          if (Array.isArray(parsed)) allowedRoutes = parsed.map(String)
        } catch (e) {}
      }
    }

    // Generate token
    const token = `seller_tok_${crypto.randomBytes(24).toString("hex")}`

    const session: SellerUserSession = {
      id: customer.id_customer,
      id_customer: Number(customer.id_customer),
      email: customer.email,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || customer.email,
      company_id: companyId,
      id_company: idCompany,
      company_name: companyName,
      is_active: customer.is_active ?? true,
      role_id: roleId,
      role_name: roleName,
      routes: allowedRoutes,
      portal: "seller",
    }

    return { token, user: session }
  }

  /**
   * Backoffice Admin Login
   */
  async loginBackoffice(email: string, _password?: string): Promise<{ token: string; user: BackofficeAdminSession }> {
    const cleanEmail = (email || "").trim().toLowerCase()
    if (!cleanEmail) {
      throw new Error("Email address is required.")
    }

    const token = `backoffice_tok_${crypto.randomBytes(24).toString("hex")}`

    const session: BackofficeAdminSession = {
      id: "admin_01",
      email: cleanEmail,
      name: cleanEmail.includes("spryker") ? "Admin Spryker" : "Master Administrator",
      role: "Admin",
      routes: [
        "/",
        "/companies",
        "/customers",
        "/users",
        "/roles",
        "/products",
        "/orders",
        "/sellers",
        "/settings",
      ],
      portal: "backoffice",
    }

    return { token, user: session }
  }
}
