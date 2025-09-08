import type { User, AuthResponse } from "@/auth/types/auth-types"

// Configure your Java backend URL. Default to same-origin so Next.js rewrites can proxy in dev.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthServiceClass {
  private getAuthHeaders() {
    return {
      "Content-Type": "application/json",
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies in requests
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      // Backend may return HTML or a redirect target on error; guard JSON parsing
      let message = "Login failed"
      try {
        const error = await response.json()
        message = error.message || message
      } catch (_) {
        // ignore parse errors
      }
      throw new Error(message)
    }

    const data: AuthResponse = await response.json()
    return data.user
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies in requests
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      let message = "Registration failed"
      try {
        const error = await response.json()
        message = error.message || message
      } catch (_) {
        // ignore parse errors
      }
      throw new Error(message)
    }

    const data: AuthResponse = await response.json()
    return data.user
  }

  async loginWithOAuth(provider: string): Promise<User> {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`

    // This will be handled by the OAuth callback
    return new Promise((resolve, reject) => {
      // Listen for OAuth completion
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === "OAUTH_SUCCESS") {
          resolve(event.data.user)
        } else if (event.data.type === "OAUTH_ERROR") {
          reject(new Error(event.data.message))
        }

        window.removeEventListener("message", handleMessage)
      }

      window.addEventListener("message", handleMessage)
    })
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies in requests
      redirect: "manual", // prevent following 302 to login page
    })

    // In cross-origin manual mode, redirects become opaqueredirect with status 0
    if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
      return null
    }

    if (!response.ok) {
      return null
    }

    try {
      return await response.json()
    } catch (_) {
      return null
    }
  }

  async freshToken(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include", // Include cookies in requests
        redirect: "manual", // avoid following redirect loops
      })

      if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
        return null
      }

      if (!response.ok) {
        return null
      }

      const data: AuthResponse = await response.json()
      return data.user
    } catch (error) {
      console.error("[v0] Token refresh failed:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies in requests
    })

    if (!response.ok) {
      console.warn("[v0] Logout request failed")
    }
  }
}

export const AuthService = new AuthServiceClass()
