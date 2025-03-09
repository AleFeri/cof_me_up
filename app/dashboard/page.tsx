"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Coffee, LayoutDashboard, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { ProfileForm } from "@/components/profile-form"
import { PostForm } from "@/components/post-form"
import { getPostsByCreator, getDonationsForCreator } from "@/app/actions/post-actions"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tabParam || "overview")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id && session?.user?.isCreator) {
        try {
          const [postsResult, donationsResult] = await Promise.all([
            getPostsByCreator(session.user.id),
            getDonationsForCreator(session.user.id),
          ])

          if (postsResult.posts) {
            setPosts(postsResult.posts)
          }

          if (donationsResult.donations) {
            setDonations(donationsResult.donations)
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (session?.user?.id) {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchData()
    }
  }, [session])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <nav className="flex h-full flex-col space-y-2 p-2">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Overview
            </Button>
            {session.user.isCreator && (
              <Button
                variant={activeTab === "posts" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("posts")}
              >
                <Users className="mr-2 h-5 w-5" />
                Posts
              </Button>
            )}
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className={activeTab === "overview" ? "block" : "hidden"}>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{session.user.isCreator ? donations.length : 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {session.user.isCreator
                      ? `From ${new Set(donations.map((d) => d.donor.id)).size} unique supporters`
                      : "You are registered as a supporter"}
                  </p>
                </CardContent>
              </Card>

              {session.user.isCreator && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${donations.reduce((acc, d) => acc + d.amount, 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">After platform fees</p>
                  </CardContent>
                </Card>
              )}

              {session.user.isCreator && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Posts</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{posts.length}</div>
                    <p className="text-xs text-muted-foreground">Published updates</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {session.user.isCreator && (
              <>
                <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4">Recent Donations</h2>
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.slice(0, 5).map((donation) => (
                      <Card key={donation.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {donation.donor.image ? (
                                <img
                                  src={donation.donor.image || "/placeholder.svg"}
                                  alt={donation.donor.name || "Supporter"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold">{(donation.donor.name || "S")[0]}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{donation.donor.name || "Anonymous"}</p>
                              <p className="text-sm text-muted-foreground">
                                Donated ${donation.amount.toFixed(2)} •{" "}
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </p>
                              {donation.message && <p className="mt-2 text-sm">{donation.message}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>No donations yet. Share your profile to get support!</p>
                      {session.user.username && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Your profile link:</p>
                          <div className="flex">
                            <Input
                              readOnly
                              value={`${window.location.origin}/creator/${session.user.username}`}
                              className="rounded-r-none"
                            />
                            <Button
                              variant="secondary"
                              className="rounded-l-none"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/creator/${session.user.username}`,
                                )
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {session.user.isCreator && (
            <div className={activeTab === "posts" ? "block" : "hidden"}>
              <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
              <p className="text-muted-foreground">Create and manage updates for your supporters.</p>

              <div className="mt-6 space-y-6">
                <PostForm />

                <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4">Your Posts</h2>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <CardTitle>{post.title}</CardTitle>
                          <CardDescription>
                            Published on {new Date(post.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{post.content}</p>
                          {post.image && (
                            <div className="mt-4">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                className="rounded-lg max-h-[300px] object-cover"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>No posts yet. Create your first post to engage with your audience!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          <div className={activeTab === "settings" ? "block" : "hidden"}>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and profile.</p>

            <div className="mt-6">
              <ProfileForm user={session.user} />
            </div>
          </div>
        </main>
      </div>
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

