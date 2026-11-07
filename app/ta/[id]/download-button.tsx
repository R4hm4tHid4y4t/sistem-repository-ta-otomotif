export function DownloadTAButton({ taId, label = "Unduh PDF Lengkap" }: { taId: string; label?: string }) {
  return (
    <a
      href={`/api/berkas/${taId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded bg-accent-500 px-4 py-2 text-center font-medium text-white hover:bg-accent-600"
    >
      {label}
    </a>
  );
}