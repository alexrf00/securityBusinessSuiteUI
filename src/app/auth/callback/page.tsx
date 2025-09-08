"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const status = searchParams.get("status")
  const email = decodeURIComponent(searchParams.get("email") || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push("/")
  }

  const handleRetry = () => {
    router.push("/auth/register")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Processing...</h2>
            <p className="text-sm text-slate-600 text-center">
              We're setting up your account. This will just take a moment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "success" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">Registration Successful!</CardTitle>
              <CardDescription>
                Welcome! Your account has been created successfully.
                {email && <span className="block mt-1 font-medium text-slate-700">{email}</span>}
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">Registration Failed</CardTitle>
              <CardDescription>Something went wrong during registration. Please try again.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" ? (
            <Button onClick={handleContinue} className="w-full bg-purple-600 hover:bg-purple-700">
              Continue to Dashboard
            </Button>
          ) : (
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full bg-purple-600 hover:bg-purple-700">
                Try Again
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Go to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
