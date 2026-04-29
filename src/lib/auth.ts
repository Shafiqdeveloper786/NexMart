import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; role?: string } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT { id?: string; role?: string }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:        { label: "Email",         type: "email" },
        password:     { label: "Password",      type: "password" },
        sessionToken: { label: "Session Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = (credentials.email as string).trim().toLowerCase();

        // ── Session-token path (called after OTP verification) ──────────────
        // The verify-login and forgot-password pages exchange a short-lived
        // session token for a real NextAuth session, skipping password re-entry.
        if (credentials.sessionToken) {
          const record = await prisma.verificationToken.findFirst({
            where: {
              email,
              token: `SESSION:${credentials.sessionToken as string}`,
            },
          });

          if (!record || record.expires < new Date()) return null;

          // Consume the token — one-time use only
          await prisma.verificationToken.delete({ where: { id: record.id } });

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          return {
            id:    user.id,
            name:  user.name,
            email: user.email,
            image: user.image,
            role:  user.role,
          };
        }

        // ── Password path (direct credentials sign-in) ──────────────────────
        if (!credentials.password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;

        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          image: user.image,
          role:  user.role,
        };
      },
    }),

    GitHubProvider({
      clientId:     process.env.GITHUB_ID     || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  pages: { signIn: "/login", error: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // CredentialsProvider returns role directly; PrismaAdapter (OAuth) strips
        // custom fields, so we fall back to a DB lookup to get the real role.
        const directRole = (user as { role?: string }).role;
        if (directRole) {
          token.role = directRole;
        } else {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          token.role = dbUser?.role ?? "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
