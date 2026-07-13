import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const REFRESH_COOKIE_NAME = "refresh-token";
const PATH = "/v1/auth";

export function getRefreshTokenCookie(c: Context) {
  return getCookie(c, REFRESH_COOKIE_NAME, "secure");
}

export function setRefreshTokenCookie(c: Context, refreshToken: string, expiresAt: number) {
  setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: PATH,
    maxAge: expiresAt,
    prefix: "secure",
  });
}

export function deleteRefreshTokenCookie(c: Context) {
  deleteCookie(c, REFRESH_COOKIE_NAME, {
    secure: true,
    path: PATH,
    prefix: "secure",
  });
}
