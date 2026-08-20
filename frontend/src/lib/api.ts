import { useAuthStore } from "@/store/auth.store";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${NEXT_PUBLIC_API_URL}${endpoint}`;
  const state = useAuthStore.getState();
  const token = state.accessToken;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  // Handle 401 Unauthorized (Token Expiration)
  if (response.status === 401 && state.refreshToken) {
    try {
      // Attempt to refresh token
      const refreshResponse = await fetch(`${NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Session expired");
      }

      const refreshData = await refreshResponse.json();
      
      // The backend returns { success: true, data: { accessToken } }
      if (refreshData.success && refreshData.data?.accessToken) {
        state.setTokens(refreshData.data.accessToken);
        
        // Retry the original request
        headers.set("Authorization", `Bearer ${refreshData.data.accessToken}`);
        response = await fetch(url, { ...config, headers });
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      // If refresh fails, log the user out
      state.logout();
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message || "An unexpected error occurred");
  }

  // The backend standard response is { success: boolean, data: any, message: string }
  // For standard fetch calls, we want to return the `data` portion.
  return data?.data as T;
}
