import { MedusaContainer } from "@medusajs/framework/types"

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number | string
  inventory_quantity: number
  options: Record<string, string>
  status?: string
  barcode?: string
}

export interface ProductItem {
  id: string
  title: string
  handle: string
  description: string
  category: string
  seller: string
  seller_id?: string
  sku: string
  price: string
  status: "published" | "draft" | "denied"
  marketplace_status: "approved" | "pending_review" | "denied"
  denial_reason?: string | null
  thumbnail?: string
  variants: ProductVariant[]
  created_at: string
  updated_at: string
}

// In-memory persistent registry pre-seeded with rich B2B automotive items and variants
let PRODUCTS_REGISTRY: ProductItem[] = [
  {
    id: "prod_01",
    title: "Commercial Dual Circuit Air Brake Valve",
    handle: "commercial-dual-circuit-air-brake-valve",
    description: "High performance pneumatic dual-circuit valve engineered for heavy-duty commercial truck braking systems. Meets ISO 7637-2 standard.",
    category: "Braking Systems",
    seller: "Apex Euro Truck Components Ltd",
    seller_id: "comp_01M5HWRNKHST7CDK9TKFTXC3FA",
    sku: "KB-BRK-9902",
    price: "$345.00",
    status: "published",
    marketplace_status: "approved",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-15T08:30:00.000Z",
    updated_at: "2026-10-23T09:00:00.000Z",
    variants: [
      {
        id: "var_01_a",
        title: "Standard 24V M22x1.5",
        sku: "KB-BRK-9902-STD",
        price: "$345.00",
        inventory_quantity: 120,
        options: { "Port Thread": "M22x1.5", "Voltage": "24V", "Material": "Die-cast Aluminum" },
        status: "active",
        barcode: "4012345678901",
      },
      {
        id: "var_01_b",
        title: "Reinforced 12V High-Pressure",
        sku: "KB-BRK-9902-HP",
        price: "$390.00",
        inventory_quantity: 45,
        options: { "Port Thread": "M22x1.5", "Voltage": "12V", "Material": "Hardened Anodized" },
        status: "active",
        barcode: "4012345678902",
      },
    ],
  },
  {
    id: "prod_02",
    title: "Common Rail Diesel Fuel Injection Pump 2500 Bar",
    handle: "common-rail-diesel-fuel-injection-pump",
    description: "Ultra-high pressure common rail fuel pump rated up to 2500 bar with integrated digital metering unit for heavy commercial Euro-6 diesel engines.",
    category: "Powertrain & Fuel",
    seller: "EuroDiesel Systems GmbH",
    seller_id: "comp_01M5M8H1TDKCHG2SAMM1883MYR",
    sku: "BSH-CR-0445",
    price: "$1,120.00",
    status: "published",
    marketplace_status: "approved",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-16T10:15:00.000Z",
    updated_at: "2026-10-22T14:20:00.000Z",
    variants: [
      {
        id: "var_02_a",
        title: "6-Cylinder Direct-Flange Euro 6",
        sku: "BSH-CR-0445-E6",
        price: "$1,120.00",
        inventory_quantity: 28,
        options: { "Engine Spec": "Euro 6", "Displacement": "11.0L - 13.0L", "Drive": "Gear Driven" },
        status: "active",
        barcode: "4012345678903",
      },
      {
        id: "var_02_b",
        title: "8-Cylinder Heavy Haulage Euro 5/6",
        sku: "BSH-CR-0445-HH",
        price: "$1,280.00",
        inventory_quantity: 12,
        options: { "Engine Spec": "Euro 5/6", "Displacement": "15.0L - 16.5L", "Drive": "Twin Gear" },
        status: "active",
        barcode: "4012345678904",
      },
    ],
  },
  {
    id: "prod_03",
    title: "Commercial Steer Axle Radial Tyre 315/80 R22.5",
    handle: "commercial-steer-axle-radial-tyre",
    description: "Premium all-weather commercial steering axle radial tyre with 3PMSF severe snow rating and reinforced sidewall casing for long-haul fleet efficiency.",
    category: "Wheels & Tyres",
    seller: "Global Fleet Tyre Distribution",
    seller_id: "comp_01M5M9WTNHXCKGD4X5E140JESD",
    sku: "MCH-TYR-31580",
    price: "$485.00",
    status: "published",
    marketplace_status: "approved",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-18T11:00:00.000Z",
    updated_at: "2026-10-23T07:15:00.000Z",
    variants: [
      {
        id: "var_03_a",
        title: "Load Index 156/150K Standard Tread",
        sku: "MCH-TYR-31580-STD",
        price: "$485.00",
        inventory_quantity: 180,
        options: { "Load Index": "156/150K", "Tread Depth": "15.5mm", "Compound": "Low Rolling Resistance" },
        status: "active",
        barcode: "4012345678905",
      },
      {
        id: "var_03_b",
        title: "Load Index 158/150L Heavy Construction",
        sku: "MCH-TYR-31580-HD",
        price: "$525.00",
        inventory_quantity: 65,
        options: { "Load Index": "158/150L", "Tread Depth": "17.0mm", "Compound": "Cut & Chip Resistant" },
        status: "active",
        barcode: "4012345678906",
      },
    ],
  },
  {
    id: "prod_04",
    title: "Heavy Duty Automated 12-Speed Gearbox Transmission",
    handle: "heavy-duty-automated-12-speed-gearbox",
    description: "Automated manual transmission with pneumatic clutch actuation, direct top drive, and dual intermediate shafts capable of handling up to 2800 Nm torque.",
    category: "Driveline & Transmission",
    seller: "Bavaria Transmissions SpA",
    seller_id: "comp_01M5HWRNKHST7CDK9TKFTXC3FA",
    sku: "BVR-GBX-1200",
    price: "$4,350.00",
    status: "published",
    marketplace_status: "approved",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-19T09:40:00.000Z",
    updated_at: "2026-10-21T16:30:00.000Z",
    variants: [
      {
        id: "var_04_a",
        title: "Direct Drive 2800Nm with Retarder",
        sku: "BVR-GBX-1200-RET",
        price: "$4,350.00",
        inventory_quantity: 8,
        options: { "Torque Rating": "2800 Nm", "Retarder": "Integrated Intarder", "PTO Interface": "Rear & Side" },
        status: "active",
        barcode: "4012345678907",
      },
    ],
  },
  {
    id: "prod_05",
    title: "Trailer Air Suspension Damper Shock Absorber",
    handle: "trailer-air-suspension-damper-shock",
    description: "Twin-tube gas-hydraulic shock absorber designed for heavy trailer rigid axles operating under severe cyclic loading conditions.",
    category: "Suspension & Steering",
    seller: "Apex Euro Truck Components Ltd",
    seller_id: "comp_01M5HWRNKHST7CDK9TKFTXC3FA",
    sku: "SUS-DMP-089",
    price: "$180.00",
    status: "draft",
    marketplace_status: "pending_review",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-20T13:20:00.000Z",
    updated_at: "2026-10-22T11:10:00.000Z",
    variants: [
      {
        id: "var_05_a",
        title: "Eyelet Mount 450mm Extended",
        sku: "SUS-DMP-089-450",
        price: "$180.00",
        inventory_quantity: 90,
        options: { "Extended Length": "450mm", "Compressed Length": "290mm", "Bushing": "Polyurethane" },
        status: "active",
        barcode: "4012345678908",
      },
    ],
  },
  {
    id: "prod_06",
    title: "Electronic Braking System (EBS) ECU Controller 24V",
    handle: "electronic-braking-system-ebs-ecu-controller",
    description: "Central electronic control unit for truck-tractor EBS with anti-lock, roll stability support (RSS), and CAN-bus telemetry interface.",
    category: "Electronics & Sensors",
    seller: "EuroDiesel Systems GmbH",
    seller_id: "comp_01M5M8H1TDKCHG2SAMM1883MYR",
    sku: "WBC-EBS-4801",
    price: "$890.00",
    status: "published",
    marketplace_status: "approved",
    denial_reason: null,
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-10-21T15:00:00.000Z",
    updated_at: "2026-10-23T06:00:00.000Z",
    variants: [
      {
        id: "var_06_a",
        title: "EBS Gen 3 CAN 2.0B Flashable",
        sku: "WBC-EBS-4801-G3",
        price: "$890.00",
        inventory_quantity: 35,
        options: { "Firmware": "v3.4.1", "Protocol": "J1939 CAN", "Connector": "7-Pin Bayonet" },
        status: "active",
        barcode: "4012345678909",
      },
    ],
  },
]

export class ProductGovernanceService {
  constructor(private scope?: MedusaContainer) {}

  async listProducts(query: { search?: string; status?: string; category?: string } = {}): Promise<ProductItem[]> {
    let result = [...PRODUCTS_REGISTRY]

    if (query.status && query.status !== "all") {
      result = result.filter((p) => p.status.toLowerCase() === query.status!.toLowerCase())
    }

    if (query.category && query.category !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === query.category!.toLowerCase())
    }

    if (query.search) {
      const q = query.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(q) || v.title.toLowerCase().includes(q))
      )
    }

    return result
  }

  async getProductById(id: string): Promise<ProductItem | null> {
    const cleanId = id.trim().toLowerCase()
    return (
      PRODUCTS_REGISTRY.find(
        (p) => p.id.toLowerCase() === cleanId || p.handle.toLowerCase() === cleanId || p.sku.toLowerCase() === cleanId
      ) || null
    )
  }

  async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
    const index = PRODUCTS_REGISTRY.findIndex(
      (p) => p.id.toLowerCase() === id.trim().toLowerCase() || p.handle.toLowerCase() === id.trim().toLowerCase()
    )

    if (index === -1) {
      return null
    }

    const existing = PRODUCTS_REGISTRY[index]
    const updatedVariants = updates.variants ? updates.variants : existing.variants

    const updatedItem: ProductItem = {
      ...existing,
      ...updates,
      variants: updatedVariants,
      updated_at: new Date().toISOString(),
    }

    // Keep primary SKU and price in sync with first variant if updated
    if (updatedItem.variants && updatedItem.variants.length > 0) {
      if (!updates.sku) {
        updatedItem.sku = updatedItem.variants[0].sku
      }
      if (!updates.price && updatedItem.variants[0].price) {
        const firstPrice = String(updatedItem.variants[0].price)
        updatedItem.price = firstPrice.startsWith("$") ? firstPrice : `$${firstPrice}`
      }
    }

    PRODUCTS_REGISTRY[index] = updatedItem
    return updatedItem
  }

  async denyProductByMarketplace(id: string, reason?: string): Promise<ProductItem | null> {
    const product = await this.getProductById(id)
    if (!product) {
      return null
    }

    const denialReasonText = reason?.trim() || "Denied by marketplace: Product fails quality or regulatory criteria."

    return await this.updateProduct(product.id, {
      status: "denied",
      marketplace_status: "denied",
      denial_reason: denialReasonText,
    })
  }

  async approveProductByMarketplace(id: string): Promise<ProductItem | null> {
    const product = await this.getProductById(id)
    if (!product) {
      return null
    }

    return await this.updateProduct(product.id, {
      status: "published",
      marketplace_status: "approved",
      denial_reason: null,
    })
  }

  async exportProductJson(id: string): Promise<{ product: ProductItem; schema_version: string; exported_at: string } | null> {
    const product = await this.getProductById(id)
    if (!product) {
      return null
    }

    return {
      schema_version: "sdverse.b2b.product.v1",
      exported_at: new Date().toISOString(),
      product,
    }
  }

  async createProduct(data: Partial<ProductItem>): Promise<ProductItem> {
    const nextNum = PRODUCTS_REGISTRY.length + 1
    const id = data.id || `prod_${String(nextNum).padStart(2, "0")}`
    const title = data.title || "Untitled Product"
    const handle = data.handle || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const variants: ProductVariant[] = (data.variants && data.variants.length > 0)
      ? data.variants
      : [
          {
            id: `var_${id}_01`,
            title: "Standard Variant",
            sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
            price: data.price || "$100.00",
            inventory_quantity: 10,
            options: { "Type": "Standard" },
            status: "active",
          },
        ]

    const newProduct: ProductItem = {
      id,
      title,
      handle,
      description: data.description || "B2B commercial part listing.",
      category: data.category || "General Automotive",
      seller: data.seller || "SDVerse Merchant Hub",
      seller_id: data.seller_id || "comp_01M5HWRNKHST7CDK9TKFTXC3FA",
      sku: data.sku || variants[0].sku,
      price: data.price || (typeof variants[0].price === "string" ? variants[0].price : `$${variants[0].price}`),
      status: data.status || "draft",
      marketplace_status: data.marketplace_status || "pending_review",
      denial_reason: data.denial_reason || null,
      thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80",
      variants,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    PRODUCTS_REGISTRY.unshift(newProduct)
    return newProduct
  }
}
