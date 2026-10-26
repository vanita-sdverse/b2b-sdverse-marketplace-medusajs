import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  MODULE_NAMES,
  MARKETPLACE_ROLES,
  MARKETPLACE_ROLE_DESCRIPTIONS,
} from "../constants"
import CompanyModuleService from "../modules/company/service"

export default async function seedRoles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const companyService: CompanyModuleService = container.resolve(
    MODULE_NAMES.COMPANY
  )

  logger.info("Seeding default marketplace roles...")

  const rolesToSeed = Object.values(MARKETPLACE_ROLES)

  for (const roleName of rolesToSeed) {
    const existing = await companyService.listRoles({
      role_name: roleName,
    })

    if (!existing.length) {
      await companyService.createRoles({
        role_name: roleName,
        description: MARKETPLACE_ROLE_DESCRIPTIONS[roleName] || null,
      })
      logger.info(`Created role: ${roleName}`)
    } else {
      logger.info(`Role already exists: ${roleName}`)
    }
  }

  logger.info("Finished seeding marketplace roles.")
}
