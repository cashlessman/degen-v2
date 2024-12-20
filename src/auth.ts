import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";

// Extend the Session interface to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      fid: number;
    };
  }
}

export const authOptions: AuthOptions = {
  // Add a secret for signing tokens in production
  //testing
  secret: process.env.NEXTAUTH_SECRET,

  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Sign in with Farcaster",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "Enter the message",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "Enter the signature",
        },
        name: {
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
        },
        pfp: {
          label: "PFP",
          type: "text",
          placeholder: "Enter your profile picture URL",
        },
      },
      async authorize(credentials, req) {
        const csrfToken = req?.body?.csrfToken;

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials?.message as string,
          signature: credentials?.signature as `0x${string}`,
          domain: new URL(process.env.NEXTAUTH_URL || "").hostname,
          nonce: csrfToken,
        });

        const { success, fid } = verifyResponse;

        if (!success) {
          return null;
        }

        // Return the user object with the `fid` for session management
        return {
          id: fid.toString(),
        };
      },
    }),
  ],

  // Callbacks for customizing session behavior
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.fid = parseInt(token.sub || "");
      }
      return session;
    },
  },
};

// Helper function to retrieve the session server-side
export const getSession = () => getServerSession(authOptions);
