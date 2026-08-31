export const DAFTAR_SDGS = [
  { nomor: 1, nama: "Tanpa Kemiskinan", warna: "#E5243B" },
  { nomor: 2, nama: "Tanpa Kelaparan", warna: "#DDA63A" },
  { nomor: 3, nama: "Kehidupan Sehat dan Sejahtera", warna: "#4C9F38" },
  { nomor: 4, nama: "Pendidikan Berkualitas", warna: "#C5192D" },
  { nomor: 5, nama: "Kesetaraan Gender", warna: "#FF3A21" },
  { nomor: 6, nama: "Air Bersih dan Sanitasi Layak", warna: "#26BDE2" },
  { nomor: 7, nama: "Energi Bersih dan Terjangkau", warna: "#FCC30B" },
  { nomor: 8, nama: "Pekerjaan Layak dan Pertumbuhan Ekonomi", warna: "#A21942" },
  { nomor: 9, nama: "Industri, Inovasi dan Infrastruktur", warna: "#FD6925" },
  { nomor: 10, nama: "Berkurangnya Kesenjangan", warna: "#DD1367" },
  { nomor: 11, nama: "Kota dan Permukiman Berkelanjutan", warna: "#FD9D24" },
  { nomor: 12, nama: "Konsumsi dan Produksi Bertanggung Jawab", warna: "#BF8B2E" },
  { nomor: 13, nama: "Penanganan Perubahan Iklim", warna: "#3F7E44" },
  { nomor: 14, nama: "Ekosistem Lautan", warna: "#0A97D9" },
  { nomor: 15, nama: "Ekosistem Daratan", warna: "#56C02B" },
  { nomor: 16, nama: "Perdamaian, Keadilan, dan Kelembagaan Tangguh", warna: "#00689D" },
  { nomor: 17, nama: "Kemitraan untuk Mencapai Tujuan", warna: "#19486A" },
] as const;

export function getSdg(nomor: number) {
  return DAFTAR_SDGS.find((s) => s.nomor === nomor);
}