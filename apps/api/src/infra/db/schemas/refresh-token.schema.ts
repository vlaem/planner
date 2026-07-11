import { EntitySchema } from "@mikro-orm/core";
import { InstantType } from "mikro-orm-temporal";
import uidSafe from "uid-safe";

import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";

export const RefreshTokenSchema = new EntitySchema({
  class: RefreshToken,
  properties: {
    id: { type: "string", primary: true, onCreate: () => uidSafe.sync(32) },
    user: {
      nullable: false,
      kind: "m:1",
      entity: () => User,
    },
    createdAt: { type: "datetime", onCreate: () => Date.now() },
    expiresAt: { type: InstantType },
  },
});
