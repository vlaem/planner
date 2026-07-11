import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { CodedError } from "#errors/base.ts";
import { getStatusCode } from "#errors/mapping.ts";

export const handleErrors: ErrorHandler = async (error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  if (error instanceof CodedError) {
    const status = getStatusCode(error);

    const body: {
      message: string;
      code: string;
    } = {
      message: "An unexpected error occurred.",
      code: error.code,
    };

    return c.json(body, status);
  }

  return c.json(
    {
      message: "An unexpected error occurred.",
      code: "INTERNAL_ERROR",
    },
    500,
  );
};
