"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { signIn } from "next-auth/react"

import { prisma } from "@/lib/prisma"

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const isCreator = formData.get("isCreator") === "true"

  if (!name || !email || !password) {
    return {
      error: "Missing required fields",
      success: false,
    }
  }

  // Check if username is provided for creators
  if (isCreator && !username) {
    return {
      error: "Username is required for creators",
      success: false,
    }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: username || undefined }],
      },
    })

    if (existingUser) {
      return {
        error: "User already exists",
        success: false,
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: username || null,
        creatorProfile: isCreator,
      },
    })

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error during registration:", error)
    return {
      error: "Registration failed",
      success: false,
    }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Missing required fields",
      success: false,
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
            success: false,
          }
        default:
          return {
            error: "Something went wrong",
            success: false,
          }
      }
    }

    return {
      error: "Login failed",
      success: false,
    }
  }
}

