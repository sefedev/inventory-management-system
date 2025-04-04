import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Github],
  // debug: true,
});
