"use server"

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateUserProfile(formData: FormData) {
  const session = await getSession()

  if (!session?.user) {
    return { error: "You must be logged in to update your profile" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const image = formData.get("image") as string

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        image: image || undefined,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        creatorProfile: true,
        _count: {
          select: {
            donations: {
              where: {
                status: "succeeded",
              },
            },
          },
        },
      },
    })

    if (!user) {
      return { error: "User not found" }
    }

    return {
      user: {
        ...user,
        supporterCount: user._count.donations,
      },
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { error: "Failed to fetch user" }
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        creatorProfile: true,
        _count: {
          select: {
            donations: {
              where: {
                status: "succeeded",
              },
            },
          },
        },
      },
    })

    if (!user) {
      return { error: "User not found" }
    }

    return {
      user: {
        ...user,
        supporterCount: user._count.donations,
      },
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { error: "Failed to fetch user" }
  }
}

