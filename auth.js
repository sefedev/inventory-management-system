import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Github],
  callbacks: {
    async session({session, user}) {
      session.user.id = user.id
      return session
    },
    async jwt ({token, user}) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  }
  // debug: true,
});
