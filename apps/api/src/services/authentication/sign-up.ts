import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { hashPassword } from "#infra/passwords.ts";
import { generateToken } from "#infra/jwt.ts";
import { RefreshToken } from "#domain/models/refresh-token.ts";

type Result<T> =
  | {
      error: never;
      result: T;
    }
  | {
      error: string;
      result: never;
    };

interface ErrorResult {
  error: string;
}

interface SessionPayload {
  accessToken: string;
  accessTokenExpiresAt: Temporal.Instant;
  refreshToken: string;
  refreshTokenExpiresAt: Temporal.Instant;
}

export async function signUp(email: string, password: string): Promise<Result<SessionPayload>> {
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
    return {
      error: "Email is already taken",
    } as Result<SessionPayload>;
  }

  const newUser = orm.em.create(User, {
    email,
    password: await hashPassword(password),
  });

  const refreshToken = RefreshToken.createFor(newUser);
  orm.em.persist(refreshToken);

  await orm.em.flush();

  const { accessToken, expiresAt } = generateToken(refreshToken);

  return {
    result: {
      accessToken,
      accessTokenExpiresAt: expiresAt,
      refreshToken: refreshToken.id,
      refreshTokenExpiresAt: refreshToken.expiresAt,
    },
  } as Result<SessionPayload>;
}
