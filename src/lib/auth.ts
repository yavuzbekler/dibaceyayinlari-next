import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const adminCookieName = "dibace_admin";

export async function isAdminAuthenticated() {
  const val = (await cookies()).get(adminCookieName)?.value;
  return !!val;
}

export async function getAdminUsername(): Promise<string | null> {
  const val = (await cookies()).get(adminCookieName)?.value;
  if (!val) return null;
  if (val === "true") return "admin";
  return val;
}

export async function requireAdmin(): Promise<string> {
  const username = await getAdminUsername();
  if (!username) redirect("/admin/login");
  return username;
}
