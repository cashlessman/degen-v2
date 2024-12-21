import NextAuth from "next-auth"
import { authOptions } from "~/auth"

export const handler = NextAuth({
    ...authOptions,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  export { handler as GET, handler as POST };