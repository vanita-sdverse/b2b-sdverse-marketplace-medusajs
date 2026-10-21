"use client"

import React, { useState, useEffect } from "react"
import { PageHeader, Card, TableShell, Badge, Button, ModalShell, Input } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

interface CustomerRow {
  id: string
  company: string
  country: string
  tier: string
  creditLimit: string
  status: string
  email?: string
  name?: string
  reference?: string
  fkMerchantUser?: string
}

interface CompanyOption {
  id: string
  name: string
}

const INITIAL_CUSTOMERS: CustomerRow[] = [
  { id: "cus_01", company: "Nordic Transport Logistics AB", country: "Sweden", tier: "Tier-1 Fleet", creditLimit: "$250,000", status: "Verified", email: "procurement@nordic-transport.se", reference: "WW--1", fkMerchantUser: "sel_nordic" },
  { id: "cus_02", company: "Scania Logistics Hub", country: "Netherlands", tier: "Tier-1 Fleet", creditLimit: "$500,000", status: "Verified", email: "fleet@scania-hub.nl", reference: "WW--2", fkMerchantUser: "sel_scania" },
  { id: "cus_03", company: "MAN Truck Repair Berlin", country: "Germany", tier: "Workshop Pro", creditLimit: "$75,000", status: "Verified", email: "parts@man-berlin.de", reference: "WW--3", fkMerchantUser: "sel_man" },
]

export default function BackofficeCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(INITIAL_CUSTOMERS)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Company selection mode: "existing" or "create"
  const [companyMode, setCompanyMode] = useState<"existing" | "create">("existing")
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [newCompanyName, setNewCompanyName] = useState("")

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    salutation: "mr",
    gender: "male",
    dateOfBirth: "",
    position: "",
    country: "United States",
    localeCode: "en_US",
  })

  // Load existing customers and companies on mount
  useEffect(() => {
    fetchCustomers()
    fetchCompanies()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.customers) && data.customers.length > 0) {
          const mapped: CustomerRow[] = data.customers.map((c: any) => ({
            id: c.id,
            company: c.company_name || c.customer_profile?.company_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Independent Buyer",
            country: "United States",
            tier: "Corporate Buyer",
            creditLimit: "$100,000",
            status: "Verified",
            email: c.email,
            name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
            reference: c.customer_profile?.customer_reference || "—",
            fkMerchantUser: c.customer_profile?.fk_merchant_user || c.customer_profile?.company_id || "—",
          }))
          setCustomers(mapped)
        }
      }
    } catch (e) {
      console.error("Failed to load customers:", e)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.companies) && data.companies.length > 0) {
          setCompanies(data.companies)
          if (!selectedCompanyId) {
            setSelectedCompanyId(data.companies[0].id)
          }
        }
      }
    } catch (e) {
      console.error("Failed to load companies:", e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      let resolvedCompanyId = ""
      let resolvedCompanyName = ""

      if (companyMode === "existing") {
        if (!selectedCompanyId) {
          throw new Error("Please select an existing company from the list.")
        }
        resolvedCompanyId = selectedCompanyId
        const match = companies.find((c) => c.id === selectedCompanyId)
        resolvedCompanyName = match ? match.name : ""
      } else {
        if (!newCompanyName.trim()) {
          throw new Error("Please enter a company name to create.")
        }
        resolvedCompanyName = newCompanyName.trim()
      }

      const payload = {
        email: formData.email.trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        company_name: resolvedCompanyName,
        company_id: resolvedCompanyId || undefined,
        fk_merchant_user: resolvedCompanyId || undefined,
        phone: formData.phone.trim() || undefined,
        salutation: formData.salutation,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth || undefined,
        position: formData.position.trim() || undefined,
        locale_code: formData.localeCode,
      }

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to create customer")
      }

      const data = await res.json()
      const createdCustomer = data.customer

      const ref = createdCustomer?.customer_profile?.customer_reference || "Generated"
      const assignedMerchantId = createdCustomer?.customer_profile?.fk_merchant_user || createdCustomer?.customer_profile?.company_id || resolvedCompanyId || "—"
      const finalCompany = createdCustomer?.company_name || createdCustomer?.customer_profile?.company_name || resolvedCompanyName

      setSuccessMessage(
        `Customer '${formData.firstName} ${formData.lastName}' created and saved! Reference: ${ref} | Company ID (fk_merchant_user): ${assignedMerchantId}`
      )
      setIsModalOpen(false)

      // Refresh customers list from server
      await fetchCustomers()
      await fetchCompanies()

      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        salutation: "mr",
        gender: "male",
        dateOfBirth: "",
        position: "",
        country: "United States",
        localeCode: "en_US",
      })
      setNewCompanyName("")
    } catch (err: any) {
      setError(err?.message || "Failed to create customer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="B2B Corporate Buyer Accounts"
        subtitle="Manage verified fleet accounts, corporate buyer companies, and credit terms."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Customers" }]}
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Create Customer
          </Button>
        }
      />

      {successMessage && (
        <div className={styles.alertSuccess}>
          ✓ {successMessage}
        </div>
      )}

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Reference</th>
              <th>Company Name</th>
              <th>Merchant / Company ID (fk_merchant_user)</th>
              <th>Email</th>
              <th>Account Tier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className={styles.customerId}>{c.id}</td>
                <td className={styles.reference}>{c.reference || "—"}</td>
                <td className={styles.company}>{c.company}</td>
                <td>
                  <span className={styles.merchantId}>{c.fkMerchantUser || "—"}</span>
                </td>
                <td>{c.email || "—"}</td>
                <td>{c.tier}</td>
                <td>
                  <Badge variant="success" size="sm">{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>

      {/* Customer Creation Modal */}
      <ModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Customer & Corporate Account"
      >
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.alertError}>{error}</div>}

          <div className={styles.formGrid}>
            {/* Company 2 Options Selector */}
            <div className={styles.companyModeSelector}>
              <div className={styles.modeTitle}>Company / Merchant Association (fk_merchant_user)</div>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="companyMode"
                    value="existing"
                    checked={companyMode === "existing"}
                    onChange={() => setCompanyMode("existing")}
                  />
                  Search / Select Existing Company
                </label>
                <label>
                  <input
                    type="radio"
                    name="companyMode"
                    value="create"
                    checked={companyMode === "create"}
                    onChange={() => setCompanyMode("create")}
                  />
                  Create New Company
                </label>
              </div>

              {companyMode === "existing" ? (
                <div className={styles.fieldGroup}>
                  <label htmlFor="companySelect">Select Existing Company</label>
                  <select
                    id="companySelect"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name} ({comp.id})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label="New Company Name *"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Apex Fleet Logistics GmbH"
                  required={companyMode === "create"}
                />
              )}
            </div>

            <div>
              <Input
                label="Email Address *"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="buyer@enterprise.com"
              />
            </div>

            <div>
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0199"
              />
            </div>

            <div>
              <Input
                label="First Name *"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>

            <div>
              <Input
                label="Last Name *"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>

            <div>
              <Input
                label="Position / Role"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Fleet Director"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="salutation">Salutation</label>
              <select
                id="salutation"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
              >
                <option value="mr">Mr.</option>
                <option value="ms">Ms.</option>
                <option value="mrs">Mrs.</option>
                <option value="dr">Dr.</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Locale Code"
                name="localeCode"
                value={formData.localeCode}
                onChange={handleChange}
                placeholder="en_US"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              Save Customer & Company
            </Button>
          </div>
        </form>
      </ModalShell>
    </div>
  )
}
