import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261021115825 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customer_profile" add column if not exists "fk_merchant_user" text null, add column if not exists "company_id" text null, drop column if exists "company_name", add column if not exists "fk_company" text null, add column if not exists "created_by" text null, add column if not exists "updated_by" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customer_profile" drop column if exists "fk_merchant_user", drop column if exists "company_id", drop column if exists "company_name", drop column if exists "fk_company", drop column if exists "created_by", drop column if exists "updated_by";`);
  }

}
