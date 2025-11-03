import { router, publicProcedure, protectedProcedure } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const booksRouter = router({
  // Book details query
  getBookDetails: publicProcedure
    .input(
      z.object({
        googleBooksId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // First try to get from our database
      let book = await ctx.prisma.book.findUnique({
        where: {
          googleBooksId: input.googleBooksId,
        },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      // If not in database, fetch from Google Books API and save
      if (!book) {
        try {
          // Fetch volume by Google Books volume ID (not ISBN)
          const apiKey = process.env.GOOGLE_API_KEY;
          const baseUrl = `https://www.googleapis.com/books/v1/volumes/${input.googleBooksId}`;
          const url = apiKey ? `${baseUrl}?key=${apiKey}` : baseUrl;
          const resp = await fetch(url);
          if (!resp.ok) {
            throw new Error(`Google Books responded ${resp.status}`);
          }
          const googleBook = await resp.json();
          const volumeInfo = googleBook?.volumeInfo;
          if (!volumeInfo) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Book not found",
            });
          }

          // Save to database
          book = await ctx.prisma.book.create({
            data: {
              googleBooksId: input.googleBooksId,
              title: volumeInfo.title,
              subtitle: volumeInfo.subtitle || null,
              description: volumeInfo.description || null,
              authors: volumeInfo.authors || [],
              publisher: volumeInfo.publisher || null,
              publishedDate: volumeInfo.publishedDate || null,
              pageCount: volumeInfo.pageCount || null,
              categories: volumeInfo.categories || [],
              averageRating: volumeInfo.averageRating || null,
              ratingsCount: volumeInfo.ratingsCount || null,
              imageUrl: volumeInfo.imageLinks?.thumbnail || null,
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
              userBooks: ctx.session?.user?.id
                ? {
                    where: {
                      userId: ctx.session.user.id,
                    },
                    select: {
                      state: true,
                    },
                  }
                : false,
            },
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch book details",
          });
        }
      }

      return book;
    }),

  getUserBookStatus: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userBook = await ctx.prisma.userXBook.findFirst({
        where: {
          userId: ctx.session.user.id,
          bookId: input.bookId,
        },
        select: {
          state: true,
        },
      });

      return { state: userBook?.state || "" };
    }),

  // User x Book mutations
  getUserBooks: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.prisma.userXBook.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        book: true,
      },
    });

    return books;
  }),

  saveUserBook: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        book_state: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already has this book
      const existingUserBook = await ctx.prisma.userXBook.findFirst({
        where: {
          userId: ctx.session.user.id,
          bookId: input.bookId,
        },
      });

      let user_book;
      if (existingUserBook) {
        // Update existing record
        user_book = await ctx.prisma.userXBook.update({
          where: {
            id: existingUserBook.id,
          },
          data: {
            state: input.book_state,
          },
        });
      } else {
        // Create new record
        user_book = await ctx.prisma.userXBook.create({
          data: {
            userId: ctx.session.user.id,
            bookId: input.bookId,
            state: input.book_state,
          },
        });
      }

      return user_book;
    }),

  removeUserBook: protectedProcedure
    .input(
      z.object({
        userBookId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user owns the book
      const userBook = await ctx.prisma.userXBook.findUnique({
        where: { id: input.userBookId },
        select: { userId: true },
      });

      if (!userBook || userBook.userId !== ctx.session.user.id) {
        throw new TRPCError({
          message: "You can only remove your own books",
          code: "FORBIDDEN",
        });
      }

      await ctx.prisma.userXBook.delete({
        where: { id: input.userBookId },
      });

      return { success: true };
    }),

  // Comment mutations
  addComment: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        content: z.string().min(1, "Comment cannot be empty"),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          rating: input.rating,
          userId: ctx.session.user.id,
          bookId: input.bookId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return comment;
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user owns the comment
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.commentId },
        select: { userId: true },
      });

      if (!comment || comment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          message: "You can only delete your own comments",
          code: "FORBIDDEN",
        });
      }

      await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      });

      return { success: true };
    }),
});
