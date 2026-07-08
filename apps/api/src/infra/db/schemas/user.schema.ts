import { defineEntity, p } from "@mikro-orm/core";

export const UserSchema = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary().autoincrement(),
    email: p.string(),
    password: p.string().hidden().lazy(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
});
