import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const adminCookieName = "dibace_admin";

export function isAdminAuthenticated() {
  const val = cookies().get(adminCookieName)?.value;
  return !!val;
}

export function getAdminUsername(): string | null {
  const val = cookies().get(adminCookieName)?.value;
  if (!val) return null;
  if (val === "true") return "admin";
  return val;
}

export function requireAdmin(): string {
  const username = getAdminUsername();
  if (!username) redirect("/admin/login");
  return username;
}
