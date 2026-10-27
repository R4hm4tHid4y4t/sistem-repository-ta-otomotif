export function validasiPassword(pw: string): string | null {
  if (pw.length < 8) return "Password minimal 8 karakter.";
  if (!/[a-z]/.test(pw)) return "Password harus memuat huruf kecil.";
  if (!/[A-Z]/.test(pw)) return "Password harus memuat huruf besar.";
  if (!/[0-9]/.test(pw)) return "Password harus memuat angka.";
  if (!/[^a-zA-Z0-9]/.test(pw)) return "Password harus memuat simbol (mis. ! @ # $).";
  return null;
}