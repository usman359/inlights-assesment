import NextAuth from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";

const handler = NextAuth({
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_business_content_publish",
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
});

export { handler as GET, handler as POST };
