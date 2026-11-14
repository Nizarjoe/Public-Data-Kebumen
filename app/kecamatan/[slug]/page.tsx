import Link from "next/link";
import { notFound } from "next/navigation";
import { getWilayah, getPadi, fmt } from "../../lib/data";
import { SiteNav, SiteFooter, Marquee } from "../../components/chrome";

export async function generateStaticParams() {
  const w = await getWilayah();
  return w.kecamatan.map((k) => ({ slug: k.nama.toLowerCase() }));
}

export const instant = false;

export default async function KecamatanDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = await getWilayah();
  const k = w.kecamatan.find((x) => x.nama.toLowerCase() === slug);
  if (!k) notFound();
  const padi = await getPadi();
  const p = padi[k.nama];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text={`${k.nama.toUpperCase()} ✷ ${k.desa_total} DESA ✷ KODE ${k.kode}`} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <Link href="/kecamatan" className="anti-btn inline-block mb-6">← Semua Kecamatan</Link>
        <p className="sticker bg-electric text-white mb-3">KODE WILAYAH {k.kode}</p>
        <h1 className="mega text-[clamp(3rem,9vw,6.5rem)] mb-6">{k.nama.toUpperCase()}</h1>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="kpi-block tilt-1 bg-mustard">
            <p className="sticker bg-white mb-2">Penduduk</p>
            <p className="mega text-3xl">{fmt(k.penduduk)}</p>
            <p className="text-xs mt-1 uppercase">jiwa</p>
          </div>
          <div className="kpi-block tilt-3 bg-acid">
            <p className="sticker sticker-alt bg-white mb-2">Luas</p>
            <p className="mega text-3xl">{fmt(k.luas, 1)}</p>
            <p className="text-xs mt-1 uppercase">km²</p>
          </div>
          <div className="kpi-block tilt-2 bg-candy">
            <p className="sticker bg-white mb-2">Kepadatan</p>
            <p className="mega text-3xl">{fmt(k.kepadatan)}</p>
            <p className="text-xs mt-1 uppercase">jiwa/km²</p>
          </div>
          <div className="kpi-block tilt-4 bg-white">
            <p className="sticker sticker-alt bg-mustard mb-2">Desa</p>
            <p className="mega text-3xl">{k.desa_total}</p>
            <p className="text-xs mt-1 uppercase">{k.desa_mapped} terpetakan</p>
          </div>
        </section>

        {p && (
          <section className="anti-card tilt-3 p-6 mb-12 bg-white">
            <p className="sticker bg-acid mb-3">Pertanian ✷ BPS via Satu Data</p>
            <h2 className="mega text-2xl mb-4">PRODUKSI PADI</h2>
            <table className="anti-table max-w-lg">
              <thead>
                <tr><th>Tahun</th><th>Luas Panen (ha)</th><th>Produksi (ton)</th></tr>
              </thead>
              <tbody>
                {[2022, 2023].map((t) => (
                  <tr key={t}>
                    <td>{t}</td>
                    <td>{p[`luas_panen_ha_${t}`] != null ? fmt(Number(p[`luas_panen_ha_${t}`]), 1) : "—"}</td>
                    <td>{p[`produksi_ton_${t}`] != null ? fmt(Number(p[`produksi_ton_${t}`]), 1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section>
          <h2 className="mega text-2xl mb-4">
            DAFTAR DESA &amp; KELURAHAN <span className="text-hot">({k.desa_nama.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {k.desa_nama.map((d) => (
              <span key={d} className="sticker bg-white !text-[0.72rem] normal-case">{d}</span>
            ))}
          </div>
          {k.desa_mapped < k.desa_total && (
            <p className="text-xs mt-4 opacity-70">
              ✷ {k.desa_total - k.desa_mapped} desa belum punya koordinat terverifikasi —
              tetap terdaftar resmi, tidak dipetakan paksa.
            </p>
          )}
          {k.lat && k.lon && (
            <p className="text-xs mt-2 opacity-70">
              Titik kecamatan: {k.lat.toFixed(4)}, {k.lon.toFixed(4)} (OpenStreetMap)
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
