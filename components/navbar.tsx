"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Coffee, Menu, LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const closeSheet = () => {
    setIsOpen(false)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const navItems = [{ name: "Explore", href: "/explore" }]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-bold">CofMeUp</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              {session.user.isCreator && session.user.username && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/creator/${session.user.username}`}>View Profile</Link>
                </Button>
              )}
              <Button variant="default" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {session.user.image ? (
                      <img
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 px-2 py-6">
              <Link href="/" className="flex items-center gap-2" onClick={closeSheet}>
                <Coffee className="h-6 w-6 text-amber-500" />
                <span className="text-xl font-bold">CofMeUp</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSheet}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeSheet}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Dashboard
                    </Link>
                    {session.user.isCreator && session.user.username && (
                      <Link
                        href={`/creator/${session.user.username}`}
                        onClick={closeSheet}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        View Profile
                      </Link>
                    )}
                    <div className="border-t pt-4 mt-2">
                      <div className="flex items-center gap-2 mb-4">
                        {session.user.image ? (
                          <img
                            src={session.user.image || "/placeholder.svg"}
                            alt={session.user.name || "User"}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          {session.user.name && <p className="font-medium text-sm">{session.user.name}</p>}
                          {session.user.email && <p className="text-xs text-muted-foreground">{session.user.email}</p>}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full justify-start text-red-600" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Button asChild variant="outline" onClick={closeSheet}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild onClick={closeSheet}>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
