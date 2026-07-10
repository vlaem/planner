import { InvalidOperationError } from "#errors/base.ts";

export class EmailAlreadyTakenError extends InvalidOperationError {
  readonly code = "EMAIL_ALREADY_TAKEN";

  constructor() {
    super("Email already taken.");
  }
}

export class InvalidUsernameOrPasswordError extends InvalidOperationError {
  readonly code = "INVALID_USERNAME_OR_PASSWORD";

  constructor() {
    super("Invalid username or password.");
  }
}

export class InvalidRefreshTokenError extends InvalidOperationError {
  readonly code = "INVALID_REFRESH_TOKEN";

  constructor() {
    super("Invalid refresh token.");
  }
}
