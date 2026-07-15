import { Migration } from '@mikro-orm/migrations';

export class Migration20260715185853 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`);

    this.addSql(`create table "users" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "refresh_tokens" ("id" varchar(255) not null, "user_id" int not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;`);

    this.addSql(`drop table if exists "refresh_token" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "refresh_tokens" drop constraint "refresh_tokens_user_id_foreign";`);

    this.addSql(`create table "refresh_token" ("created_at" timestamptz(6) not null, "expires_at" timestamptz(6) not null, "id" varchar(255) not null, "user_id" int not null, primary key ("id"));`);

    this.addSql(`create table "user" ("created_at" timestamptz(6) not null, "email" varchar(255) not null, "id" serial primary key, "password" varchar(255) not null, "updated_at" timestamptz(6) not null);`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);
    this.addSql(`drop table if exists "refresh_tokens" cascade;`);
  }

}
