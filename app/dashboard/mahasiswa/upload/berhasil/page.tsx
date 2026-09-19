export default function BerhasilPage({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">✓</span>
        <p className="text-lg font-heading font-semibold text-primary-800">Karya Berhasil Diunggah</p>
        <p className="max-w-sm text-sm text-slate-500">
          Karya Anda sudah tayang di repositori dan dapat diakses oleh seluruh civitas akademika.
        </p>
        <div className="mt-4 flex gap-3">
          {searchParams.id && (
            <a href={`/ta/${searchParams.id}`} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">
              Lihat Karya
            </a>
          )}
          <a href="/dashboard/mahasiswa/status" className="rounded-lg bg-accent-500 px-5 py-2 font-medium text-white hover:bg-accent-600">
            Kembali ke Karya Saya
          </a>
        </div>
      </div>
    </div>
  );
}