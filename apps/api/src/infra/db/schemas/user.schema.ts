import { EntitySchema } from "@mikro-orm/core";
import { User } from "#domain/models/user.ts";

export const UserSchema = new EntitySchema({
  class: User,
  properties: {
    id: { type: "integer", primary: true, autoincrement: true },
    email: { type: "string" },
    password: { type: "string" },
    createdAt: { type: "datetime", onCreate: () => Date.now() },
    updatedAt: { type: "datetime", onCreate: () => Date.now(), onUpdate: () => Date.now() },
  },
});
