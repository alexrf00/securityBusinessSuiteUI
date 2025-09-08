"use client"

import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "@/auth/components/login-form"
import { RegisterForm } from "@/auth/components/register-form"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            SecureAuth
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            Professional authentication platform
          </p>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-6">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Secure • Reliable • Professional</p>
        </div>
      </div>
    </div>
  )
}
