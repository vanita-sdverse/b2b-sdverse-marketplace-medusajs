import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261022084419 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "sdv_customers" drop column if exists "customer_reference", drop column if exists "locale_code", drop column if exists "fk_merchant_user", drop column if exists "company_id", drop column if exists "legacy_customer_id", drop column if exists "created_by", drop column if exists "updated_by";`);

    this.addSql(`alter table if exists "sdv_customers" alter column "id_customer" type int using ("id_customer"::int);`);
    this.addSql(`create sequence if not exists "sdv_customers_id_customer_seq";`);
    this.addSql(`select setval('sdv_customers_id_customer_seq', (select max("id_customer") from "sdv_customers"));`);
    this.addSql(`alter table if exists "sdv_customers" alter column "id_customer" set default nextval('sdv_customers_id_customer_seq');`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "sdv_customers" add column if not exists "customer_reference" text null, add column if not exists "locale_code" text null, add column if not exists "fk_merchant_user" text null, add column if not exists "company_id" text null, add column if not exists "legacy_customer_id" integer null, add column if not exists "created_by" text null, add column if not exists "updated_by" text null;`);
    this.addSql(`alter table if exists "sdv_customers" alter column "id_customer" type text using ("id_customer"::text);`);
    this.addSql(`alter table if exists "sdv_customers" alter column "id_customer" drop default;`);
  }

}
