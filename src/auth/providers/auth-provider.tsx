"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { AuthService } from "@/auth/services/auth-service"
import type { User } from "@/auth/types/auth-types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithOAuth: (provider: string) => Promise<void>
  logout: () => Promise<void>
  freshToken: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // 1) Try silent restore via refresh token (HttpOnly cookie)
      const refreshedUser = await AuthService.freshToken();
      if (refreshedUser) {
        setUser(refreshedUser);
        return;
      }
  
      // 2) If refresh didn't authenticate, try current session
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const userData = await AuthService.login(email, password)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const userData = await AuthService.register(email, password, name)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithOAuth = async (provider: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const userData = await AuthService.loginWithOAuth(provider)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
      setUser(null)
    } catch (err) {
      console.error("[v0] Logout error:", err)
    }
  }

  const freshToken = async () => {
    try {
      setIsLoading(true)
      const userData = await AuthService.freshToken()
      setUser(userData)
      setError(null) // Clear any previous errors on successful refresh
    } catch (err) {
      console.error("[v0] Token refresh failed:", err)
      setUser(null)
      setError("Session expired. Please log in again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithOAuth,
        logout,
        freshToken,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
