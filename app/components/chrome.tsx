import Link from "next/link";

export function Marquee({ text }: { text: string }) {
  const chunk = ` ${text} ✷`;
  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee">
        <span>{chunk.repeat(8)}</span>
        <span>{chunk.repeat(8)}</span>
      </div>
    </div>
  );
}

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/indikator", label: "Indikator" },
  { href: "/peta", label: "Peta Wilayah" },
  { href: "/kecamatan", label: "26 Kecamatan" },
  { href: "/katalog", label: "Katalog Data" },
  { href: "/metodologi", label: "Metodologi" },
];

export function SiteNav() {
  return (
    <header className="border-b-[3px] border-ink bg-canvas sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link href="/" className="mega text-lg leading-none">
          KEBUMEN<span className="text-hot">/</span>DATA
        </Link>
        <nav className="flex flex-wrap gap-1.5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="anti-btn !py-1 !px-2.5 !text-[0.68rem]">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-ink mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-4 md:grid-cols-3 items-start">
        <div>
          <p className="mega text-xl">KEBUMEN/DATA</p>
          <p className="text-sm mt-2">
            Portal data publik Kabupaten Kebumen. Dibangun dengan prinsip
            <em> source-first, evidence-led, no fabricated data.</em>
          </p>
        </div>
        <div className="text-sm">
          <p className="sticker bg-mustard mb-2">Sumber Data</p>
          <ul className="space-y-1">
            <li>Open Data Kebumen (opendata.kebumenkab.go.id)</li>
            <li>Satu Data Kabupaten Kebumen</li>
            <li>Perda Kab. Kebumen No. 12/2023</li>
            <li>Kemendagri &amp; OpenStreetMap (geocoding)</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="sticker sticker-alt bg-candy mb-2">Kredensial Proyek</p>
          <p>
            Portofolio analisis data publik — UI/UX konsep{" "}
            <strong>anti-design/maximalism</strong>. Mahasiswa Sains Data.
          </p>
        </div>
      </div>
      <Marquee text="NO FABRICATED DATA ✷ SOURCE FIRST ✷ EVIDENCE LED" />
    </footer>
  );
}
