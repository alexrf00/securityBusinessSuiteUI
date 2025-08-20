"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/auth/providers/auth-provider"
import { OAuthButtons } from "./oauth-buttons"
import { Separator } from "@/components/ui/separator"

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      console.error("[v0] Login error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-card-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Welcome Back
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Sign in to your account
        </p>
      </div>

      <OAuthButtons />

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card px-2 text-muted-foreground text-sm">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Enter your password"
            className="bg-input border-border focus:ring-ring"
            required
          />
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !email || !password}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <button className="text-muted-foreground text-accent hover:text-accent/80 text-sm font-medium">Forgot your password?</button>
        <div className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister} className="text-muted-foreground text-accent hover:text-accent/80 font-medium">
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}
