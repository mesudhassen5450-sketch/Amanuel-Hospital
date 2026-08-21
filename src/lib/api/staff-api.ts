/**
 * Staff Management API Service
 * Uses Express backend API with Bearer token authentication
 * Replaces direct Supabase RPC calls
 */

import { apiFetch, handleApiResponse } from "./client";

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
  const response = await apiFetch("/api/staff", {
    method: "GET",
  });

  const result = await handleApiResponse<{ success: boolean; staff: StaffAccount[]; count: number }>(response);
  return result.staff || [];
};

/**
 * POST /api/staff
 * Create a new staff account
 */
export const createStaffAccount = async (data: CreateStaffData): Promise<StaffAccount> => {
  const response = await apiFetch("/api/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await handleApiResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * PUT /api/staff/:id
 * Update staff account details
 */
export const updateStaffAccount = async (id: number, data: UpdateStaffData): Promise<StaffAccount> => {
  const response = await apiFetch(`/api/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await handleApiResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * PUT /api/staff/:id/password
 * Reset staff password
 */
export const resetStaffPassword = async (id: number, data: ResetPasswordData): Promise<void> => {
  const response = await apiFetch(`/api/staff/${id}/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  await handleApiResponse<{ success: boolean; message: string }>(response);
};

/**
 * PATCH /api/staff/:id/status
 * Toggle staff active status
 */
export const toggleStaffStatus = async (id: number, data?: ToggleStatusData): Promise<StaffAccount> => {
  const response = await apiFetch(`/api/staff/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(data || {}),
  });

  const result = await handleApiResponse<{ success: boolean; data: StaffAccount; message: string }>(response);
  return result.data;
};

/**
 * DELETE /api/staff/:id
 * Delete staff account with cascading cleanup
 */
export const deleteStaffAccount = async (id: number): Promise<void> => {
  const response = await apiFetch(`/api/staff/${id}`, {
    method: "DELETE",
  });

  await handleApiResponse<{ success: boolean; message: string }>(response);
};
