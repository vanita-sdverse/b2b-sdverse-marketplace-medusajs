import React, { useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Button, Heading, Text, Input, Select, FocusModal, toast } from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"

const CustomerListActionWidget = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [salutation, setSalutation] = useState("mr")
  const [gender, setGender] = useState("male")
  const [position, setPosition] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [localeCode, setLocaleCode] = useState("en_US")

  const handleCreate = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("Error", { description: "Email, first name, and last name are required." })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/admin/customers-with-profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          company_name: company || undefined,
          phone: phone || undefined,
          salutation,
          position: position || undefined,
          locale_code: localeCode,
        }),
      })

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to create customer")
      }

      const data = await response.json()
      toast.success("Success", {
        description: `Customer created successfully! Reference: ${data?.customer?.customer_profile?.customer_reference || "Generated"}`,
      })
      setOpen(false)
      window.location.reload()
    } catch (err: any) {
      toast.error("Error", { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container className="flex items-center justify-between p-4 mb-4">
        <div>
          <Heading level="h2" className="text-sm font-semibold">
            Customer Directory & B2B Buyer Profiles
          </Heading>
          <Text className="text-ui-fg-subtle text-xs">
            Manage corporate buyers, legacy references, and custom profile attributes.
          </Text>
        </div>
        <Button size="small" variant="primary" onClick={() => setOpen(true)}>
          <PlusMini />
          Create Customer
        </Button>
      </Container>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-between w-full pr-4">
              <Heading level="h1" className="text-base font-semibold">
                Create Customer with Extended Profile
              </Heading>
              <div className="flex items-center gap-x-2">
                <Button size="small" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="small" variant="primary" isLoading={loading} onClick={handleCreate}>
                  Save Customer
                </Button>
              </div>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="p-8 max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Email Address *</Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@domain.com"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Company Name</Text>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Automotive Logistics Hub"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">First Name *</Text>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Last Name *</Text>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Phone</Text>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0100"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Position / Title</Text>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Procurement Officer"
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Salutation</Text>
                <Select value={salutation} onValueChange={setSalutation}>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="mr">Mr.</Select.Item>
                    <Select.Item value="ms">Ms.</Select.Item>
                    <Select.Item value="mrs">Mrs.</Select.Item>
                    <Select.Item value="dr">Dr.</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Gender</Text>
                <Select value={gender} onValueChange={setGender}>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="male">Male</Select.Item>
                    <Select.Item value="female">Female</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                    <Select.Item value="unspecified">Unspecified</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Date of Birth</Text>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div>
                <Text className="text-xs font-medium text-ui-fg-muted mb-1">Locale</Text>
                <Input
                  value={localeCode}
                  onChange={(e) => setLocaleCode(e.target.value)}
                  placeholder="en_US"
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.list.before",
})

export default CustomerListActionWidget
