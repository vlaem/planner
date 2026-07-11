import { Migration } from "@mikro-orm/migrations";

export class Migration20260708000507 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
