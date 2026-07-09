import jwt from "jsonwebtoken";
import { z } from "zod";

export const TokenExpiredError = jwt.TokenExpiredError;

export function generateToken() {}
