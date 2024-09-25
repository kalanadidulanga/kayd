import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/clients";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Please provide email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            password: true, // Include password field
            role: true, // Include role field
            id: true,
            name: true,
            email: true,
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(password, user?.password);

        if (!isMatch) {
          throw new Error("Password does not match");
        }

        const userData = {
          id: user.id.toString(), // Cast id to string
          email: user.email,
          name: user.name,
          role: user.role,
        };

        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  // Optional: Callbacks for additional customizations
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
