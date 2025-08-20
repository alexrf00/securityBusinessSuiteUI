// Shared API client utilities for consistent backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiClient {
  private static getHeaders() {
    return {
      "Content-Type": "application/json",
    }
  }

  private static async handleResponse(response: Response, endpoint: string, options?: RequestInit): Promise<any> {
    if (response.status === 401) {
      // Try to refresh token
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        })

        if (refreshResponse.ok) {
          // Retry original request after successful refresh
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: "include",
          })

          if (retryResponse.ok) {
            return retryResponse.json()
          }
        }
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError)
      }

      // If refresh fails or retry fails, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
      throw new Error("Authentication required")
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  static async get(endpoint: string) {
    const options = {
      headers: this.getHeaders(),
      credentials: "include" as RequestCredentials,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    return this.handleResponse(response, endpoint, options)
  }

  static async post(endpoint: string, data: any) {
    const options = {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: "include" as RequestCredentials,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    return this.handleResponse(response, endpoint, options)
  }

  static async put(endpoint: string, data: any) {
    const options = {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: "include" as RequestCredentials,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    return this.handleResponse(response, endpoint, options)
  }

  static async delete(endpoint: string) {
    const options = {
      method: "DELETE",
      headers: this.getHeaders(),
      credentials: "include" as RequestCredentials,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    if (response.status === 401) {
      // Handle 401 for delete requests
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        })

        if (refreshResponse.ok) {
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, options)
          return retryResponse.ok
        }
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError)
      }

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
      throw new Error("Authentication required")
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.ok
  }
}
