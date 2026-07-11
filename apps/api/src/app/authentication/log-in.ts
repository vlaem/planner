import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";
import { verifyPassword } from "#infra/passwords.ts";

import { InvalidUsernameOrPasswordError } from "./errors.ts";
import type { SessionPayload } from "./types.ts";

export async function logIn(email: string, password: string): Promise<SessionPayload> {
  const user = await orm.em.findOne(
    User,
    {
      email: email,
    },
    {
      populate: ["password"],
      fields: ["id", "password"],
    },
  );

  if (!user) {
    throw new InvalidUsernameOrPasswordError();
  }

  const isVerified = await verifyPassword(user.password, password);

  if (!isVerified) {
    throw new InvalidUsernameOrPasswordError();
  }

  const { refreshToken, expiresIn } = RefreshToken.createFor(user);

  orm.em.persist(refreshToken);
  await orm.em.flush();

  const { accessToken } = generateToken(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.id,
    refreshTokenExpiresIn: expiresIn,
  };
}
