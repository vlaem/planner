import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { hashPassword } from "#infra/passwords.ts";
import { generateToken } from "#infra/jwt.ts";
import { RefreshToken } from "#domain/models/refresh-token.ts";
import { EmailAlreadyTakenError } from "./errors.ts";

interface SessionPayload {
  accessToken: string;
  refreshToken: string;
}

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

  if (existingUser) {
    throw new EmailAlreadyTakenError();
  }

  const newUser = orm.em.create(User, {
    email,
    password: await hashPassword(password),
  });

  const refreshToken = RefreshToken.createFor(newUser);
  orm.em.persist(refreshToken);

  await orm.em.flush();

  const { accessToken } = generateToken(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.id,
  };
}
