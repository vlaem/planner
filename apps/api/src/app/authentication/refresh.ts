import { RefreshToken } from "#domain/models/refresh-token.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";

import { InvalidRefreshTokenError } from "./errors.ts";
import type { SessionPayload } from "./types.ts";

export async function refresh(refreshTokenId: string): Promise<SessionPayload> {
  const oldRefreshToken = await orm.em.findOne(RefreshToken, {
    id: refreshTokenId,
    expiresAt: {
      $gt: Temporal.Now.instant(),
    },
  });

  if (!oldRefreshToken) {
    throw new InvalidRefreshTokenError();
  }

  const { refreshToken, expiresIn } = RefreshToken.extendFrom(oldRefreshToken);

  orm.em.persist(refreshToken);
  orm.em.remove(oldRefreshToken);
  await orm.em.flush();

  const { accessToken } = generateToken(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.id,
    refreshTokenExpiresIn: expiresIn,
  };
}
