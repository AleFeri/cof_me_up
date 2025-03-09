"use server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function createDonation(formData: FormData) {
  const session = await getSession()

  if (!session?.user) {
    return { error: "You must be logged in to donate" }
  }

  const amount = formData.get("amount") as string
  const message = formData.get("message") as string
  const creatorId = formData.get("creatorId") as string

  if (!amount || !creatorId) {
    return { error: "Missing required fields" }
  }

  const amountInCents = Number.parseFloat(amount) * 100

  try {
    // Get creator
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    })

    if (!creator) {
      return { error: "Creator not found" }
    }

    // Create the donation record (initially pending)
    const donation = await prisma.donation.create({
      data: {
        amount: Number.parseFloat(amount),
        message,
        donorId: session.user.id,
        creatorId,
        status: "pending",
      },
    })

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInCents),
      currency: "usd",
      description: `Donation to ${creator.name || creator.username}`,
      metadata: {
        donationId: donation.id,
        creatorId,
        donorId: session.user.id,
      },
    })

    // Update the donation with the payment intent ID
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paymentIntentId: paymentIntent.id },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      donationId: donation.id,
    }
  } catch (error) {
    console.error("Error creating donation:", error)
    return { error: "Failed to create donation" }
  }
}

export async function updateDonationStatus(donationId: string, status: string) {
  try {
    await prisma.donation.update({
      where: { id: donationId },
      data: { status },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating donation status:", error)
    return { error: "Failed to update donation status" }
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

