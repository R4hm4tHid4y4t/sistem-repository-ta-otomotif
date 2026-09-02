"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function FilterSelect({
  name,
  label,
  options,
  placeholder = "Semua",
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set(name, e.target.value);
    else params.delete(name);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <p className="mb-1 font-medium text-primary-800">{label}</p>
      <select
        defaultValue={searchParams.get(name) ?? ""}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}