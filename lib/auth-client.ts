import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export type ExtraErrorCodes = "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

export type AllErrorCodes =
  | ExtraErrorCodes
  | keyof typeof authClient.$ERROR_CODES;

export type ErrorCodeToFormField<T extends z.ZodType<any>> = Partial<
  Record<
    AllErrorCodes,
    {
      field?: keyof z.infer<T> | "root";
      message?: string;
    }
  >
>;

export function handleFormError<TFormValues extends FieldValues>(
  form: ReturnType<typeof useForm<TFormValues>>,
  code:
    | keyof typeof authClient.$ERROR_CODES
    | ExtraErrorCodes
    | string
    | undefined,
  errorMap?: ErrorCodeToFormField<any>,
): string {
  const mapped = errorMap?.[code as keyof typeof errorMap];
  const message =
    mapped?.message ??
    globalErrorMessages[code as keyof typeof globalErrorMessages] ??
    "We could not process your request.";

  const target = mapped?.field ?? "root";
  form.setError(target as any, {
    type: "server",
    message,
  });

  return message;
}

export function handleError<TFormValues extends FieldValues>(
  code:
    | keyof typeof authClient.$ERROR_CODES
    | ExtraErrorCodes
    | string
    | undefined,
  errorMap?: ErrorCodeToFormField<any>,
): string {
  const mapped = errorMap?.[code as keyof typeof errorMap];
  const message =
    mapped?.message ??
    globalErrorMessages[code as keyof typeof globalErrorMessages] ??
    "We could not process your request.";

  return message;
}

export const globalErrorMessages: Partial<Record<AllErrorCodes, string>> = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Email already exists",
  INVALID_PASSWORD: "Password does not meet requirements",
  INVALID_EMAIL_OR_PASSWORD:
    "Incorrect email or password. Check your credentials and try again.",
  INVALID_EMAIL: "Email does not meet requirements",
  PASSWORD_TOO_LONG: "Password provided was too long",
  PASSWORD_TOO_SHORT: "Password provided was too short",
};

export const errorMap = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: { field: "email" },
  INVALID_EMAIL_OR_PASSWORD: { field: "root" },
  INVALID_EMAIL: { field: "email" },
  INVALID_PASSWORD: { field: "password" },
  PASSWORD_TOO_LONG: { field: "password" },
  PASSWORD_TOO_SHORT: { field: "password" },
};
