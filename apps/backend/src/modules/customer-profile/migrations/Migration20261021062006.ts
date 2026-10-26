import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261021062006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customer_profile" drop constraint if exists "customer_profile_customer_reference_unique";`);
    this.addSql(`create table if not exists "customer_profile" ("id" text not null, "customer_reference" text not null, "salutation" text check ("salutation" in ('mr', 'ms', 'mrs', 'dr', 'other')) null, "position" text null, "locale_code" text null, "anonymized_at" timestamptz null, "last_login" timestamptz null, "registered_at" timestamptz null, "legacy_customer_id" integer null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_profile_customer_reference_unique" ON "customer_profile" ("customer_reference") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_profile_deleted_at" ON "customer_profile" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_profile" cascade;`);
  }

}
