"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateDonationStatus } from "@/app/actions/donation-actions"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentProps {
  clientSecret: string
  donationId: string
  amount: number
  creatorName: string
}

function StripePaymentForm({ clientSecret, donationId, amount, creatorName }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation/success`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment")
        await updateDonationStatus(donationId, "failed")
      } else if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          await updateDonationStatus(donationId, "succeeded")
          router.push(`/donation/success?amount=${amount}&creatorName=${encodeURIComponent(creatorName)}`)
        } else {
          await updateDonationStatus(donationId, paymentIntent.status)
          setErrorMessage("Payment is processing. Please check back later.")
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      setErrorMessage("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />
      {errorMessage && <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>}
      <div className="mt-6">
        <Button disabled={!stripe || isLoading} className="w-full" type="submit">
          {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  )
}

export function StripePaymentWrapper({ clientSecret, donationId, amount, creatorName }: StripePaymentProps) {
  if (!clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Card>
        <CardHeader>
          <CardTitle>Complete your donation</CardTitle>
        </CardHeader>
        <CardContent>
          <StripePaymentForm
            clientSecret={clientSecret}
            donationId={donationId}
            amount={amount}
            creatorName={creatorName}
          />
        </CardContent>
      </Card>
    </Elements>
  )
}

