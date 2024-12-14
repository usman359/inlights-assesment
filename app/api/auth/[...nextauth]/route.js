import NextAuth from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      authorization: {
        url: "https://www.instagram.com/oauth/authorize",
        params: {
          enable_fb_login: 0,
          force_authentication: 1,
          client_id: process.env.INSTAGRAM_CLIENT_ID,
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
          response_type: "code",
          scope:
            "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure to set this in .env
});
