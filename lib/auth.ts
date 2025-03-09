import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/error",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // Here you would normally check the password against the hashed password in the database
        // This is a simplified example
        const passwordMatch = await bcrypt.compare(credentials.password, user.password || "")

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username as string
        session.user.isCreator = token.isCreator as boolean
      }

      return session
    },
    async jwt({ token, user, trigger, session }) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!existingUser) {
        return token
      }

      if (trigger === "update" && session) {
        // Update the token based on the session update
        return { ...token, ...session.user }
      }

      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        picture: existingUser.image,
        username: existingUser.username,
        isCreator: existingUser.creatorProfile,
      }
    },
  },
}

export const getSession = () => getServerSession(authOptions)

