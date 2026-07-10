import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";
import { RefreshToken } from "#domain/models/refresh-token.ts";

interface SessionPayload {
  accessToken: string;
  refreshToken: string;
}

export async function refresh(refreshTokenId: string): Promise<Result2<SessionPayload>> {
  const oldRefreshToken = await orm.em.findOne(RefreshToken, {
    id: refreshTokenId,
    expiresAt: {
      $gt: Temporal.Now.instant(),
    },
  });

  if (!oldRefreshToken) {
    return {
      error: "INVALID_REFRESH_TOKEN",
    };
  }

  const newRefreshToken = RefreshToken.extendFrom(oldRefreshToken);

  orm.em.persist(newRefreshToken);
  orm.em.remove(oldRefreshToken);

  await orm.em.flush();

  const { accessToken } = generateToken(newRefreshToken);

  return {
    accessToken,
    refreshToken: newRefreshToken.id,
  };
}

const test = await refresh("123");

if ("error" in test) {
} else {
}
