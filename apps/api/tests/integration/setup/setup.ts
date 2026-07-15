import "temporal-polyfill/global";
import { beforeAll } from "vitest";

import { orm } from "#src/infra/db/mikro-orm.ts";

beforeAll(() => {
  orm.config.set("allowGlobalContext", true);
});
