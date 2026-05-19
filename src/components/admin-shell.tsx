import { requireAdmin } from "@/lib/auth";
import { AdminShellClient } from "./admin-shell-client";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const username = await requireAdmin();
  return <AdminShellClient username={username}>{children}</AdminShellClient>;
}
