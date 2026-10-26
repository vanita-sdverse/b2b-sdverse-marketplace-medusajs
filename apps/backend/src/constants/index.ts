export const MODULE_NAMES = {
  COMPANY: "company",
  CUSTOMER_PROFILE: "customerProfile",
  SELLER: "seller",
} as const

export const MARKETPLACE_ROLES = {
  ADMIN: "Admin",
  PRODUCT_CREATOR: "Product Creator",
  PRODUCT_ACTIVATOR: "Product Activator",
  INQUIRY_APPROVER: "Inquiry Approver",
  PRODUCT_CONSUMER: "Product Consumer",
} as const

export const MARKETPLACE_ROLE_DESCRIPTIONS: Record<string, string> = {
  [MARKETPLACE_ROLES.ADMIN]:
    "Full administrative access to manage company details, invite/remove users, and assign roles.",
  [MARKETPLACE_ROLES.PRODUCT_CREATOR]:
    "Authorized to create, draft, and modify marketplace products and specifications.",
  [MARKETPLACE_ROLES.PRODUCT_ACTIVATOR]:
    "Authorized to review, approve, and activate products into the live public catalog.",
  [MARKETPLACE_ROLES.INQUIRY_APPROVER]:
    "Authorized to review, quote, approve, or reject RFQs (Request For Quotation) and purchase orders.",
  [MARKETPLACE_ROLES.PRODUCT_CONSUMER]:
    "Standard buyer role authorized to search the catalog, view approved pricing tiers, and place orders.",
}

export const MODEL_PREFIXES = {
  COMPANY: "comp",
  ROLE: "role",
  CUSTOMER_ROLE: "crole",
  CUSTOMER_PROFILE: "cprof",
  comp: "comp",
  role: "role",
  crole: "crole",
  cprof: "cprof",
} as const

export const COMPANY_DEFAULTS = {
  SUBSCRIPTION_DURATION_DAYS: 365,
} as const

export * from "./roles"
