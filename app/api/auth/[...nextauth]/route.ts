import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();
        if (!credentials?.email || !credentials?.password) return null;

        let user = await User.findOne({ email: credentials.email });
        if (!user) {
          // Register a simple user dynamically if not found
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await User.create({
            email: credentials.email,
            password: hashedPassword,
            name: credentials.email.split('@')[0],
          });
        } else {
          // Verify
          if (!user.password) return null; // Google user
          const valid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!valid) return null;
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectToDatabase();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret',
});

export { handler as GET, handler as POST };
