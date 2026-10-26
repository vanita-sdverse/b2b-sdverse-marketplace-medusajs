  import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261021115808 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "role" drop constraint if exists "role_role_name_unique";`);
    this.addSql(`alter table if exists "company" drop constraint if exists "company_key_unique";`);
    this.addSql(`create table if not exists "company" ("id" text not null, "fk_owner" text null, "attributes" jsonb null, "is_active" boolean not null default true, "key" text not null, "name" text not null, "subscription_expiration_date" timestamptz null, "uuid" text not null, "created_by" text null, "updated_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "company_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_company_key_unique" ON "company" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_company_deleted_at" ON "company" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customer_role" ("id" text not null, "id_customer" integer not null, "id_role" text not null, "created_by" text null, "updated_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_role_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_role_deleted_at" ON "customer_role" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_role_customer_role_unique" ON "customer_role" ("id_customer", "id_role") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "role" ("id" text not null, "role_name" text not null, "description" text null, "created_by" text null, "updated_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "role_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_role_role_name_unique" ON "role" ("role_name") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_role_deleted_at" ON "role" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`CREATE SEQUENCE IF NOT EXISTS customer_id_customer_seq;`);
    this.addSql(`alter table if exists "customer" drop column if exists "company_name", add column if not exists "id_customer" integer default nextval('customer_id_customer_seq'), add column if not exists "fk_company" text null, add column if not exists "created_by" text null, add column if not exists "updated_by" text null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_id_customer_unique" ON "customer" ("id_customer") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_fk_company" ON "customer" ("fk_company") WHERE deleted_at IS NULL;`);

    this.addSql(`INSERT INTO "role" ("id", "role_name", "description", "created_at", "updated_at")
VALUES
  ('role_admin', 'Admin', 'Full administrative access to manage company details, invite/remove users, and assign roles.', now(), now()),
  ('role_product_creator', 'Product Creator', 'Authorized to create, draft, and modify marketplace products and specifications.', now(), now()),
  ('role_product_activator', 'Product Activator', 'Authorized to review, approve, and activate products into the live public catalog.', now(), now()),
  ('role_inquiry_approver', 'Inquiry Approver', 'Authorized to review, quote, approve, or reject RFQs (Request For Quotation) and purchase orders.', now(), now()),
  ('role_product_consumer', 'Product Consumer', 'Standard buyer role authorized to search the catalog, view approved pricing tiers, and place orders.', now(), now())
ON CONFLICT ("id") DO NOTHING;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "company" cascade;`);
    this.addSql(`drop table if exists "customer_role" cascade;`);
    this.addSql(`drop table if exists "role" cascade;`);
  }

}
