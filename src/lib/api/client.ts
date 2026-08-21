const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let isHandlingUnauthorized = false;

export function getAuthToken(): string | null {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function handleUnauthorized(): void {
  if (isHandlingUnauthorized) return;
  if (window.location.pathname === "/staff/login") return;

  isHandlingUnauthorized = true;
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("staff_session");
  
  // Use replace to prevent back button from returning to protected page
  window.location.replace("/staff/login");
  
  // Reset flag after a delay to allow future 401 handling
  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 1000);
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401 && !path.includes("/auth/login")) {
    handleUnauthorized();
  }

  return response;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}
