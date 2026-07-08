import { defineEntity, p } from "@mikro-orm/core";
import { UserSchema } from "./user.schema.ts";

export const RefreshToken = defineEntity({
  name: "RefreshToken",
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(UserSchema),
    createdAt: p.datetime(),
    expiresAt: p.datetime(),
  },
});
