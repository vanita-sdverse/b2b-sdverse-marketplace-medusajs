import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PortalAuthService } from "../services/portal-auth-service"

const backofficeLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().optional(),
})

export class BackofficeLoginOperation {
  static async handle(req: MedusaRequest, res: MedusaResponse): Promise<void> {
    try {
      const parsed = backofficeLoginSchema.parse(req.body)
      const service = new PortalAuthService(req.scope)
      const result = await service.loginBackoffice(parsed.email, parsed.password)

      res.status(200).json(result)
    } catch (err: any) {
      res.status(401).json({ message: err?.message || "Authentication failed" })
    }
  }
}
