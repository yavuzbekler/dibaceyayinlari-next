import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const adminCookieName = "dibace_admin";

export function isAdminAuthenticated() {
  return cookies().get(adminCookieName)?.value === "true";
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
}
