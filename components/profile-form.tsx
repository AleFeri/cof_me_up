"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateUserProfile } from "@/app/actions/profile-actions"

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    image: user?.image || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("bio", formData.bio)
      data.append("image", formData.image)

      const result = await updateUserProfile(data)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Update the session with new user info
        await update({
          name: formData.name,
        })
        router.refresh()
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/your-image.jpg"
            />
            <p className="text-xs text-gray-500">
              Enter a URL for your profile image. You can use services like Imgur to host your images.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell supporters about yourself"
              rows={4}
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          {success && <div className="text-sm text-green-500">Profile updated successfully!</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

