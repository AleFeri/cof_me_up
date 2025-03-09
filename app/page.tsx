import Link from "next/link"
import { ArrowRight, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Support creators you love</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    A simple way to support your favorite creators with donations. No monthly subscriptions, just a cup
                    of coffee.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Create your page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/explore">Explore creators</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Platform preview"
                  className="aspect-square rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How it works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CofMeUp makes it easy to receive support from your audience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Create your page</h3>
                <p className="text-center text-gray-500">Sign up and customize your profile to showcase your work</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Share with your audience</h3>
                <p className="text-center text-gray-500">Share your unique link with your followers on social media</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Receive support</h3>
                <p className="text-center text-gray-500">
                  Get donations directly to your account with low platform fees
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured creators</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out these amazing creators already using our platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link
                  key={i}
                  href={`/creator/example-${i}`}
                  className="group flex flex-col items-center space-y-4 rounded-lg border p-4 transition-all hover:bg-muted"
                >
                  <img
                    src={`/placeholder.svg?height=100&width=100&text=Creator+${i}`}
                    alt={`Creator ${i}`}
                    className="aspect-square rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold group-hover:underline">Creator {i}</h3>
                    <p className="text-sm text-gray-500">Digital Artist</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/explore">View all creators</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">CofMeUp</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            © {new Date().getFullYear()} CofMeUp. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
