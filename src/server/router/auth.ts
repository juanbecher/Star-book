import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./context";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: publicProcedure
    .use(async ({ ctx, next }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next();
    })
    .query(async ({ ctx }) => {
      return "You are logged in and can see this secret message!";
    }),
});
