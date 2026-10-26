import { MedusaContainer } from "@medusajs/framework/types"
import { MODULE_NAMES } from "../../../constants"
import CompanyModuleService from "../../../modules/company/service"
import { CUSTOMER_PROFILE_MODULE } from "../../../modules/customer-profile"
import CustomerProfileModuleService from "../../../modules/customer-profile/service"
import { isFixedRole } from "../../../constants/roles"

export interface FormattedRole {
  id: string
  role_name: string
  description: string | null
  company_name: string | null
  customer_email: string | null
  permissions: string[]
  routes: string[]
  isFixed: boolean
  userCount: number
  created_at: string
  updated_at: string
}

export class RoleGovernanceService {
  private container: MedusaContainer
  private companyService: CompanyModuleService

  constructor(container: MedusaContainer) {
    this.container = container
    this.companyService = container.resolve(MODULE_NAMES.COMPANY)
  }

  /**
   * Parse company name and customer email from role_name
   * Format: "SDVerse -- vanita.chaudhari.external@sdverse.auto"
   */
  parseRoleName(roleName: string): { companyName: string | null; customerEmail: string | null } {
    if (roleName.includes(" -- ")) {
      const parts = roleName.split(" -- ")
      return {
        companyName: parts[0]?.trim() || null,
        customerEmail: parts[1]?.trim() || null,
      }
    }
    return {
      companyName: null,
      customerEmail: null,
    }
  }

  /**
   * Normalize permissions/routes from DB or input
   */
  normalizeRoutes(rawPermissions: any): string[] {
    if (!rawPermissions) return []
    if (Array.isArray(rawPermissions)) return rawPermissions.map(String)
    if (typeof rawPermissions === "string") {
      try {
        const parsed = JSON.parse(rawPermissions)
        if (Array.isArray(parsed)) return parsed.map(String)
      } catch (e) {
        return [rawPermissions]
      }
    }
    return []
  }

  /**
   * List all roles with user counts and enriched metadata
   */
  async listRoles(): Promise<FormattedRole[]> {
    const rawRoles: any[] = (await this.companyService.listRoles({}, { take: 1000 }).catch(() => [])) as any[]
    const customerRoles: any[] = (await this.companyService.listCustomerRoles({}, { take: 5000 }).catch(() => [])) as any[]

    // Count users per role
    const countMap: Record<string, number> = {}
    for (const cr of customerRoles) {
      const roleId = String(cr.id_role)
      countMap[roleId] = (countMap[roleId] || 0) + 1
    }

    return rawRoles.map((r) => this.formatRole(r, countMap[String(r.id)] || 0))
  }

  /**
   * Get single role by ID
   */
  async getRole(id: string): Promise<FormattedRole | null> {
    const roles: any[] = (await this.companyService.listRoles({ id }).catch(() => [])) as any[]
    if (!roles.length) return null

    const customerRoles: any[] = (await this.companyService.listCustomerRoles({ id_role: id }).catch(() => [])) as any[]
    return this.formatRole(roles[0], customerRoles.length)
  }

  /**
   * Create new role
   */
  async createRole(data: {
    role_name: string
    description?: string | null
    permissions?: string[]
    routes?: string[]
  }): Promise<FormattedRole> {
    const roleName = data.role_name.trim()

    // Check duplicate
    const existing = await this.companyService.listRoles({ role_name: roleName }).catch(() => [])
    if (existing.length > 0) {
      throw new Error(`Role '${roleName}' already exists.`)
    }

    const assignedRoutes = data.routes || data.permissions || ["/", "/products", "/inventory", "/orders", "/analytics", "/profile"]

    const created = await this.companyService.createRoles({
      role_name: roleName,
      description: data.description ? data.description.trim() : null,
      permissions: assignedRoutes as any,
    })

    return this.formatRole(created, 0)
  }

  /**
   * Update existing role
   */
  async updateRole(
    id: string,
    data: {
      role_name?: string
      description?: string | null
      permissions?: string[]
      routes?: string[]
    }
  ): Promise<FormattedRole> {
    const existing = await this.companyService.listRoles({ id }).catch(() => [])
    if (!existing.length) {
      throw new Error(`Role with ID '${id}' not found.`)
    }

    const currentRole = existing[0] as any
    const isFixed = isFixedRole(currentRole.role_name)

    const updatePayload: Record<string, any> = { id }

    if (data.role_name && !isFixed) {
      updatePayload.role_name = data.role_name.trim()
    }

    if (data.description !== undefined) {
      updatePayload.description = data.description ? data.description.trim() : null
    }

    const assignedRoutes = data.routes !== undefined ? data.routes : data.permissions
    if (assignedRoutes !== undefined) {
      updatePayload.permissions = assignedRoutes as any
    }

    const updated = await this.companyService.updateRoles(updatePayload)
    const customerRoles: any[] = (await this.companyService.listCustomerRoles({ id_role: id }).catch(() => [])) as any[]

    return this.formatRole(updated, customerRoles.length)
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<boolean> {
    const existing = await this.companyService.listRoles({ id }).catch(() => [])
    if (!existing.length) {
      throw new Error(`Role with ID '${id}' not found.`)
    }

    const role = existing[0] as any
    if (isFixedRole(role.role_name)) {
      throw new Error(`System role '${role.role_name}' cannot be deleted.`)
    }

    // Delete linked customer roles
    const customerRoles: any[] = (await this.companyService.listCustomerRoles({ id_role: id }).catch(() => [])) as any[]
    for (const cr of customerRoles) {
      await this.companyService.deleteCustomerRoles((cr as any).id).catch(() => {})
    }

    await this.companyService.deleteRoles(id)
    return true
  }

  /**
   * Format role for API response
   */
  formatRole(role: any, userCount: number = 0): FormattedRole {
    const { companyName, customerEmail } = this.parseRoleName(role.role_name)
    const routes = this.normalizeRoutes(role.permissions)

    return {
      id: role.id,
      role_name: role.role_name,
      description: role.description || null,
      company_name: companyName,
      customer_email: customerEmail,
      permissions: routes,
      routes,
      isFixed: isFixedRole(role.role_name),
      userCount,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }
  }
}
