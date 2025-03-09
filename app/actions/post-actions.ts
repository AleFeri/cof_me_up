"use server"

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createPost(formData: FormData) {
  const session = await getSession()

  if (!session?.user) {
    return { error: "You must be logged in to create a post" }
  }

  if (!session.user.isCreator) {
    return { error: "Only creators can create posts" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const image = formData.get("image") as string

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: image || null,
        authorId: session.user.id,
      },
    })

    return { success: true, postId: post.id }
  } catch (error) {
    console.error("Error creating post:", error)
    return { error: "Failed to create post" }
  }
}

export async function getPostsByCreator(creatorId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: creatorId,
        published: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return { posts }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { error: "Failed to fetch posts" }
  }
}

export async function deletePost(postId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { error: "You must be logged in to delete a post" }
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return { error: "Post not found" }
    }

    if (post.authorId !== session.user.id) {
      return { error: "You can only delete your own posts" }
    }

    await prisma.post.delete({
      where: { id: postId },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { error: "Failed to delete post" }
  }
}

export async function getDonationsForCreator(creatorId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { error: "You must be logged in" }
  }

  if (session.user.id !== creatorId) {
    return { error: "Unauthorized" }
  }

  try {
    const donations = await prisma.donation.findMany({
      where: { creatorId, status: "succeeded" },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { donations }
  } catch (error) {
    console.error("Error fetching donations:", error)
    return { error: "Failed to fetch donations" }
  }
}

