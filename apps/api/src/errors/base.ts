export type ErrorDetails = Record<string, unknown>;

type CodedErrorOptions = {
  cause?: unknown;
};

export abstract class CodedError extends Error {
  abstract readonly code: string;

  readonly exposeMessage: boolean = true;

  constructor(message: string, options: CodedErrorOptions = {}) {
    super(message, {
      cause: options.cause,
    });

    this.name = new.target.name;
  }
}
export abstract class ResourceNotFoundError extends CodedError {}
export abstract class UnauthorizedError extends CodedError {}
export abstract class ForbiddenError extends CodedError {}
export abstract class InvalidOperationError extends CodedError {}
export abstract class ConflictError extends CodedError {}
export abstract class UnprocessableEntityError extends CodedError {}
export abstract class SystemError extends CodedError {}
