import type { User } from "./user.ts";

export class RefreshToken {
  id!: string;
  user!: User;
  createdAt!: Date;
  expiresAt!: Date;
}
