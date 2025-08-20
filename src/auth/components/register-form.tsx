"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/auth/providers/auth-provider"
import { OAuthButtons } from "./oauth-buttons"
import { Separator } from "@/components/ui/separator"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || password !== confirmPassword) return

    setIsSubmitting(true)
    try {
      await register(email, password, name)
    } catch (err) {
      console.error("[v0] Registration error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordsMatch = password === confirmPassword || confirmPassword === ""

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-card-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Create Account
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Join our secure platform
        </p>
      </div>

      <OAuthButtons />

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card px-2 text-muted-foreground text-sm">or create with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-card-foreground font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="bg-input border-border focus:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-card-foreground font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-input border-border focus:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-card-foreground font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="bg-input border-border focus:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-card-foreground font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={`bg-input border-border focus:ring-ring ${!passwordsMatch ? "border-destructive" : ""}`}
            required
          />
          {!passwordsMatch && confirmPassword && <p className="text-destructive text-sm">Passwords do not match</p>}
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !name || !email || !password || !passwordsMatch}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center">
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-accent hover:text-accent/80 font-medium">
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
