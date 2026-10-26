export const FIXED_MARKETPLACE_ROLES = {
  ADMIN: "Admin",
  PRODUCT_ACTIVATOR: "Product Activator",
  PRODUCT_CONSUMER: "Product Consumer",
  INQUIRY_APPROVER: "Inquiry Approver",
  PRODUCT_CREATOR: "Product Creator",
} as const

export type FixedRoleName = typeof FIXED_MARKETPLACE_ROLES[keyof typeof FIXED_MARKETPLACE_ROLES]

export const FIXED_ROLE_NAMES = Object.values(FIXED_MARKETPLACE_ROLES)

export const isFixedRole = (roleName: string): boolean => {
  return FIXED_ROLE_NAMES.some((fixed) => fixed.toLowerCase() === (roleName || "").trim().toLowerCase())
}

export const PERMISSIONS = {
  // Products
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  PRODUCTS_ACTIVATE: "products.activate",
  
  // Inquiries / RFQ
  INQUIRIES_VIEW: "inquiries.view",
  INQUIRIES_CREATE: "inquiries.create",
  INQUIRIES_APPROVE: "inquiries.approve",
  INQUIRIES_REJECT: "inquiries.reject",

  // Orders
  ORDERS_VIEW: "orders.view",
  ORDERS_CREATE: "orders.create",
  ORDERS_MANAGE: "orders.manage",

  // Pricing & Catalogs
  PRICING_VIEW: "pricing.view",
  PRICING_MANAGE: "pricing.manage",

  // Sellers
  SELLERS_VIEW: "sellers.view",
  SELLERS_MANAGE: "sellers.manage",

  // Users & Governance
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS]

export interface PermissionDefinition {
  code: PermissionCode
  name: string
  description: string
  category: "Products" | "Inquiries & RFQs" | "Orders & Settlements" | "Pricing" | "Sellers" | "Governance"
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  // Products
  { code: PERMISSIONS.PRODUCTS_VIEW, name: "View Products", description: "Browse catalog products and specifications", category: "Products" },
  { code: PERMISSIONS.PRODUCTS_CREATE, name: "Create Products", description: "Create and draft new products", category: "Products" },
  { code: PERMISSIONS.PRODUCTS_UPDATE, name: "Update Products", description: "Modify product specifications and details", category: "Products" },
  { code: PERMISSIONS.PRODUCTS_DELETE, name: "Delete Products", description: "Archive or delete catalog products", category: "Products" },
  { code: PERMISSIONS.PRODUCTS_ACTIVATE, name: "Activate Products", description: "Review and activate draft products to live catalog", category: "Products" },

  // Inquiries
  { code: PERMISSIONS.INQUIRIES_VIEW, name: "View Inquiries", description: "View commercial buyer RFQ inquiries", category: "Inquiries & RFQs" },
  { code: PERMISSIONS.INQUIRIES_CREATE, name: "Create Inquiries", description: "Submit new RFQ and purchase inquiries", category: "Inquiries & RFQs" },
  { code: PERMISSIONS.INQUIRIES_APPROVE, name: "Approve Inquiries", description: "Approve RFQ pricing and terms", category: "Inquiries & RFQs" },
  { code: PERMISSIONS.INQUIRIES_REJECT, name: "Reject Inquiries", description: "Reject unqualified inquiries", category: "Inquiries & RFQs" },

  // Orders
  { code: PERMISSIONS.ORDERS_VIEW, name: "View Orders", description: "View order summaries and invoices", category: "Orders & Settlements" },
  { code: PERMISSIONS.ORDERS_CREATE, name: "Place Orders", description: "Checkout and create platform orders", category: "Orders & Settlements" },
  { code: PERMISSIONS.ORDERS_MANAGE, name: "Manage Orders", description: "Update order status, fulfillment, and refunds", category: "Orders & Settlements" },

  // Pricing
  { code: PERMISSIONS.PRICING_VIEW, name: "View Tiered Pricing", description: "View approved B2B price tiers", category: "Pricing" },
  { code: PERMISSIONS.PRICING_MANAGE, name: "Manage Pricing", description: "Configure customer price tiers and volume discounts", category: "Pricing" },

  // Sellers
  { code: PERMISSIONS.SELLERS_VIEW, name: "View Sellers", description: "Browse registered vendor profiles", category: "Sellers" },
  { code: PERMISSIONS.SELLERS_MANAGE, name: "Manage Sellers", description: "Onboard, audit, or suspend seller accounts", category: "Sellers" },

  // Governance
  { code: PERMISSIONS.USERS_VIEW, name: "View Users", description: "View corporate accounts and members", category: "Governance" },
  { code: PERMISSIONS.USERS_MANAGE, name: "Manage Users", description: "Invite, update, or remove users", category: "Governance" },
  { code: PERMISSIONS.ROLES_VIEW, name: "View Roles", description: "Inspect defined roles and permission sets", category: "Governance" },
  { code: PERMISSIONS.ROLES_MANAGE, name: "Manage Roles", description: "Create, update, and assign user roles and permissions", category: "Governance" },
  { code: PERMISSIONS.SETTINGS_MANAGE, name: "Platform Settings", description: "Configure platform defaults and commission rates", category: "Governance" },
]

export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionCode[]> = {
  [FIXED_MARKETPLACE_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [FIXED_MARKETPLACE_ROLES.PRODUCT_ACTIVATOR]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_ACTIVATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.SELLERS_VIEW,
  ],
  [FIXED_MARKETPLACE_ROLES.PRODUCT_CONSUMER]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRICING_VIEW,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.INQUIRIES_CREATE,
    PERMISSIONS.INQUIRIES_VIEW,
  ],
  [FIXED_MARKETPLACE_ROLES.INQUIRY_APPROVER]: [
    PERMISSIONS.INQUIRIES_VIEW,
    PERMISSIONS.INQUIRIES_APPROVE,
    PERMISSIONS.INQUIRIES_REJECT,
    PERMISSIONS.PRICING_VIEW,
    PERMISSIONS.ORDERS_VIEW,
  ],
  [FIXED_MARKETPLACE_ROLES.PRODUCT_CREATOR]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRICING_VIEW,
  ],
}

export const FIXED_ROLE_DESCRIPTIONS: Record<string, string> = {
  [FIXED_MARKETPLACE_ROLES.ADMIN]:
    "Full administrative access to manage company details, invite/remove users, audit logs, and assign roles.",
  [FIXED_MARKETPLACE_ROLES.PRODUCT_ACTIVATOR]:
    "Authorized to review, approve, and activate marketplace products into the live public catalog.",
  [FIXED_MARKETPLACE_ROLES.PRODUCT_CONSUMER]:
    "Standard buyer role authorized to search the catalog, view approved pricing tiers, and place orders.",
  [FIXED_MARKETPLACE_ROLES.INQUIRY_APPROVER]:
    "Authorized to review, quote, approve, or reject RFQs (Request For Quotation) and purchase inquiries.",
  [FIXED_MARKETPLACE_ROLES.PRODUCT_CREATOR]:
    "Authorized to create, draft, and modify marketplace products and specifications.",
}
