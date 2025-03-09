import Link from "next/link"
import { Coffee, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"

export default function ExplorePage() {
  // This would normally be fetched from an API
  const creators = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    username: `creator${i + 1}`,
    name: `Creator ${i + 1}`,
    category: i % 3 === 0 ? "Art" : i % 3 === 1 ? "Music" : "Writing",
    profileImage: `/placeholder.svg?height=200&width=200&text=Creator+${i + 1}`,
    bio: "Creator making amazing content that you'll love to support.",
    supporters: Math.floor(Math.random() * 1000) + 10,
  }))

  const categories = ["All", "Art", "Music", "Writing", "Gaming", "Education", "Podcasts", "Technology"]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
          <h1 className="text-3xl font-bold">Explore Creators</h1>
          <p className="mt-2 text-gray-500">Discover amazing creators to support</p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search creators" className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {creators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden">
                <Link href={`/creator/${creator.username}`}>
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={creator.profileImage || "/placeholder.svg"}
                      alt={creator.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{creator.name}</h3>
                    <p className="text-sm text-gray-500">{creator.category}</p>
                    <p className="mt-2 line-clamp-2 text-sm">{creator.bio}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center gap-1">
                      <Coffee className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{creator.supporters} supporters</span>
                    </div>
                    <Button size="sm">Support</Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </div>
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
