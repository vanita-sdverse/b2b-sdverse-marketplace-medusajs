"use client"

import React, { useState, useEffect, useRef } from "react"
import { PageHeader, Card, Badge, Button, ModalShell, Input } from "@marketplace/shared-ui"
import { DataTable, DataTableColumn } from "../../components/DataTable"
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
  firstName?: string
  lastName?: string
  phone?: string
  reference?: string
  salutation?: string
  position?: string
  locale?: string
  fkCompany?: string
  fkMerchantUser?: string
  isActive?: boolean
  createdAt?: string
}

interface CompanyOption {
  id: string
  name: string
}

const INITIAL_CUSTOMERS: CustomerRow[] = []

const INITIAL_FORM_DATA = {
  email: "",
  salutation: "",
  firstName: "",
  lastName: "",
  phone: "",
  position: "",
  localeCode: "en_US",
  sendPasswordResetEmail: false,
}

export default function BackofficeCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(INITIAL_CUSTOMERS)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewCustomerData, setViewCustomerData] = useState<any>(null)
  const [isViewLoading, setIsViewLoading] = useState(false)

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editCustomerId, setEditCustomerId] = useState<string>("")
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salutation: "",
    position: "",
    localeCode: "en_US",
  })
  const [editCompanySearch, setEditCompanySearch] = useState("")
  const [selectedEditCompanyId, setSelectedEditCompanyId] = useState("")
  const [isEditCompanyDropdownOpen, setIsEditCompanyDropdownOpen] = useState(false)
  const editCompanyDropdownRef = useRef<HTMLDivElement>(null)

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<CustomerRow | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  // Company Searchable Combobox State
  const [companySearch, setCompanySearch] = useState("")
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false)
  const companyDropdownRef = useRef<HTMLDivElement>(null)

  // Load existing customers and companies on mount
  useEffect(() => {
    fetchCustomers()
    fetchCompanies()
  }, [])

  // Close company dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false)
      }
      if (
        editCompanyDropdownRef.current &&
        !editCompanyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEditCompanyDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.customers) && data.customers.length > 0) {
          const mapped: CustomerRow[] = data.customers.map((c: any) => ({
            id: c.id,
            company:
              c.company_name ||
              (typeof c.company === "object" ? c.company?.name : c.company) ||
              c.customer_profile?.company_name ||
              c.metadata?.company_name ||
              c.customer_profile?.fk_company ||
              c.fk_company ||
              "—",
            country: "United States",
            tier: "Corporate Buyer",
            creditLimit: "$100,000",
            status: c.status || (c.is_active === false ? "Inactive" : "Verified"),
            email: c.email,
            name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
            firstName: c.first_name || "",
            lastName: c.last_name || "",
            phone: c.phone || "",
            salutation: c.salutation || "",
            position: c.position || "",
            locale: c.locale || "en_US",
            reference:
              c.reference ||
              c.customer_reference ||
              c.customer_profile?.reference ||
              c.customer_profile?.customer_reference ||
              "—",
            fkCompany: c.fk_company ? String(c.fk_company) : c.customer_profile?.fk_company ? String(c.customer_profile.fk_company) : "—",
            fkMerchantUser: c.fk_merchant_user || c.company_id || c.customer_profile?.fk_merchant_user || c.customer_profile?.company_id || "—",
            isActive: c.is_active ?? true,
            createdAt: c.created_at ? new Date(c.created_at).toLocaleString() : "—",
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
        }
      }
    } catch (e) {
      console.error("Failed to load companies:", e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle company search input change
  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCompanySearch(val)
    setIsCompanyDropdownOpen(true)

    // Check if the typed value matches an existing company
    const match = companies.find((c) => c.name.toLowerCase() === val.trim().toLowerCase())
    if (match) {
      setSelectedCompanyId(match.id)
    } else {
      setSelectedCompanyId("")
    }
  }

  // Handle selecting an existing company from dropdown
  const handleSelectCompany = (comp: CompanyOption) => {
    setCompanySearch(comp.name)
    setSelectedCompanyId(comp.id)
    setIsCompanyDropdownOpen(false)
  }

  // Filter companies for the searchable dropdown
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.id.toLowerCase().includes(companySearch.toLowerCase())
  )

  const filteredEditCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(editCompanySearch.toLowerCase()) ||
    c.id.toLowerCase().includes(editCompanySearch.toLowerCase())
  )

  // Reset form to defaults
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA)
    setCompanySearch("")
    setSelectedCompanyId("")
    setIsCompanyDropdownOpen(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (!formData.email.trim()) {
        throw new Error("Email address is required.")
      }
      if (!formData.salutation.trim()) {
        throw new Error("Salutation is a compulsory field. Please select a salutation.")
      }
      if (!formData.firstName.trim()) {
        throw new Error("First Name is a compulsory field.")
      }
      if (!formData.lastName.trim()) {
        throw new Error("Last Name is a compulsory field.")
      }
      if (!companySearch.trim()) {
        throw new Error("Company Name is a compulsory field. Please select or enter a company name.")
      }

      // If user typed in textbox and didn't pick an existing company, whatever is written in the textbox is considered company name
      const resolvedCompanyName = companySearch.trim()
      const resolvedCompanyId = selectedCompanyId || undefined

      const payload = {
        email: formData.email.trim(),
        salutation: formData.salutation,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        company_name: resolvedCompanyName,
        fk_company: resolvedCompanyId,
        company_id: resolvedCompanyId,
        fk_merchant_user: resolvedCompanyId,
        position: formData.position.trim() || undefined,
        locale: formData.localeCode || "en_US",
        locale_code: formData.localeCode || "en_US",
        send_password_reset_email: formData.sendPasswordResetEmail,
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

      const ref =
        createdCustomer?.reference ||
        createdCustomer?.customer_reference ||
        createdCustomer?.customer_profile?.reference ||
        createdCustomer?.customer_profile?.customer_reference ||
        "Generated"
      const assignedCompany = resolvedCompanyName || "—"
      const resetNotif = formData.sendPasswordResetEmail ? " | Password reset email dispatched" : ""

      setSuccessMessage(
        `Customer '${formData.firstName} ${formData.lastName}' saved successfully! Company: ${assignedCompany} | Reference: ${ref}${resetNotif}`
      )
      setIsModalOpen(false)

      // Refresh customers and companies
      await fetchCustomers()
      await fetchCompanies()

      // Reset form
      handleReset()
    } catch (err: any) {
      setError(err?.message || "Failed to save customer")
    } finally {
      setLoading(false)
    }
  }

  // Handlers for View, Edit, Deactivate, and Delete Operations
  const handleViewCustomer = async (c: CustomerRow) => {
    setIsViewLoading(true)
    setIsViewModalOpen(true)
    setViewCustomerData(null)
    try {
      const res = await fetch(`/api/customers/${c.id}`)
      if (res.ok) {
        const data = await res.json()
        setViewCustomerData(data.customer)
      } else {
        setViewCustomerData(c)
      }
    } catch (e) {
      setViewCustomerData(c)
    } finally {
      setIsViewLoading(false)
    }
  }

  const handleOpenEdit = (c: CustomerRow) => {
    setEditCustomerId(c.id)
    setEditFormData({
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      email: c.email || "",
      phone: c.phone || "",
      salutation: c.salutation || "",
      position: c.position || "",
      localeCode: c.locale || "en_US",
    })
    setEditCompanySearch(c.company !== "—" ? c.company : "")
    setSelectedEditCompanyId(c.fkCompany !== "—" ? c.fkCompany || "" : "")
    setError(null)
    setIsEditModalOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEditCompanySearch(val)
    setIsEditCompanyDropdownOpen(true)
    const match = companies.find((c) => c.name.toLowerCase() === val.trim().toLowerCase())
    if (match) {
      setSelectedEditCompanyId(match.id)
    } else {
      setSelectedEditCompanyId("")
    }
  }

  const handleSelectEditCompany = (comp: CompanyOption) => {
    setSelectedEditCompanyId(comp.id)
    setEditCompanySearch(comp.name)
    setIsEditCompanyDropdownOpen(false)
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsActionLoading(true)
    setError(null)

    try {
      const payload: any = {
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        salutation: editFormData.salutation || null,
        position: editFormData.position || null,
        locale: editFormData.localeCode || "en_US",
      }

      if (selectedEditCompanyId) {
        payload.fk_company = selectedEditCompanyId
        payload.company_id = selectedEditCompanyId
      }
      if (editCompanySearch.trim()) {
        payload.company_name = editCompanySearch.trim()
      }

      const res = await fetch(`/api/customers/${editCustomerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to update customer")
      }

      setSuccessMessage(`Customer '${editFormData.firstName} ${editFormData.lastName}' updated successfully!`)
      setIsEditModalOpen(false)
      await fetchCustomers()
      await fetchCompanies()
    } catch (err: any) {
      setError(err?.message || "Failed to update customer")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleToggleDeactivate = async (c: CustomerRow) => {
    setIsActionLoading(true)
    try {
      const res = await fetch(`/api/customers/${c.id}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !c.isActive }),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to update customer status")
      }
      const data = await res.json()
      const actionText = data.is_active ? "activated" : "deactivated"
      setSuccessMessage(`Customer '${c.name || c.id}' ${actionText} successfully!`)
      await fetchCustomers()
    } catch (err: any) {
      setError(err?.message || "Failed to update customer status")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return
    setIsActionLoading(true)
    try {
      const res = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to delete customer")
      }
      setSuccessMessage(`Customer '${customerToDelete.name || customerToDelete.id}' deleted successfully!`)
      setIsDeleteModalOpen(false)
      setCustomerToDelete(null)
      await fetchCustomers()
    } catch (err: any) {
      setError(err?.message || "Failed to delete customer")
    } finally {
      setIsActionLoading(false)
    }
  }

  const customerColumns: DataTableColumn<CustomerRow>[] = [
    {
      key: "id",
      header: "Customer ID",
      sortable: true,
      render: (c) => <span className={styles.customerId}>{c.id}</span>,
    },
    {
      key: "reference",
      header: "Reference",
      sortable: true,
      render: (c) => <span className={styles.reference}>{c.reference || "—"}</span>,
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
      render: (c) => <span className={styles.company}>{c.company}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (c) => c.email || "—",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (c) => (
        <Badge variant={c.status === "Inactive" ? "default" : "success"} size="sm">
          {c.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (c) => (
        <div className={styles.rowActions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnView}`}
            onClick={() => handleViewCustomer(c)}
            title="View Details"
          >
            View
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
            onClick={() => handleOpenEdit(c)}
            title="Edit Customer"
          >
            Edit
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
            onClick={() => {
              setCustomerToDelete(c)
              setIsDeleteModalOpen(true)
            }}
            disabled={isActionLoading}
            title="Delete Customer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="List of all customers in the system, including their company, tier, and status."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Customers" }]}
        actions={
          <Button variant="primary" onClick={() => { handleReset(); setIsModalOpen(true); }}>
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
        <DataTable
          columns={customerColumns}
          data={customers}
          keyField="id"
          searchPlaceholder="Search customers by company, reference, email, ID..."
          defaultSortKey="id"
          pageSizeOptions={[5, 10, 25, 50]}
          defaultPageSize={10}
          emptyMessage="No customers found."
        />
      </Card>

      {/* Customer Creation Modal (70-80% Screen Width) */}
      <ModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Customer"
        size="wide"
      >
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className={styles.alertError}>{error}</div>}

          <div className={styles.formGrid}>
            {/* 1. Email */}
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

            {/* 2. Salutation (Compulsory) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="salutation">
                Salutation <span className={styles.requiredStar}>*</span>
              </label>
              <select
                id="salutation"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Salutation * --</option>
                <option value="mr">Mr.</option>
                <option value="ms">Ms.</option>
                <option value="mrs">Mrs.</option>
                <option value="dr">Dr.</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* 3. First Name (Compulsory) */}
            <div>
              <Input
                label="First Name *"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
              />
            </div>

            {/* 4. Last Name (Compulsory) */}
            <div>
              <Input
                label="Last Name *"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Doe"
              />
            </div>

            {/* 5. Phone */}
            <div>
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555-0199"
              />
            </div>

            {/* 6. Company (Compulsory, Searchable Dropdown / Combobox) */}
            <div className={styles.companyComboboxContainer} ref={companyDropdownRef}>
              <label htmlFor="companySearchInput">
                Company <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.companyInputWrapper}>
                <input
                  id="companySearchInput"
                  type="text"
                  value={companySearch}
                  onChange={handleCompanyInputChange}
                  onFocus={() => setIsCompanyDropdownOpen(true)}
                  placeholder="Search existing or enter new company name..."
                  autoComplete="off"
                  required
                />
                <span className={styles.companySearchIcon}>🔍</span>
              </div>

              {/* Status indicators */}
              {selectedCompanyId ? (
                <div className={styles.companyStatusLinked}>
                  <span>✓ Linked to existing company (ID: {selectedCompanyId})</span>
                  <button
                    type="button"
                    className={styles.clearLinkBtn}
                    onClick={() => setSelectedCompanyId("")}
                  >
                    Unlink
                  </button>
                </div>
              ) : companySearch.trim() ? (
                <div className={styles.companyStatusNew}>
                  <span>✦ Whatever is typed will be registered as company name: &quot;{companySearch.trim()}&quot;</span>
                </div>
              ) : null}

              {/* Searchable Dropdown Menu */}
              {isCompanyDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>Existing Companies ({filteredCompanies.length})</div>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp) => {
                      const isSelected = comp.id === selectedCompanyId
                      return (
                        <div
                          key={comp.id}
                          className={`${styles.dropdownItem} ${isSelected ? styles.dropdownItemActive : ""}`}
                          onClick={() => handleSelectCompany(comp)}
                        >
                          <span>{comp.name}</span>
                          <span className={styles.dropdownItemBadge}>{comp.id}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className={styles.dropdownEmpty}>No existing company matches.</div>
                  )}

                  {/* Option to use custom text as company name */}
                  {companySearch.trim() && (
                    <div
                      className={styles.dropdownNewItem}
                      onClick={() => {
                        setSelectedCompanyId("")
                        setIsCompanyDropdownOpen(false)
                      }}
                    >
                      <span className={styles.newBadge}>Custom</span>
                      <span>Use &quot;<strong>{companySearch.trim()}</strong>&quot; as company name</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 7. Position */}
            <div>
              <Input
                label="Position / Role"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Fleet Director"
              />
            </div>

            {/* 8. Locale */}
            <div className={styles.fieldGroup}>
              <label htmlFor="localeCode">Locale</label>
              <select
                id="localeCode"
                name="localeCode"
                value={formData.localeCode}
                onChange={handleChange}
              >
                <option value="en_US">en_US (English - United States)</option>
                <option value="en_GB">en_GB (English - United Kingdom)</option>
                <option value="de_DE">de_DE (German - Germany)</option>
                <option value="fr_FR">fr_FR (French - France)</option>
                <option value="es_ES">es_ES (Spanish - Spain)</option>
                <option value="sv_SE">sv_SE (Swedish - Sweden)</option>
                <option value="nl_NL">nl_NL (Dutch - Netherlands)</option>
              </select>
            </div>

            {/* 9. Send Password Reset Link through Email Checkbox */}
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="sendPasswordResetEmail"
                checked={formData.sendPasswordResetEmail}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <div className={styles.checkboxLabel}>
                <span className={styles.checkboxTitle}>Send password reset link through email</span>
                <span className={styles.checkboxSubtitle}>
                  Generates a secure password reset token and dispatches an onboarding invitation email to the customer.
                </span>
              </div>
            </label>

            {/* 10. Form Actions (Reset & Submit) */}
            <div className={styles.formActions}>
              <div className={styles.actionsLeft}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
              <div className={styles.actionsRight}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                >
                  Save Customer & Corporate Account
                </Button>
              </div>
            </div>
          </div>
        </form>
      </ModalShell>

      {/* View Customer Details Modal */}
      <ModalShell
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Customer Details"
        size="wide"
      >
        {isViewLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
            Loading customer details...
          </div>
        ) : viewCustomerData ? (
          <div>
            <div className={styles.viewDetailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Customer ID</span>
                <span className={styles.detailValue}>{viewCustomerData.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Reference</span>
                <span className={styles.detailValue}>
                  <Badge variant="default" size="sm">
                    {viewCustomerData.reference || viewCustomerData.customer_reference || "—"}
                  </Badge>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Full Name</span>
                <span className={styles.detailValue}>
                  {viewCustomerData.name || `${viewCustomerData.first_name || ""} ${viewCustomerData.last_name || ""}`.trim() || "—"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email Address</span>
                <span className={styles.detailValue}>{viewCustomerData.email || "—"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Company</span>
                <span className={styles.detailValue}>
                  {viewCustomerData.company?.name || viewCustomerData.company_name || viewCustomerData.company || "—"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{viewCustomerData.phone || "—"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Salutation</span>
                <span className={styles.detailValue}>
                  {viewCustomerData.salutation ? String(viewCustomerData.salutation).toUpperCase() : "—"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Position / Title</span>
                <span className={styles.detailValue}>{viewCustomerData.position || "—"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Account Status</span>
                <span className={styles.detailValue}>
                  <Badge
                    variant={viewCustomerData.status === "Inactive" || viewCustomerData.is_active === false ? "default" : "success"}
                    size="sm"
                  >
                    {viewCustomerData.status || (viewCustomerData.is_active === false ? "Inactive" : "Verified")}
                  </Badge>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Locale Code</span>
                <span className={styles.detailValue}>{viewCustomerData.locale || "en_US"}</span>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>Assigned Roles</span>
                <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {Array.isArray(viewCustomerData.roles) && viewCustomerData.roles.length > 0 ? (
                    viewCustomerData.roles.map((r: any) => (
                      <Badge key={r.id || r.role_id} variant="default" size="sm">
                        {r.role_name || r.name || "Admin"}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="default" size="sm">Admin</Badge>
                  )}
                </div>
              </div>
              {viewCustomerData.created_at && (
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>Created At</span>
                  <span className={styles.detailValue}>
                    {new Date(viewCustomerData.created_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      {/* Edit Customer Modal */}
      <ModalShell
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer"
        size="wide"
      >
        <form onSubmit={handleUpdateCustomer} noValidate>
          {error && <div className={styles.alertError}>{error}</div>}

          <div className={styles.formGrid}>
            <div>
              <Input
                label="First Name *"
                name="firstName"
                required
                value={editFormData.firstName}
                onChange={handleEditChange}
                placeholder="John"
              />
            </div>
            <div>
              <Input
                label="Last Name *"
                name="lastName"
                required
                value={editFormData.lastName}
                onChange={handleEditChange}
                placeholder="Doe"
              />
            </div>
            <div>
              <Input
                label="Email Address *"
                name="email"
                type="email"
                required
                value={editFormData.email}
                onChange={handleEditChange}
                placeholder="buyer@enterprise.com"
              />
            </div>
            <div>
              <Input
                label="Phone Number"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                placeholder="+1 555-0199"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="edit_salutation">Salutation</label>
              <select
                id="edit_salutation"
                name="salutation"
                value={editFormData.salutation}
                onChange={handleEditChange}
              >
                <option value="">Select salutation...</option>
                <option value="mr">Mr</option>
                <option value="ms">Ms</option>
                <option value="mrs">Mrs</option>
                <option value="dr">Dr</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Input
                label="Position / Title"
                name="position"
                value={editFormData.position}
                onChange={handleEditChange}
                placeholder="Procurement Director"
              />
            </div>

            {/* Edit Company Combobox */}
            <div className={`${styles.fieldGroup} ${styles.formFullWidth}`} ref={editCompanyDropdownRef}>
              <label>Company</label>
              <div className={styles.searchableInputWrapper}>
                <input
                  type="text"
                  className={styles.comboboxInput}
                  placeholder="Type to search or register new company..."
                  value={editCompanySearch}
                  onChange={handleEditCompanyInputChange}
                  onFocus={() => setIsEditCompanyDropdownOpen(true)}
                />
              </div>

              {selectedEditCompanyId ? (
                <div className={styles.companyStatusLinked}>
                  <span>✓ Linked to company (ID: {selectedEditCompanyId})</span>
                  <button
                    type="button"
                    className={styles.clearLinkBtn}
                    onClick={() => setSelectedEditCompanyId("")}
                  >
                    Unlink
                  </button>
                </div>
              ) : null}

              {isEditCompanyDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>Existing Companies ({filteredEditCompanies.length})</div>
                  {filteredEditCompanies.length > 0 ? (
                    filteredEditCompanies.map((comp) => (
                      <div
                        key={comp.id}
                        className={`${styles.dropdownItem} ${comp.id === selectedEditCompanyId ? styles.dropdownItemActive : ""}`}
                        onClick={() => handleSelectEditCompany(comp)}
                      >
                        <span>{comp.name}</span>
                        <span className={styles.dropdownItemBadge}>{comp.id}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.dropdownEmpty}>No existing company matches.</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <div className={styles.actionsLeft}></div>
              <div className={styles.actionsRight}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isActionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isActionLoading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      </ModalShell>

      {/* Delete Confirmation Modal */}
      <ModalShell
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer"
        size="sm"
      >
        <div>
          <div className={styles.deleteWarningBox}>
            <strong>Warning:</strong> Are you sure you want to delete customer{" "}
            <strong>{customerToDelete?.name || customerToDelete?.id}</strong>
            {customerToDelete?.reference ? ` (${customerToDelete.reference})` : ""}?
            <br />
            This operation will permanently remove the customer profile and its company roles from the system.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleDeleteCustomer}
              isLoading={isActionLoading}
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </ModalShell>
    </div>
  )
}
