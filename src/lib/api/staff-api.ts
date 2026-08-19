/**
 * Staff Management API Service
 * Uses Express backend API with Bearer token authentication
 * Replaces direct Supabase RPC calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

/**
 * Build fetch headers with Bearer token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * Handle API response and extract data or throw error
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
};

// ══════════════════════════════════════════════════════════════════════════════
// STAFF ACCOUNT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface StaffAccount {
  id: number;
  username: string;
  role: string;
  displayName: string | null;
  isActive: boolean;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  username: string;
  password: string;
  role: string;
  displayName: string;
  isActive: boolean;
}

export interface UpdateStaffData {
  username: string;
  role: string;
  displayName: string;
  isActive: boolean;
}

export interface ResetPasswordData {
  newPassword: string;
}

export interface ToggleStatusData {
  isActive?: boolean;
}

// ══════════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/staff
 * Fetch all staff accounts
 */
export const getAllStaffAccounts = async (): Promise<StaffAccount[]> => {
  const response = await fetch(`${API_BASE_URL}/api/staff`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<{ success: boolean; staff: StaffAccount[]; count: number }>(response);
  return result.staff || [];
};

/**
 * POST /api/staff
 * Create a new staff account
 */
export const createStaffAccount = async (data: CreateStaffData): Promise<StaffAccount> => {
  const response = await fetch(`${API_BASE_URL}/api/staff`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * PUT /api/staff/:id
 * Update staff account details
 */
export const updateStaffAccount = async (id: number, data: UpdateStaffData): Promise<StaffAccount> => {
  const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * PUT /api/staff/:id/password
 * Reset staff password
 */
export const resetStaffPassword = async (id: number, data: ResetPasswordData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/staff/${id}/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  await handleResponse<{ success: boolean; message: string }>(response);
};

/**
 * PATCH /api/staff/:id/status
 * Toggle staff active status
 */
export const toggleStaffStatus = async (id: number, data?: ToggleStatusData): Promise<StaffAccount> => {
  const response = await fetch(`${API_BASE_URL}/api/staff/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data || {}),
  });

  const result = await handleResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * DELETE /api/staff/:id
 * Delete staff account with cascading cleanup
 */
export const deleteStaffAccount = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  await handleResponse<{ success: boolean; message: string }>(response);
};
