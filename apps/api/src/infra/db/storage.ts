import type { EntityManager } from "@mikro-orm/core";
import { AsyncLocalStorage } from "node:async_hooks";

export const ormStorage = new AsyncLocalStorage<EntityManager>();
