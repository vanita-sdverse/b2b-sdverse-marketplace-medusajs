import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"

export type CompanySubscriptionStatus = "Subscribed" | "Unsubscribed" | "Expired"

export interface FormattedCompany {
  id: string
  id_company: number | null
  name: string
  is_active: boolean
  status: CompanySubscriptionStatus
  subscription_end_date: string | null
  subscription_expiration_date: string | null
  attributes: Record<string, any>
  fk_owner: string | null
  created_at: string
  updated_at: string
}

export class CompanyGovernanceService {
  private companyService: CompanyModuleService
  private profileService: CustomerProfileModuleService

  constructor(container: { resolve: (name: string) => any }) {
    this.companyService = container.resolve(MODULE_NAMES.COMPANY)
    this.profileService = container.resolve(CUSTOMER_PROFILE_MODULE)
  }

  /**
   * Resolve company by Medusa ID (comp_...) or integer id_company
   */
  async resolveCompany(idOrNumber: string | number): Promise<any | null> {
    const raw = String(idOrNumber).trim()
    const allCompanies: any[] = (await this.companyService.listCompanies({}, { take: 1000 }).catch(() => [])) as any[]

    return (
      allCompanies.find(
        (c) =>
          c.id === raw ||
          String(c.id_company) === raw ||
          c.key === raw ||
          c.name.toLowerCase() === raw.toLowerCase()
      ) || null
    )
  }

  /**
   * Determine whether subscription is active, expired, or unsubscribed
   */
  computeSubscriptionStatus(company: any): CompanySubscriptionStatus {
    let attrs = company.attributes || {}
    if (typeof attrs === "string") {
      try {
        attrs = JSON.parse(attrs)
      } catch (e) {
        attrs = {}
      }
    }

    if (attrs.is_subscribed === false || attrs.is_subscribed === "false") {
      return "Unsubscribed"
    }

    if (company.subscription_expiration_date) {
      const expDate = new Date(company.subscription_expiration_date)
      if (!isNaN(expDate.getTime()) && expDate.getTime() < Date.now()) {
        return "Expired"
      }
    }

    return "Subscribed"
  }

  /**
   * Check if subscription has expired and automatically deactivate company & its users
   */
  async checkAndEnforceSubscription(company: any): Promise<any> {
    const status = this.computeSubscriptionStatus(company)
    if ((status === "Expired" || status === "Unsubscribed") && company.is_active) {
      await this.companyService.updateCompanies({
        id: company.id,
        is_active: false,
      }).catch(() => {})

      company.is_active = false
      await this.syncCompanyUsersActiveStatus(company, false)
    }
    return company
  }

  /**
   * Sync active status to all company users in sdv_customers
   */
  async syncCompanyUsersActiveStatus(company: any, isActive: boolean): Promise<number> {
    let updatedCount = 0
    try {
      const allProfiles: any[] = (await this.profileService.listCustomerProfiles({}, { take: 5000 }).catch(() => [])) as any[]
      
      const companyNumericId = company.id_company ? Number(company.id_company) : null
      const ownerId = company.fk_owner ? Number(company.fk_owner) : null

      const matchingUsers = allProfiles.filter((p) => {
        if (companyNumericId && Number(p.fk_company) === companyNumericId) return true
        if (ownerId && Number(p.id_customer) === ownerId) return true
        return false
      })

      for (const user of matchingUsers) {
        if (user.is_active !== isActive) {
          await this.profileService.updateCustomerProfiles({
            id_customer: user.id_customer,
            is_active: isActive,
            anonymized_at: isActive ? null : new Date(),
          }).catch(() => {})
          updatedCount++
        }
      }
    } catch (err) {
      console.warn(`[CompanyGovernanceService] Failed to sync users status: ${(err as any)?.message}`)
    }
    return updatedCount
  }

  /**
   * Deactivate or activate company and its users
   */
  async setCompanyActiveStatus(companyId: string, isActive: boolean): Promise<any> {
    const company = await this.resolveCompany(companyId)
    if (!company) {
      throw new Error(`Company '${companyId}' not found.`)
    }

    await this.companyService.updateCompanies({
      id: company.id,
      is_active: isActive,
    })

    company.is_active = isActive
    const updatedUsers = await this.syncCompanyUsersActiveStatus(company, isActive)

    return {
      company,
      updatedUsers,
    }
  }

  /**
   * Unsubscribe company: marks subscription as unsubscribed and deactivates company & users
   */
  async unsubscribeCompany(companyId: string): Promise<any> {
    const company = await this.resolveCompany(companyId)
    if (!company) {
      throw new Error(`Company '${companyId}' not found.`)
    }

    let currentAttrs = company.attributes || {}
    if (typeof currentAttrs === "string") {
      try {
        currentAttrs = JSON.parse(currentAttrs)
      } catch (e) {
        currentAttrs = {}
      }
    }
    const updatedAttrs = {
      ...currentAttrs,
      is_subscribed: false,
      unsubscribed_at: new Date().toISOString(),
    }

    await this.companyService.updateCompanies({
      id: company.id,
      is_active: false,
      attributes: updatedAttrs,
    })

    company.is_active = false
    company.attributes = updatedAttrs
    const updatedUsers = await this.syncCompanyUsersActiveStatus(company, false)

    return {
      company,
      updatedUsers,
    }
  }

  /**
   * Subscribe company: marks subscription as subscribed, extends expiration date if expired,
   * and activates company & users.
   */
  async subscribeCompany(companyId: string): Promise<any> {
    const company = await this.resolveCompany(companyId)
    if (!company) {
      throw new Error(`Company '${companyId}' not found.`)
    }

    let currentAttrs = company.attributes || {}
    if (typeof currentAttrs === "string") {
      try {
        currentAttrs = JSON.parse(currentAttrs)
      } catch (e) {
        currentAttrs = {}
      }
    }
    const updatedAttrs = {
      ...currentAttrs,
      is_subscribed: true,
      subscribed_at: new Date().toISOString(),
    }

    // If expiration date is missing or in the past, extend by 1 year from now
    let newExpirationDate = company.subscription_expiration_date
    if (!newExpirationDate || new Date(newExpirationDate).getTime() <= Date.now()) {
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      newExpirationDate = nextYear
    }

    await this.companyService.updateCompanies({
      id: company.id,
      is_active: true,
      subscription_expiration_date: newExpirationDate,
      attributes: updatedAttrs,
    })

    company.is_active = true
    company.subscription_expiration_date = newExpirationDate
    company.attributes = updatedAttrs
    const updatedUsers = await this.syncCompanyUsersActiveStatus(company, true)

    return {
      company,
      updatedUsers,
    }
  }

  /**
   * Format company for API response
   */
  formatCompany(company: any): FormattedCompany {
    const status = this.computeSubscriptionStatus(company)
    let formattedEndDate: string | null = null

    if (company.subscription_expiration_date) {
      try {
        const d = new Date(company.subscription_expiration_date)
        formattedEndDate = d.toISOString().split("T")[0]
      } catch (e) {
        formattedEndDate = String(company.subscription_expiration_date)
      }
    }

    let attrs = company.attributes || {}
    if (typeof attrs === "string") {
      try {
        attrs = JSON.parse(attrs)
      } catch (e) {
        attrs = {}
      }
    }

    return {
      id: company.id,
      id_company: company.id_company ?? null,
      name: company.name,
      is_active: company.is_active ?? true,
      status,
      subscription_end_date: formattedEndDate,
      subscription_expiration_date: company.subscription_expiration_date,
      attributes: attrs,
      fk_owner: company.fk_owner || null,
      created_at: company.created_at,
      updated_at: company.updated_at,
    }
  }
}
