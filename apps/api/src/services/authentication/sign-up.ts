import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { hashPassword } from "#infra/passwords.ts";
import * as argon2 from "argon2";

const argon2Options: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,

  // OWASP minimum-ish baseline:
  // memoryCost is in KiB, so 19 MiB = 19 * 1024 = 19456 KiB
  memoryCost: 19 * 1024,
  timeCost: 2,
  parallelism: 1,

  // 32 bytes is a normal password-hash output length.
  hashLength: 32,
};

export async function signUp(email: string, password: string) {
  const existingUser = await orm.em.getRepository(User).findOne(
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
    };
  }

  const newUser = orm.em.create(User, {
    email,
    password: await hashPassword(password),
  });
<|
  await orm.em.flush();
}
