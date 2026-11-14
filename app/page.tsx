import Link from "next/link";
import { getWilayah, getIndikator, fmt } from "./lib/data";
import { Marquee, SiteNav, SiteFooter } from "./components/chrome";

export const instant = false;

export default async function Home() {
  const w = await getWilayah();
  const ind = await getIndikator();

  const penduduk = w.kecamatan.reduce((a, k) => a + k.penduduk, 0);
  const luas = w.kecamatan.reduce((a, k) => a + k.luas, 0);
  const cari = (kw: string) =>
    ind.find((i) => i.indikator.toLowerCase().includes(kw) && i.tahun === 2025) ??
    ind.find((i) => i.indikator.toLowerCase().includes(kw));
  const kemiskinan = cari("tingkat kemiskinan");
  const ipm = cari("pembangunan manusia");
  const tpt = cari("pengangguran");
  const wisatawan = ind.find((i) => i.indikator === "Jumlah kunjungan wisatawan" && i.tahun === 2025);
  const kecTerpadat = [...w.kecamatan].sort((a, b) => b.kepadatan - a.kepadatan)[0];
  const kecTerluas = [...w.kecamatan].sort((a, b) => b.luas - a.luas)[0];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="26 KECAMATAN ✷ 460 DESA ✷ 436 TERPETAKAN ✷ SATU DATA KEBUMEN" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* HERO — tipografi raksasa */}
        <section className="mb-14">
          <p className="sticker bg-hot text-white mb-4">PORTAL DATA PUBLIK ✷ 2024–2025</p>
          <h1 className="mega text-[clamp(3rem,10vw,7.5rem)]">
            KEBUMEN
            <br />
            <span className="text-electric">PADA</span> <span className="text-hot">ANGKA</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg">
            Satu tempat untuk melihat Kabupaten Kebumen lewat data resmi — penduduk,
            kemiskinan, IPM, pariwisata, pertanian, sampai peta 460 desa.
            <strong> Data serius, tampilan berani.</strong>
          </p>
        </section>

        {/* KPI raksasa */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="kpi-block tilt-1 bg-mustard">
            <p className="sticker bg-white mb-2">Penduduk</p>
            <p className="giant-num">{fmt(penduduk / 1e6, 2)}<span className="text-xl"> jt</span></p>
            <p className="text-xs mt-1 uppercase tracking-wide">jiwa ✷ Disdukcapil 2025</p>
          </div>
          <div className="kpi-block tilt-3 bg-acid">
            <p className="sticker sticker-alt bg-white mb-2">Wilayah</p>
            <p className="giant-num">{fmt(luas)}</p>
            <p className="text-xs mt-1 uppercase tracking-wide">km² ✷ 26 kecamatan</p>
          </div>
          <div className="kpi-block tilt-2 bg-candy">
            <p className="sticker bg-white mb-2">Kemiskinan</p>
            <p className="giant-num">{kemiskinan ? fmt(kemiskinan.nilai, 2) : "—"}<span className="text-xl">%</span></p>
            <p className="text-xs mt-1 uppercase tracking-wide">2025 ✷ Satu Data Kebumen</p>
          </div>
          <div className="kpi-block tilt-4 bg-white">
            <p className="sticker sticker-alt bg-mustard mb-2">Wisatawan</p>
            <p className="giant-num">{wisatawan ? fmt(wisatawan.nilai / 1e6, 2) : "—"}<span className="text-xl"> jt</span></p>
            <p className="text-xs mt-1 uppercase tracking-wide">kunjungan 2025 ✷ Disparbud</p>
          </div>
        </section>

        {/* Pita statistik miring */}
        <section className="border-y-[3px] border-ink py-6 mb-16 -rotate-1 bg-electric text-white px-4">
          <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-3 text-center">
            <div>
              <p className="mega text-3xl">{ipm ? fmt(ipm.nilai, 2) : "—"}</p>
              <p className="text-xs uppercase mt-1">IPM 2025</p>
            </div>
            <div>
              <p className="mega text-3xl">{tpt ? fmt(tpt.nilai, 2) : "—"}%</p>
              <p className="text-xs uppercase mt-1">Tingkat Pengangguran</p>
            </div>
            <div>
              <p className="mega text-3xl">{w.desa_mapped}/{w.total_desa + w.total_kelurahan}</p>
              <p className="text-xs uppercase mt-1">Desa terpetakan di peta</p>
            </div>
          </div>
        </section>

        {/* Jelajah cepat */}
        <section className="grid gap-8 md:grid-cols-2 mb-14">
          <div className="anti-card tilt-2 p-6">
            <p className="sticker bg-acid mb-3">Peta</p>
            <h2 className="mega text-2xl mb-2">26 KECAMATAN.<br />460 DESA.</h2>
            <p className="text-sm mb-4">
              Peta titik seluruh kecamatan dan desa. {w.desa_mapped} desa punya koordinat
              dari OpenStreetMap; sisanya terdaftar resmi tapi belum tergeokode —
              kami tidak mengarang koordinat.
            </p>
            <Link href="/peta" className="anti-btn inline-block">Buka Peta Wilayah →</Link>
          </div>
          <div className="anti-card tilt-3 p-6 bg-mustard">
            <p className="sticker bg-white mb-3">Indikator</p>
            <h2 className="mega text-2xl mb-2">{ind.length} NILAI INDIKATOR RESMI</h2>
            <p className="text-sm mb-4">
              Kemiskinan, IPM, stunting, pengangguran, APBD, wisatawan, produksi padi —
              semua dengan sumber &amp; OPD pengampu dicantumkan.
            </p>
            <Link href="/indikator" className="anti-btn inline-block bg-white">Lihat Indikator →</Link>
          </div>
        </section>

        {/* Sorotan kecamatan */}
        <section className="mb-8">
          <h2 className="mega text-3xl mb-5">SOROTAN WILAYAH</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="anti-card tilt-4 p-5">
              <p className="sticker sticker-alt bg-candy mb-2">Terpadat</p>
              <p className="mega text-2xl">{kecTerpadat.nama}</p>
              <p className="text-sm">{fmt(kecTerpadat.kepadatan)} jiwa/km² ✷ {fmt(kecTerpadat.penduduk)} jiwa</p>
            </div>
            <div className="anti-card tilt-1 p-5">
              <p className="sticker bg-acid mb-2">Terluas</p>
              <p className="mega text-2xl">{kecTerluas.nama}</p>
              <p className="text-sm">{fmt(kecTerluas.luas, 1)} km² ✷ {kecTerluas.desa_total} desa</p>
            </div>
          </div>
        </section>

        <section className="anti-card p-6 -rotate-1 bg-white">
          <p className="sticker bg-hot text-white mb-3">Jujur Itu Wajib</p>
          <p className="text-sm">
            Semua angka di portal ini diambil langsung dari sumber resmi dan dicantumkan
            sumbernya. Tidak ada data karangan. Missing data ditampilkan sebagai
            &ldquo;—&rdquo;, bukan nol. Detail lengkap di{" "}
            <Link href="/metodologi" className="anti-link">Metodologi</Link>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
