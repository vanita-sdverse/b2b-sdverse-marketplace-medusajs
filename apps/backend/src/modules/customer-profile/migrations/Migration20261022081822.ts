import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261022081822 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "sdv_customers" ("id_customer" text not null, "first_name" text null, "last_name" text null, "reference" text null, "salutation" text null, "email" text null, "phone" text null, "fk_company" integer null, "position" text null, "locale" text null, "reset_password_token" text null, "anonymized_at" timestamptz null, "last_login" timestamptz null, "registered_at" timestamptz null, "created_at" timestamptz null, "updated_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "sdv_customers_pkey" primary key ("id_customer"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sdv_customers_deleted_at" ON "sdv_customers" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "customer_profile" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sdv_customers" cascade;`);
  }

}
