// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Add the role here
      email: string;
      name: string;
    };
  }

  interface JWT {
    role: string; // Add the role here as well
  }
}
