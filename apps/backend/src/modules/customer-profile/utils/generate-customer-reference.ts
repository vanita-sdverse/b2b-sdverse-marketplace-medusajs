import crypto from "crypto"

/**
 * Generates a stable, unique, readable customer reference.
 * Format: CUS-<TIMESTAMP_36>-<RANDOM_HEX>
 * Isolated in utility function to allow future format changes without altering consumers.
 */
export function generateCustomerReference(prefix = "CUS"): string {
  const timestampPart = Date.now().toString(36).toUpperCase()
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase()
  return `${prefix}-${timestampPart}-${randomPart}`
}
