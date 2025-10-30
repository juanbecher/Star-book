import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../server/env.mjs";

// Simple in-memory demo users for testing
const TEST_USERS = [
  {
    id: "demo-alex",
    name: "Alex Demo",
    email: "alex.demo@example.com",
    username: "alex",
    password: "test",
  },
  {
    id: "demo-sam",
    name: "Sam Demo",
    email: "sam.demo@example.com",
    username: "sam",
    password: "test",
  },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "alex or sam",
        },
        password: { label: "Password", type: "password", placeholder: "test" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const found = TEST_USERS.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );
        if (!found) return null;
        const dbUser = await prisma.user.upsert({
          where: { id: found.id },
          update: {
            name: found.name,
            email: found.email,
          },
          create: {
            id: found.id,
            name: found.name,
            email: found.email,
          },
        });
        return { id: dbUser.id, name: dbUser.name, email: dbUser.email } as any;
      },
    }),
  ],
};

export default NextAuth(authOptions);
