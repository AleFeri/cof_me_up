import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        // Update donation status
        await prisma.donation.updateMany({
          where: {
            paymentIntentId: paymentIntent.id,
          },
          data: {
            status: "succeeded",
          },
        })
        break

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object
        // Update donation status
        await prisma.donation.updateMany({
          where: {
            paymentIntentId: failedPaymentIntent.id,
          },
          data: {
            status: "failed",
          },
        })
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: `Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 400 },
    )
  }
}

