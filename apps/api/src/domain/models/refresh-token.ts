import type { User } from "./user.ts";
import { OptionalProps, PrimaryKeyProp, type Reference, type Loaded } from "@mikro-orm/core";

const REFRESH_TOKEN_EXPIRY_DURATION = Temporal.Duration.from({ days: 30 });
const REFRESH_TOKEN_EXTEND_DURATION = Temporal.Duration.from({ days: 15 });

export class RefreshToken {
  [OptionalProps]?: "id" | "createdAt";
  [PrimaryKeyProp]?: "id";

  static createFor(user: User | Reference<User> | Loaded<User, never, "id">) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user as User;
    refreshToken.expiresAt = Temporal.Now.instant().add(REFRESH_TOKEN_EXPIRY_DURATION);

    return refreshToken;
  }

  static extendFrom(previousRefreshToken: RefreshToken) {
    const newRefreshToken = new RefreshToken();
    newRefreshToken.user = previousRefreshToken.user;
    newRefreshToken.expiresAt = previousRefreshToken.expiresAt.add(REFRESH_TOKEN_EXTEND_DURATION);

    return newRefreshToken;
  }

  id!: string;
  user!: User;
  createdAt!: Date;
  expiresAt!: Temporal.Instant;
}
