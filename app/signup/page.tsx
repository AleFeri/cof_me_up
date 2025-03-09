"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Github, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { register } from "@/app/actions/auth-actions"

export default function SignupPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"creator" | "supporter">("creator")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [creatorForm, setCreatorForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  })

  const [supporterForm, setSupporterForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCreatorForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSupporterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSupporterForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(true, creatorForm.name, creatorForm.email, creatorForm.password, creatorForm.username)
  }

  const handleSupporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(false, supporterForm.name, supporterForm.email, supporterForm.password)
  }

  const handleSubmit = async (isCreator: boolean, name: string, email: string, password: string, username?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("isCreator", isCreator.toString())

      if (isCreator && username) {
        formData.append("username", username)
      }

      const result = await register(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Log the user in
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (signInResult?.error) {
          setError(signInResult.error)
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Choose how you want to use CofMeUp</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="creator" onValueChange={(value) => setActiveTab(value as "creator" | "supporter")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="creator">I'm a creator</TabsTrigger>
                <TabsTrigger value="supporter">I want to support</TabsTrigger>
              </TabsList>
              <TabsContent value="creator" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleOAuthSignIn("github")}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" onClick={() => handleOAuthSignIn("google")}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                    </svg>
                    Google
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <form onSubmit={handleCreatorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator-name">Name</Label>
                    <Input
                      id="creator-name"
                      name="name"
                      value={creatorForm.name}
                      onChange={handleCreatorChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator-email">Email</Label>
                    <Input
                      id="creator-email"
                      name="email"
                      type="email"
                      value={creatorForm.email}
                      onChange={handleCreatorChange}
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator-username">Username</Label>
                    <Input
                      id="creator-username"
                      name="username"
                      value={creatorForm.username}
                      onChange={handleCreatorChange}
                      placeholder="yourname"
                      required
                    />
                    <p className="text-xs text-gray-500">This will be your page URL: cofmeup.com/creator/yourname</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator-password">Password</Label>
                    <Input
                      id="creator-password"
                      name="password"
                      type="password"
                      value={creatorForm.password}
                      onChange={handleCreatorChange}
                      required
                    />
                  </div>

                  {error && <div className="text-sm text-red-500">{error}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create creator account"
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="supporter" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleOAuthSignIn("github")}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" onClick={() => handleOAuthSignIn("google")}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                    </svg>
                    Google
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <form onSubmit={handleSupporterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supporter-name">Name</Label>
                    <Input
                      id="supporter-name"
                      name="name"
                      value={supporterForm.name}
                      onChange={handleSupporterChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supporter-email">Email</Label>
                    <Input
                      id="supporter-email"
                      name="email"
                      type="email"
                      value={supporterForm.email}
                      onChange={handleSupporterChange}
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supporter-password">Password</Label>
                    <Input
                      id="supporter-password"
                      name="password"
                      type="password"
                      value={supporterForm.password}
                      onChange={handleSupporterChange}
                      required
                    />
                  </div>

                  {error && <div className="text-sm text-red-500">{error}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create supporter account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <div className="px-8 pb-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}

