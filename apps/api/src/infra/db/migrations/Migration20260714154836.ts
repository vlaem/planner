import { Migration } from '@mikro-orm/migrations';

export class Migration20260714154836 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "refresh_token" ("id" varchar(255) not null, "user_id" int not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id");`);

    this.addSql(`alter table "user" add "created_at" timestamptz not null, add "updated_at" timestamptz not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "refresh_token" cascade;`);

    this.addSql(`alter table "user" drop column "created_at", drop column "updated_at";`);
  }

}
