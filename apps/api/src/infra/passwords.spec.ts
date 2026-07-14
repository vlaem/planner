import * as argon2 from "argon2";
import { describe, vi, it, expect } from "vitest";

import { hashPassword, verifyPassword } from "./passwords.ts";

vi.mock("argon2");

describe("passwords", () => {
  describe("hashPassword", () => {
    it("should call the argon2 lib", async () => {
      await hashPassword("password");
      expect(argon2.hash).toHaveBeenCalledWith("password", expect.anything());
    });
  });
  describe("verifyPassword", () => {
    it("should call the argon2 lib", async () => {
      await verifyPassword("hash", "password");
      expect(argon2.verify).toHaveBeenCalledWith("hash", "password");
    });
  });
});
