import { MikroORM } from "@mikro-orm/core";

import config from "#src/mikro-orm.config.ts";

export const orm = await MikroORM.init({
  ...config,
});
