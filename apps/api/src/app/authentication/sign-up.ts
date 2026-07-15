import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";
import { hashPassword } from "#infra/passwords.ts";

import { EmailAlreadyTakenError } from "./errors.ts";
import type { SessionPayload } from "./types.ts";

export async function signUp(email: string, password: string): Promise<SessionPayload> {
  const existingUser = await orm.em.findOne(
    User,
    {
      email: email,
    },
    {
      fields: ["id"],
    },
  );
  console.log("test2");
  if (existingUser) {
    throw new EmailAlreadyTakenError();
  }

  const newUser = orm.em.create(User, {
    email,
    password: await hashPassword(password),
  });

  const { refreshToken, expiresIn } = RefreshToken.createFor(newUser);
  orm.em.persist(refreshToken);

  await orm.em.flush();

  const { accessToken } = generateToken(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.id,
    refreshTokenExpiresIn: expiresIn,
  };
}
