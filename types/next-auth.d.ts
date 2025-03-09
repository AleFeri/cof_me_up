import type { User } from "next-auth"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username?: string
    isCreator?: boolean
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
      username?: string
      isCreator?: boolean
    }
  }

  interface User {
    username?: string
    isCreator?: boolean
  }
}

