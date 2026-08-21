export type StaffRole =
  | "admin"
  | "staff"
  | "reception"
  | "cashier"
  | "doctor"
  | "laboratory"
  | "pharmacy"
  | null;

const ROLE_ALIASES: Record<string, Exclude<StaffRole, null>> = {
  admin: "admin",
  administrator: "admin",
  staff: "staff",
  reception: "reception",
  receptionist: "reception",
  cashier: "cashier",
  doctor: "doctor",
  laboratory: "laboratory",
  lab: "laboratory",
  lab_tech: "laboratory",
  labtech: "laboratory",
  pharmacy: "pharmacy",
  pharmacist: "pharmacy",
};

export function normalizeStaffRole(raw: string | null | undefined): StaffRole {
  if (!raw) return null;

  const normalized = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ROLE_ALIASES[normalized] ?? null;
}

export function getStaffDashboardPath(role: StaffRole): string {
  switch (role) {
    case "admin":
      return "/staff/admin";
    case "cashier":
      return "/staff/payments";
    case "doctor":
      return "/staff/doctor/dashboard";
    case "laboratory":
      return "/staff/laboratory/dashboard";
    case "pharmacy":
      return "/staff/pharmacy/dashboard";
    case "reception":
    case "staff":
      return "/staff/dashboard";
    default:
      return "/staff/login";
  }
}

export function isRoleAllowed(userRole: StaffRole, allowedRoles?: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;

  const normalizedAllowed = allowedRoles
    .map((role) => normalizeStaffRole(role))
    .filter((role): role is Exclude<StaffRole, null> => role !== null);

  return normalizedAllowed.includes(userRole);
}
