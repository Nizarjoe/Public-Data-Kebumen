import { getIndikator, fmt } from "../lib/data";
import { SiteNav, SiteFooter, Marquee } from "../components/chrome";

export const instant = false;
export const metadata = { title: "Indikator — Kebumen/Data" };

const WARNA = ["bg-mustard", "bg-acid", "bg-candy", "bg-white", "bg-electric text-white"];

export default async function IndikatorPage() {
  const ind = await getIndikator();

  // kelompokkan per indikator dasar (tanpa tahun) → kartu terbaru + histori
  const byName = new Map<string, typeof ind>();
  for (const i of ind) {
    const key = i.indikator.toLowerCase().replace(/[.,]/g, "").trim();
    const list = byName.get(key) ?? [];
    list.push(i);
    byName.set(key, list);
  }
  const groups = [...byName.values()].sort((a, b) => a[0].indikator.localeCompare(b[0].indikator));

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="INDIKATOR RESMI ✷ SATU DATA KEBUMEN ✷ SUMBER DICANTUMKAN" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <p className="sticker bg-electric text-white mb-4">SATU DATA KEBUMEN ✷ CKAN OPD</p>
        <h1 className="mega text-[clamp(2.6rem,8vw,5.5rem)] mb-3">
          INDIKATOR<br />KABUPATEN
        </h1>
        <p className="max-w-xl mb-10 text-lg">
          {ind.length} nilai indikator dari {groups.length} indikator unik. Angka diambil
          mentah dari XLSX Open Data Kebumen — satuan &amp; OPD pengampu ikut dicantumkan.
        </p>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, idx) => {
            const latest = [...g].sort((a, b) => (b.tahun ?? 0) - (a.tahun ?? 0))[0];
            const hist = [...g].sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));
            const isPct = latest.satuan === "%";
            return (
              <article key={latest.file + latest.indikator} className={`anti-card p-5 ${["tilt-1","tilt-2","tilt-3","tilt-4"][idx % 4]}`}>
                <div className={`sticker ${WARNA[idx % WARNA.length]} mb-3`}>
                  {latest.opd || "OPD"} ✷ {latest.tahun}
                </div>
                <h2 className="mega text-lg leading-tight mb-3">{latest.indikator}</h2>
                <p className="giant-num !text-[clamp(2.4rem,6vw,4rem)]">
                  {fmt(latest.nilai, latest.nilai % 1 ? 2 : 0)}
                  {isPct ? <span className="text-2xl">%</span> : <span className="text-sm text-ink/60"> {latest.satuan}</span>}
                </p>
                {hist.length > 1 && (
                  <table className="anti-table mt-4">
                    <thead>
                      <tr><th>Tahun</th><th>Nilai</th></tr>
                    </thead>
                    <tbody>
                      {hist.map((h) => (
                        <tr key={h.tahun + h.file}>
                          <td>{h.tahun}</td>
                          <td>{fmt(h.nilai, h.nilai % 1 ? 2 : 0)} {h.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <p className="text-[0.65rem] mt-3 opacity-70">sumber: {latest.file}</p>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
