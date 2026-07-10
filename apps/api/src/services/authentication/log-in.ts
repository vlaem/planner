import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { verifyPassword } from "#infra/passwords.ts";
import { generateToken } from "#infra/jwt.ts";
import { RefreshToken } from "#domain/models/refresh-token.ts";
import { InvalidUsernameOrPasswordError } from "./errors.ts";

interface SessionPayload {
  accessToken: string;
  refreshToken: string;
}

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

  const refreshToken = RefreshToken.createFor(user);

  orm.em.persist(refreshToken);
  await orm.em.flush();

  const { accessToken } = generateToken(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.id,
  };
}
