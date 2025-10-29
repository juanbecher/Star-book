import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";

export const booksRouter = createRouter()
  .query("get-user-books", {
    async resolve({ ctx }) {
        if(!ctx.session || !ctx.session.user?.id){
            throw new TRPCError({
                message: "You are not signed in",
                code: "UNAUTHORIZED"
            })
        }

        const books = await ctx.prisma.userXBook.findMany({
          where: {
            userId: ctx.session.user.id
          }
        })
        
        return books
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  })
  .mutation("save-user-book", {
    input: z.object({
      bookId: z.string(),
      book_state: z.string(),
    }),
    async resolve({ctx, input}) {
      if(!ctx.session || !ctx.session.user?.id){
        throw new TRPCError({
            message: "You are not signed in",
            code: "UNAUTHORIZED"
        })
    }
      const user_book = await ctx.prisma.userXBook.create({
        data: {
          userId: ctx.session?.user?.id,
          bookId : input.bookId,
          state: input.book_state
        }
      })
      return user_book
    }
  });
