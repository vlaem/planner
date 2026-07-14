import jwt from "jsonwebtoken";
import { z } from "zod";

import { User } from "#domain/models/user.ts";

import { Config } from "./config.ts";

export const TokenExpiredError = jwt.TokenExpiredError;

type Payload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

const GenerateTokenInputSchema = z.object({
  user: z.instanceof(User).refine((user) => !!user.id, {
    message: "An existing user which has an ID is required",
  }),
});

export function generateToken(input: z.input<typeof GenerateTokenInputSchema>) {
  GenerateTokenInputSchema.parse(input);

  const now = Temporal.Now.instant();
  const expiresAt = now.add(Config.JWT.duration);
  const iat = Math.trunc(now.epochMilliseconds / 1000);
  const exp = Math.trunc(expiresAt.epochMilliseconds / 1000);

  const payload: Payload = {
    sub: input.user.id.toString(),
    email: input.user.email,
    iat,
    exp,
  };

  const accessToken = jwt.sign(payload, Config.JWT.secret);

  return { accessToken, expiresAt };
}

export function decodeToken(token: string) {
  const decoded = jwt.verify(token, Config.JWT.secret);

  return decoded as Payload;
}
