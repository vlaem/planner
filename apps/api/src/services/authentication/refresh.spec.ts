import { describe, vi, it, expect } from "vitest";

import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";
import { verifyPassword } from "#infra/passwords.ts";

import { InvalidUsernameOrPasswordError } from "./errors.ts";
import { logIn } from "./log-in.ts";

vi.mock("#infra/db/mikro-orm.ts");
vi.mock("#infra/passwords.ts");
vi.mock("#infra/jwt.ts");
