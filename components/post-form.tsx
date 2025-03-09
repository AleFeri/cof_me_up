"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/app/actions/post-actions"

export function PostForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("content", formData.content)
      data.append("image", formData.image)

      const result = await createPost(data)

      if (result.error) {
        setError(result.error)
      } else {
        // Reset form and refresh
        setFormData({
          title: "",
          content: "",
          image: "",
        })
        router.refresh()
      }
    } catch (err) {
      console.error("Error creating post:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Share an update with your supporters</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What do you want to share?"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/your-image.jpg"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

