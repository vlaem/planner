import { describe, expect, it, assert } from "vitest";

import { RefreshToken } from "#src/domain/models/refresh-token.ts";
import { User } from "#src/domain/models/user.ts";
import { orm } from "#src/infra/db/mikro-orm.ts";

import { client } from "./setup/client.ts";

describe("/api/v1/Health", () => {
  describe("POST /signup", () => {
    it("should return 201 and setup the User and RefreshToken", async () => {
      await orm.em.nativeDelete(User, {
        email: "signup-test@test.io",
      });

      const response = await client.api.v1.auth.signup.$post({
        json: {
          email: "signup-test@test.io",
          password: "valid-password",
        },
      });

      assert(response.status == 201, "Response status is not 201");

      const result = await response.json();
      expect(result).toMatchObject({
        accessToken: expect.any(String),
      });

      const newUser = await orm.em.findOne(User, {
        email: "signup-test@test.io",
      });

      expect(newUser).toBeDefined();

      const refreshToken = await orm.em.findOne(RefreshToken, {
        user: newUser,
      });

      assert(refreshToken);

      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`__Secure-refresh-token=${refreshToken.id}`),
        ]),
      );
    });
  });
  describe("POST /login", () => {
    it("should return 200 and setup the refresh-token", async () => {
      const existingUser = await orm.em.transactional(async (em) => {
        await orm.em.nativeDelete(User, {
          email: "login-test@test.io",
        });

        const user = em.create(User, {
          email: "login-test@test.io",
          password:
            "$argon2id$v=19$m=19456,t=2,p=1$UQBBkFLWx/ibP0HC5fpmrg$5Ir0NTRlGj6ck14CLRnn8vIC2Q0mAelIGMJu4o/I8wQ",
        });

        return user;
      });

      const response = await client.api.v1.auth.login.$post({
        json: {
          email: "login-test@test.io",
          password: "valid-password",
        },
      });

      assert(response.status == 200, "Response status is not 200");

      const result = await response.json();
      expect(result).toMatchObject({
        accessToken: expect.any(String),
      });

      const refreshToken = await orm.em.findOne(RefreshToken, {
        user: existingUser,
      });

      assert(refreshToken);

      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`__Secure-refresh-token=${refreshToken.id}`),
        ]),
      );
    });
    describe("POST /refresh", () => {
      it("should return 200 and setup the new refresh-token while deleting the previous", async () => {
        const { existingUser, prevRefreshToken } = await orm.em.transactional(async (em) => {
          await orm.em.nativeDelete(User, {
            email: "refresh-test@test.io",
          });

          const user = em.create(User, {
            email: "refresh-test@test.io",
            password: "-",
          });

          const refreshToken = em.create(RefreshToken, {
            id: "IOWZVeqhA__FnC3EO4wga8rUIAqlt0gsep2lCfw20ao",
            user: user,
            expiresAt: Temporal.Now.instant().add({ minutes: 30 }),
          });

          em.persist(refreshToken);

          return { existingUser: user, prevRefreshToken: refreshToken };
        });

        const response = await client.api.v1.auth.refresh.$post(
          {},
          {
            headers: {
              Cookie: `__Secure-refresh-token=${prevRefreshToken.id}`,
            },
          },
        );

        assert(response.status == 200, "Response status is not 200");

        const result = await response.json();
        expect(result).toMatchObject({
          accessToken: expect.any(String),
        });

        const newRefreshToken = await orm.em.findOne(RefreshToken, {
          user: existingUser,
          $not: {
            id: prevRefreshToken.id,
          },
        });

        assert(newRefreshToken);

        expect(response.headers.getSetCookie()).toEqual(
          expect.arrayContaining([
            expect.stringContaining(`__Secure-refresh-token=${newRefreshToken.id}`),
          ]),
        );

        const oldRefreshToken = await orm.em.findOne(
          RefreshToken,
          {
            id: prevRefreshToken.id,
          },
          {
            disableIdentityMap: true,
          },
        );

        expect(oldRefreshToken).toBeNull();
      });
    });
    describe("POST /logout", () => {
      it("should return 204 and destroy the previous RefreshToken", async () => {
        const { prevRefreshToken } = await orm.em.transactional(async (em) => {
          await orm.em.nativeDelete(User, {
            email: "logout-test@test.io",
          });

          const user = em.create(User, {
            email: "refresh-test@test.io",
            password: "-",
          });

          const refreshToken = em.create(RefreshToken, {
            id: "qUuN1mUHCZDTb3SaSGyQqJePl_yyvkfxAFdxWTEZ1Io",
            user: user,
            expiresAt: Temporal.Now.instant().add({ minutes: 30 }),
          });

          em.persist(refreshToken);

          return { existingUser: user, prevRefreshToken: refreshToken };
        });

        const response = await client.api.v1.auth.logout.$post(
          {},
          {
            headers: {
              Cookie: `__Secure-refresh-token=${prevRefreshToken.id}`,
            },
          },
        );

        assert(response.status == 204, "Response status is not 200");

        const oldRefreshToken = await orm.em.findOne(
          RefreshToken,
          {
            id: prevRefreshToken.id,
          },
          {
            disableIdentityMap: true,
          },
        );

        expect(oldRefreshToken).toBeNull();
      });
    });
  });
});
