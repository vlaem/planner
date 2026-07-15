import { EntitySchema } from "@mikro-orm/core";

import { User } from "#domain/models/user.ts";

export const UserSchema = new EntitySchema({
  class: User,
  properties: {
    id: { type: "integer", primary: true, autoincrement: true },
    email: { type: "string" },
    password: { type: "string", lazy: true },
    createdAt: { type: "datetime", onCreate: () => new Date() },
    updatedAt: { type: "datetime", onCreate: () => new Date(), onUpdate: () => new Date() },
  },
});
