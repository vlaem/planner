import { HiddenProps, OptionalProps, PrimaryKeyProp } from "@mikro-orm/core";

export class User {
  [HiddenProps]?: "password";
  [OptionalProps]?: "id" | "createdAt" | "updatedAt";
  [PrimaryKeyProp]?: "id";

  id!: number;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
