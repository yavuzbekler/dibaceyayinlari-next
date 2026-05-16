import { requireAdmin } from "@/lib/auth";
import { AdminShellClient } from "./admin-shell-client";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const username = requireAdmin();
  return <AdminShellClient username={username}>{children}</AdminShellClient>;
}
