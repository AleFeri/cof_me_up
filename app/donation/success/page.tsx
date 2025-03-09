"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DonationSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")
  const creatorName = searchParams.get("creatorName")

  useEffect(() => {
    if (!amount || !creatorName) {
      router.push("/")
    }
  }, [amount, creatorName, router])

  if (!amount || !creatorName) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold">CofMeUp</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your donation of ${Number.parseFloat(amount).toFixed(2)} to {creatorName} has been successfully processed.
            </p>
            <p className="text-gray-500">Your support means a lot and helps the creator continue their work.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">CofMeUp</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            © {new Date().getFullYear()} CofMeUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

