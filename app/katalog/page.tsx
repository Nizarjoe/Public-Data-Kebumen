import { getKatalog } from "../lib/data";
import { SiteNav, SiteFooter, Marquee } from "../components/chrome";

export const instant = false;
export const metadata = { title: "Katalog Data — Kebumen/Data" };

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topik?: string }>;
}) {
  const { q, topik } = await searchParams;
  const kat = await getKatalog();
  const topikSet = [...new Set(kat.map((k) => k.topik))].sort();
  const query = (q ?? "").toLowerCase();
  const list = kat.filter(
    (k) =>
      (!query || k.judul_tampil.toLowerCase().includes(query) || k.catatan.toLowerCase().includes(query)) &&
      (!topik || k.topik === topik)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="KATALOG TERKURASI ✷ OPEN DATA KEBUMEN ✷ 11.873 DATASET DI PORTAL" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <p className="sticker bg-hot text-white mb-4">KURASI ✷ {kat.length} DATASET TERPILIH</p>
        <h1 className="mega text-[clamp(2.6rem,8vw,5.5rem)] mb-3">
          KATALOG<br />DATA
        </h1>
        <p className="max-w-xl mb-6 text-lg">
          Portal Open Data Kebumen memuat ribuan dataset. Kami mengurasi yang paling
          penting ke sini; sisanya bisa dijelajahi langsung di{" "}
          <a className="anti-link" href="https://opendata.kebumenkab.go.id" target="_blank" rel="noreferrer">
            portal resmi
          </a>.
        </p>

        <form method="get" className="flex flex-wrap gap-2 mb-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari dataset…"
            className="border-[3px] border-ink px-3 py-2 flex-1 min-w-52 bg-white shadow-[4px_4px_0_#171412] outline-none focus:bg-acid"
          />
          <button className="anti-btn">Cari</button>
        </form>
        <div className="flex flex-wrap gap-2 mb-10">
          <a href="/katalog" className={`anti-btn ${!topik ? "on" : ""}`}>Semua</a>
          {topikSet.map((t) => (
            <a key={t} href={`/katalog?topik=${t}`} className={`anti-btn ${topik === t ? "on" : ""}`}>
              {t}
            </a>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((k, i) => (
            <article key={k.judul} className={`anti-card p-5 ${["tilt-1", "tilt-2", "tilt-3", "tilt-4"][i % 4]}`}>
              <p className={`sticker ${i % 3 === 0 ? "bg-mustard" : i % 3 === 1 ? "bg-acid" : "bg-candy"} mb-3`}>
                {k.topik} {k.diperbarui && `✷ ${k.diperbarui}`}
              </p>
              <h2 className="mega text-base leading-snug mb-2">{k.judul_tampil}</h2>
              <p className="text-xs mb-2 opacity-70">{k.organisasi ?? "Pemkab Kebumen"}</p>
              {k.catatan && <p className="text-sm mb-3 line-clamp-3">{k.catatan}</p>}
              <a href={k.dataset_url} target="_blank" rel="noreferrer" className="anti-btn inline-block !text-[0.7rem]">
                Buka di Portal ↗
              </a>
            </article>
          ))}
        </div>
        {list.length === 0 && <p className="text-center py-10">Tidak ada dataset cocok.</p>}
      </main>
      <SiteFooter />
    </div>
  );
}
