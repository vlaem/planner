import { RefreshToken } from "#domain/models/refresh-token.ts";
import { orm } from "#infra/db/mikro-orm.ts";

export async function logout(refreshTokenId: string) {
  await orm.em.nativeDelete(RefreshToken, refreshTokenId);
}
