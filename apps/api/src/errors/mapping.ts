import {
  ConflictError,
  ForbiddenError,
  InvalidOperationError,
  ResourceNotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
  type CodedError,
} from "./base.ts";

type SupportedStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;

export function getStatusCode(error: CodedError): SupportedStatus {
  if (error instanceof InvalidOperationError) return 400;
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof ForbiddenError) return 403;
  if (error instanceof ResourceNotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof UnprocessableEntityError) return 422;

  return 500;
}
