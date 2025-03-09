"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { StripePaymentWrapper } from "@/components/stripe-payment-form"
import { createDonation } from "@/app/actions/donation-actions"

interface DonationFormProps {
  creatorName: string
  creatorUsername: string
  creatorId: string
  onCancel: () => void
}

export function DonationForm({ creatorName, creatorUsername, creatorId, onCancel }: DonationFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<"amount" | "payment" | "login">("amount")
  const [amount, setAmount] = useState<number | "custom">(5)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<{
    clientSecret: string
    donationId: string
  } | null>(null)

  const handleContinue = async () => {
    if (!session) {
      setStep("login")
      return
    }

    if (step === "amount") {
      setError(null)
      setIsSubmitting(true)

      try {
        const actualAmount = amount === "custom" ? Number.parseFloat(customAmount) : (amount as number)

        if (isNaN(actualAmount) || actualAmount <= 0) {
          setError("Please enter a valid amount")
          setIsSubmitting(false)
          return
        }

        const formData = new FormData()
        formData.append("amount", actualAmount.toString())
        formData.append("message", message)
        formData.append("creatorId", creatorId)

        const result = await createDonation(formData)

        if (result.error) {
          setError(result.error)
        } else if (result.clientSecret && result.donationId) {
          setPaymentInfo({
            clientSecret: result.clientSecret,
            donationId: result.donationId,
          })
          setStep("payment")
        }
      } catch (err) {
        console.error("Error creating donation:", err)
        setError("Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (step === "payment" || step === "login") {
      setStep("amount")
    } else {
      onCancel()
    }
  }

  const getActualAmount = () => {
    if (amount === "custom") {
      return Number.parseFloat(customAmount) || 0
    }
    return amount as number
  }

  if (step === "login") {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-bold">Login Required</h3>
        </div>
        <p>You need to be logged in to make a donation.</p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={() => router.push(`/login?callbackUrl=/creator/${creatorUsername}`)}>Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {step === "amount" && (
        <>
          <div className="text-center">
            <h3 className="text-xl font-bold">Support {creatorName}</h3>
            <p className="text-sm text-gray-500">Choose an amount to donate</p>
          </div>
          <RadioGroup
            value={amount.toString()}
            onValueChange={(value) => setAmount(value === "custom" ? "custom" : Number.parseInt(value))}
            className="grid grid-cols-3 gap-4"
          >
            {[3, 5, 10].map((value) => (
              <div key={value}>
                <RadioGroupItem value={value.toString()} id={`amount-${value}`} className="peer sr-only" />
                <Label
                  htmlFor={`amount-${value}`}
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Coffee className="mb-2 h-6 w-6" />
                  <span className="text-xl font-bold">${value}</span>
                </Label>
              </div>
            ))}
            {[15, 25, "custom"].map((value) => (
              <div key={value.toString()}>
                <RadioGroupItem value={value.toString()} id={`amount-${value}`} className="peer sr-only" />
                <Label
                  htmlFor={`amount-${value}`}
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {value === "custom" ? (
                    <span className="text-xl font-bold">Custom</span>
                  ) : (
                    <>
                      <Coffee className="mb-2 h-6 w-6" />
                      <span className="text-xl font-bold">${value}</span>
                    </>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {amount === "custom" && (
            <div className="mt-4">
              <Label htmlFor="custom-amount">Enter amount</Label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  className="pl-8"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Leave a message for the creator"
              className="mt-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleContinue} disabled={isSubmitting || (amount === "custom" && !customAmount)}>
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </>
      )}

      {step === "payment" && paymentInfo && (
        <>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-bold">Payment</h3>
          </div>

          <div className="mt-4 rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Donation amount</span>
              <span className="font-bold">${getActualAmount().toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Platform fee</span>
              <span>${(getActualAmount() * 0.05).toFixed(2)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>${(getActualAmount() * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <StripePaymentWrapper
              clientSecret={paymentInfo.clientSecret}
              donationId={paymentInfo.donationId}
              amount={getActualAmount() * 1.05}
              creatorName={creatorName}
            />
          </div>
        </>
      )}
    </div>
  )
}

