import type React from "react"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CofMeUp - Support Your Favorite Creators",
  description: "A platform for supporting your favorite creators with direct donations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
