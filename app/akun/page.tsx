import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GantiPasswordForm } from "./ganti-password-form";

export default async function AkunPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-xl font-semibold text-primary-800">Ganti Kata Sandi</h1>
      <p className="mb-4 text-sm text-slate-500">Berlaku untuk akun yang sedang login.</p>
      <GantiPasswordForm email={user.email ?? ""} />
    </div>
  );
}