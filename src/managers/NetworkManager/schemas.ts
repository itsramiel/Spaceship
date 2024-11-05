import * as v from "valibot";

export const SignInResponseSchema = v.object({
  status: v.optional(v.string()),
  data: v.optional(
    v.object({
      accessToken: v.string(),
      refreshToken: v.string(),
    }),
  ),
});

export const ResponseSchema = v.object({
  status: v.optional(v.string()),
  data: v.optional(v.unknown()),
});

export type TResponse = v.InferOutput<typeof ResponseSchema>;
