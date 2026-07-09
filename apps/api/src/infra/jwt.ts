import jwt from "jsonwebtoken";
import { Config } from "./config.ts";
import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";

export const TokenExpiredError = jwt.TokenExpiredError;

type Payload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

const GenerateTokenUserSchema = z
  .object({
    id: z.number().refine((id) => !!id, {
      message: "An existing user which has an id is required",
    }),
    email: z.string(),
  })
  .loose();

export function generateToken(user: z.input<typeof GenerateTokenUserSchema>) {
  GenerateTokenUserSchema.parse(user);

  const now = Temporal.Now.instant();
  const expiresAt = now.add(Config.JWT.duration);
  const iat = Math.trunc(now.epochMilliseconds / 1000);
  const exp = Math.trunc(expiresAt.epochMilliseconds / 1000);

  const payload: Payload = {
    sub: user.id.toString(),
    email: user.email,
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
