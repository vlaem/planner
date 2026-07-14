import { AsyncLocalStorage } from "node:async_hooks";

import type { EntityManager } from "@mikro-orm/core";

export const ormStorage = new AsyncLocalStorage<EntityManager>();
