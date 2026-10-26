import React, { useEffect, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminCustomer } from "@medusajs/types"
import { Container, Heading, Text, Badge, StatusBadge } from "@medusajs/ui"

type CustomerProfileData = {
  id?: string
  customer_reference?: string
  salutation?: string | null
  position?: string | null
  locale_code?: string | null
  anonymized_at?: string | null
  registered_at?: string | null
  legacy_customer_id?: number | null
}

const CustomerProfileWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [profile, setProfile] = useState<CustomerProfileData | null>(
    (data as any)?.customer_profile || null
  )
  const [loading, setLoading] = useState<boolean>(!profile)

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/admin/customers/${data.id}/profile`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          const json = await response.json()
          if (isMounted && json.profile) {
            setProfile(json.profile)
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer profile:", err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (!profile) {
      fetchProfile()
    }

    return () => {
      isMounted = false
    }
  }, [data.id, profile])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2" className="text-base font-semibold">
            Customer Information
          </Heading>
          <Text className="text-ui-fg-subtle text-xs">
            Extended business profile and Spryker migrated identifiers
          </Text>
        </div>
        {profile?.anonymized_at && (
          <StatusBadge color="red">
            Anonymized ({new Date(profile.anonymized_at).toLocaleDateString()})
          </StatusBadge>
        )}
      </div>

      <div className="px-6 py-4 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
        <div>
          <Text className="text-ui-fg-muted text-xs font-medium">Customer Reference</Text>
          <Text className="font-mono text-xs font-semibold text-ui-fg-base mt-0.5">
            {profile?.customer_reference || "—"}
          </Text>
        </div>

        <div>
          <Text className="text-ui-fg-muted text-xs font-medium">Salutation</Text>
          <Text className="capitalize text-ui-fg-base mt-0.5">
            {profile?.salutation ? profile.salutation.toUpperCase() : "—"}
          </Text>
        </div>

        <div>
          <Text className="text-ui-fg-muted text-xs font-medium">Position / Role</Text>
          <Text className="text-ui-fg-base mt-0.5">
            {profile?.position || "—"}
          </Text>
        </div>

        <div>
          <Text className="text-ui-fg-muted text-xs font-medium">Locale</Text>
          <Text className="text-ui-fg-base mt-0.5">
            {profile?.locale_code ? (
              <Badge size="small" color="blue">
                {profile.locale_code}
              </Badge>
            ) : (
              "—"
            )}
          </Text>
        </div>

        {profile?.legacy_customer_id && (
          <div>
            <Text className="text-ui-fg-muted text-xs font-medium">Legacy ID (Spryker)</Text>
            <Text className="font-mono text-xs text-ui-fg-subtle mt-0.5">
              #{profile.legacy_customer_id}
            </Text>
          </div>
        )}

        {loading && (
          <div className="col-span-2 text-center text-ui-fg-muted text-xs py-2">
            Loading profile...
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomerProfileWidget
