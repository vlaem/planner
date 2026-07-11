import { OptionalProps, PrimaryKeyProp, type Reference, type Loaded } from "@mikro-orm/core";

import type { User } from "./user.ts";

const REFRESH_TOKEN_EXPIRY_DURATION = Temporal.Duration.from({ hours: 24 * 30 });
const REFRESH_TOKEN_EXTEND_DURATION = Temporal.Duration.from({ hours: 24 * 15 });

export class RefreshToken {
  [OptionalProps]?: "id" | "createdAt";
  [PrimaryKeyProp]?: "id";

  static createFor(user: User | Reference<User> | Loaded<User, never, "id">) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user as User;
    refreshToken.expiresAt = Temporal.Now.instant().add(REFRESH_TOKEN_EXPIRY_DURATION);

    return { refreshToken, expiresIn: REFRESH_TOKEN_EXPIRY_DURATION };
  }

  static extendFrom(previousRefreshToken: RefreshToken) {
    const refreshToken = new RefreshToken();
    refreshToken.user = previousRefreshToken.user;
    refreshToken.expiresAt = previousRefreshToken.expiresAt.add(REFRESH_TOKEN_EXTEND_DURATION);

    return { refreshToken, expiresIn: REFRESH_TOKEN_EXPIRY_DURATION };
  }

  id!: string;
  user!: User;
  createdAt!: Date;
  expiresAt!: Temporal.Instant;
}
