import { Migration } from '@mikro-orm/migrations';

export class Migration20260715025828 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
  }

}
