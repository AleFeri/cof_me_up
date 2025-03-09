"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Coffee, Heart, Share2, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonationForm } from "@/components/donation-form"
import { Navbar } from "@/components/navbar"
import { getUserByUsername } from "@/app/actions/profile-actions"
import { getPostsByCreator } from "@/app/actions/post-actions"

export default function CreatorProfile({ params }: { params: { username: string } }) {
  const { data: session } = useSession()
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [creator, setCreator] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const { user, error } = await getUserByUsername(params.username)

        if (error || !user) {
          console.error("Error fetching creator:", error)
          return
        }

        setCreator(user)

        // Fetch posts
        const { posts } = await getPostsByCreator(user.id)
        if (posts) {
          setPosts(posts)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreator()
  }, [params.username])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-16 text-center mx-auto">
          <h1 className="text-3xl font-bold">Creator Not Found</h1>
          <p className="mt-4 text-gray-500">
            The creator you're looking for doesn't exist or has changed their username.
          </p>
          <Button asChild className="mt-8">
            <Link href="/explore">Explore Creators</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="relative h-48 w-full md:h-64 lg:h-80 bg-gradient-to-r from-amber-100 to-amber-200">
          {/* This is a placeholder for a cover image */}
        </div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative -mt-20 flex flex-col items-center">
            <div className="h-40 w-40 rounded-full border-4 border-background bg-muted overflow-hidden">
              {creator.image ? (
                <img
                  src={creator.image || "/placeholder.svg"}
                  alt={creator.name || creator.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-amber-100 text-amber-500">
                  <span className="text-4xl font-bold">{(creator.name || creator.username || "")[0]}</span>
                </div>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold">{creator.name || creator.username}</h1>
            <p className="text-gray-500">@{creator.username}</p>
            <p className="mt-4 max-w-2xl text-center">{creator.bio || "No bio yet."}</p>
            <div className="mt-6 flex items-center gap-4">
              <Button onClick={() => setShowDonationForm(true)} size="lg" className="gap-2">
                <Coffee className="h-5 w-5" />
                Support me
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                }}
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
              <Link
                href={`https://twitter.com/intent/tweet?text=Support ${creator.name || creator.username} on CofMeUp&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-medium">{creator.supporterCount || 0} supporters</span>
              </div>
            </div>
          </div>

          {showDonationForm ? (
            <Card className="mx-auto mt-8 max-w-md">
              <CardContent className="pt-6">
                <DonationForm
                  creatorName={creator.name || creator.username}
                  creatorUsername={creator.username}
                  creatorId={creator.id}
                  onCancel={() => setShowDonationForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="posts" className="mt-12">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                {posts.length > 0 ? (
                  <div className="grid gap-6">
                    {posts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold">{post.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                          <p className="mt-2">{post.content}</p>
                          {post.image && (
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              className="mt-4 w-full rounded-lg object-cover"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>No posts yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">About {creator.name || creator.username}</h3>
                    <p className="mt-2">{creator.bio || "No bio information available."}</p>
                    <h4 className="mt-6 text-lg font-bold">Support {creator.name || creator.username}</h4>
                    <p className="mt-2">
                      Your support helps this creator continue their work. Every donation, no matter how small, makes a
                      difference in their creative journey.
                    </p>
                    <div className="mt-4">
                      <Button onClick={() => setShowDonationForm(true)}>
                        <Coffee className="mr-2 h-4 w-4" />
                        Support Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <footer className="mt-12 w-full border-t bg-background py-6">
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
