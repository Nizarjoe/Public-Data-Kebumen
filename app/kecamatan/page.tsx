import Link from "next/link";
import { getWilayah, getPadi, fmt } from "../lib/data";
import { SiteNav, SiteFooter, Marquee } from "../components/chrome";

export const instant = false;
export const metadata = { title: "26 Kecamatan — Kebumen/Data" };

export default async function KecamatanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const w = await getWilayah();
  const padi = await getPadi();
  const query = (q ?? "").toLowerCase();
  const list = query
    ? w.kecamatan.filter((k) => k.nama.toLowerCase().includes(query) || k.desa_nama.some((d) => d.toLowerCase().includes(query)))
    : w.kecamatan;
  const maxKep = Math.max(...w.kecamatan.map((k) => k.kepadatan));

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="PROFIL 26 KECAMATAN ✷ PENDUDUK ✷ LUAS ✷ DESA ✷ PADI" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="mega text-[clamp(2.6rem,8vw,5.5rem)] mb-3">
          26<br />KECAMATAN
        </h1>

        <form method="get" className="flex gap-2 mb-8 max-w-md">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari kecamatan atau desa…"
            className="border-[3px] border-ink px-3 py-2 flex-1 bg-white shadow-[4px_4px_0_#171412] outline-none focus:bg-acid"
          />
          <button className="anti-btn">Cari</button>
        </form>

        <div className="overflow-x-auto anti-card p-4 bg-white mb-12">
          <table className="anti-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kecamatan</th>
                <th>Kode</th>
                <th>Penduduk</th>
                <th>Luas km²</th>
                <th>Kepadatan (jiwa/km²)</th>
                <th>Desa</th>
                <th>Terpetakan</th>
                <th>Padi 2023 (ton)</th>
              </tr>
            </thead>
            <tbody>
              {list.map((k, i) => {
                const p = padi[k.nama];
                return (
                  <tr key={k.kode}>
                    <td>{i + 1}</td>
                    <td className="font-bold">
                      <Link href={`/kecamatan/${k.nama.toLowerCase()}`} className="anti-link">{k.nama}</Link>
                    </td>
                    <td className="text-xs">{k.kode}</td>
                    <td>{fmt(k.penduduk)}</td>
                    <td>{fmt(k.luas, 1)}</td>
                    <td>
                      <span
                        className="inline-block h-3 align-middle mr-2 border-2 border-ink"
                        style={{
                          width: `${Math.max(8, (k.kepadatan / maxKep) * 90)}px`,
                          background: k.kepadatan > 2000 ? "#e8422e" : k.kepadatan > 1000 ? "#ff8ad4" : k.kepadatan > 600 ? "#ffc918" : "#c8f04b",
                        }}
                      />
                      {fmt(k.kepadatan)}
                    </td>
                    <td>{k.desa_total}</td>
                    <td className="text-xs">{k.desa_mapped === k.desa_total ? "✓ semua" : `${k.desa_mapped}/${k.desa_total}`}</td>
                    <td>{p?.produksi_ton_2023 != null ? fmt(Number(p.produksi_ton_2023), 1) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-center">Tidak ketemu untuk &ldquo;{q}&rdquo;.</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((k, i) => (
            <Link key={k.kode} href={`/kecamatan/${k.nama.toLowerCase()}`}>
              <article className={`anti-card p-5 h-full ${["tilt-1", "tilt-2", "tilt-3", "tilt-4"][i % 4]}`}>
                <p className={`sticker ${i % 2 ? "bg-acid" : "bg-mustard"} mb-2`}>{k.kode}</p>
                <h2 className="mega text-xl">{k.nama}</h2>
                <p className="text-sm mt-1">{fmt(k.penduduk)} jiwa ✷ {fmt(k.luas, 1)} km²</p>
                <p className="text-xs mt-1 opacity-70">{k.desa_total} desa ✷ {k.desa_mapped} terpetakan</p>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
