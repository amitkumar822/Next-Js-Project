import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/db/db'
import User from '@/models/userModel'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('No user found')

        const isMatch = await bcrypt.compare(credentials.password, user.password)
        if (!isMatch) throw new Error('Invalid password')

        return {
          id: user._id,
          email: user.email,
          name: user.fullName
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
})

export { handler as GET, handler as POST }
