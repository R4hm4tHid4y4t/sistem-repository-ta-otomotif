import { Flame, Zap, Cog, Truck, BatteryCharging, Wrench, Fuel, Snowflake, GraduationCap, Car } from "lucide-react";
import type { ComponentType } from "react";

export const KATEGORI_META: Record<string, { icon: ComponentType<any>; warna: string }> = {
  "Motor Bakar": { icon: Flame, warna: "#EF4444" },
  "Kelistrikan Otomotif": { icon: Zap, warna: "#EAB308" },
  "Sasis & Pemindah Tenaga": { icon: Cog, warna: "#6B7280" },
  "Alat Berat": { icon: Truck, warna: "#92400E" },
  "Kendaraan Listrik (EV)": { icon: BatteryCharging, warna: "#16A34A" },
  "Manajemen Bengkel & Pendidikan": { icon: Wrench, warna: "#2563EB" },
  "Sistem Bahan Bakar": { icon: Fuel, warna: "#C2410C" },
  "Sistem Pendinginan": { icon: Snowflake, warna: "#0EA5E9" },
};

export const KBK_META: Record<string, { icon: ComponentType<any>; warna: string }> = {
  "Mesin Konversi Energi": { icon: Flame, warna: "#EF4444" },
  "Mesin Otomotif": { icon: Flame, warna: "#EF4444" },
  "Kelistrikan Kendaraan": { icon: Zap, warna: "#EAB308" },
  "Kelistrikan Otomotif": { icon: Zap, warna: "#EAB308" },
  "Pendidikan Teknik Otomotif": { icon: GraduationCap, warna: "#2563EB" },
  "Kendaraan Ringan": { icon: Car, warna: "#16A34A" },
  "Alat Berat": { icon: Truck, warna: "#92400E" },
};