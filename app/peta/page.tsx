import PetaWrapper from "../components/PetaWrapper";
import { getWilayah } from "../lib/data";
import { SiteNav, SiteFooter, Marquee } from "../components/chrome";

export const instant = false;
export const metadata = { title: "Peta Wilayah — Kebumen/Data" };

export default async function PetaPage() {
  const w = await getWilayah();
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="436 DESA TERPETAKAN ✷ TANPA KOORDINAT KARANGAN" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <p className="sticker bg-candy mb-4">GEO ✷ OPENSTREETMAP + NOMINATIM</p>
        <h1 className="mega text-[clamp(2.6rem,8vw,5.5rem)] mb-3">
          PETA<br />WILAYAH
        </h1>
        <p className="max-w-xl mb-8 text-lg">
          Klik lingkaran kecamatan untuk memfilter desa di dalamnya. Ukuran &amp; warna
          lingkaran = kepadatan penduduk. {w.desa_mapped} dari {w.total_desa + w.total_kelurahan}{" "}
          desa/kelurahan terpetakan — sisanya menunggu geocoding, tidak dipaksakan.
        </p>
        <PetaWrapper kecamatan={w.kecamatan} />
        <p className="text-xs mt-4 opacity-70">
          Batas administratif: Perda Kab. Kebumen 12/2023 &amp; Kemendagri. Koordinat:
          OpenStreetMap via Nominatim (CC-BY-SA / ODbL). Basemap: CARTO.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
