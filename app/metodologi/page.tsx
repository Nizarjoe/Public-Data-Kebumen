import { SiteNav, SiteFooter, Marquee } from "../components/chrome";

export const metadata = { title: "Metodologi — Kebumen/Data" };

export default function MetodologiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <Marquee text="TRANSPARAN ✷ TERLACAK ✷ TANPA DATA KARANGAN" />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <h1 className="mega text-[clamp(2.6rem,8vw,5.5rem)] mb-6">METODOLOGI</h1>

        <section className="anti-card p-6 mb-8">
          <p className="sticker bg-mustard mb-3">Prinsip</p>
          <ul className="list-none space-y-2 text-sm">
            <li>✷ <strong>Source-first</strong> — setiap angka punya rujukan sumber yang tampil di UI.</li>
            <li>✷ <strong>No fabricated data</strong> — tidak ada angka karangan; data hilang ditampilkan &ldquo;—&rdquo;, bukan nol.</li>
            <li>✷ <strong>Terlacak</strong> — file XLSX sumber, tanggal unduh, dan OPD pengampu dicatat per indikator.</li>
            <li>✷ <strong>Geocoding jujur</strong> — hanya koordinat terverifikasi dalam bbox Kebumen yang dipetakan.</li>
          </ul>
        </section>

        <section className="anti-card tilt-1 p-6 mb-8 bg-white">
          <p className="sticker bg-acid mb-3">Alur Data</p>
          <ol className="space-y-3 text-sm list-decimal pl-5">
            <li><strong>Wilayah &amp; desa</strong> — daftar 449 desa + 11 kelurahan di 26 kecamatan dari Perda Kab. Kebumen No. 12/2023 (peraturan.bpk.go.id), silang dengan struktur kode Kemendagri (Permendagri 137/2017).</li>
            <li><strong>Geocoding</strong> — 26 titik kecamatan + 436/460 desa via Nominatim (OpenStreetMap); divalidasi dalam bounding box Kebumen; 24 desa tanpa koordinat TIDAK dipaksakan.</li>
            <li><strong>Indikator kabupaten</strong> — 30 XLSX dari Open Data Kebumen CKAN (opendata.kebumenkab.go.id) diunduh &amp; di-parse (536+ nilai); metadata OPD, satuan, tahun ikut disimpan.</li>
            <li><strong>Padi per kecamatan</strong> — XLSX &ldquo;Luas Panen dan Produksi Padi dan Palawija&rdquo; 2022–2023 diurai per kecamatan.</li>
            <li><strong>Katalog</strong> — metadata dataset terkurasi via CKAN API (package_search).</li>
          </ol>
        </section>

        <section className="anti-card tilt-2 p-6 mb-8">
          <p className="sticker sticker-alt bg-candy mb-3">Sumber Data</p>
          <table className="anti-table">
            <thead>
              <tr><th>Sumber</th><th>Isi</th><th>Lisensi/Akses</th></tr>
            </thead>
            <tbody>
              <tr><td>Open Data Kebumen (CKAN)</td><td>Indikator kabupaten, katalog</td><td>Terbuka, unduh XLSX</td></tr>
              <tr><td>Satu Data Kebumen</td><td>Indikator RPJMD per OPD</td><td>Terbuka</td></tr>
              <tr><td>Perda 12/2023 (BPK)</td><td>Daftar resmi 449 desa</td><td>Dokumen hukum</td></tr>
              <tr><td>Kemendagri</td><td>Kode wilayah 33.05.xx.xx</td><td>Permendagri 137/2017</td></tr>
              <tr><td>OpenStreetMap / Nominatim</td><td>Koordinat kecamatan &amp; desa</td><td>ODbL</td></tr>
              <tr><td>geoBoundaries</td><td>Batas kabupaten (polygon)</td><td>CC-BY 4.0 / gbOpen</td></tr>
              <tr><td>CARTO</td><td>Basemap peta</td><td>Atribusi wajib</td></tr>
            </tbody>
          </table>
        </section>

        <section className="anti-card tilt-3 p-6 mb-8 bg-white">
          <p className="sticker bg-hot text-white mb-3">Keterbatasan (jujur)</p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Data indikator tingkat kabupaten — bukan per kecamatan (kecuali padi); BPS portal kabupaten sering tidak dapat diakses dari server ini.</li>
            <li>Beberapa XLSX Satu Data berisi nilai 0/kosong untuk 2025 (belum diisi OPD) — ditampilkan apa adanya atau di-skip.</li>
            <li>24 desa belum tergeokode; daftar tetap lengkap, peta sebagian.</li>
            <li>Batas polygon kecamatan belum termasuk — titik kecamatan dipakai sebagai representasi (Overpass API overload saat eksekusi).</li>
            <li>Data di-cache saat build; bukan real-time.</li>
          </ul>
        </section>

        <section className="anti-card tilt-4 p-6 bg-mustard">
          <p className="sticker bg-white mb-3">Kamus Data (ringkas)</p>
          <table className="anti-table">
            <thead><tr><th>Field</th><th>Arti</th></tr></thead>
            <tbody>
              <tr><td>kode</td><td>Kode wilayah Kemendagri (33.05.xx)</td></tr>
              <tr><td>penduduk</td><td>Jumlah penduduk jiwa (Disdukcapil via Satu Data)</td></tr>
              <tr><td>luas</td><td>Luas wilayah km²</td></tr>
              <tr><td>kepadatan</td><td>jiwa/km² (dihitung: penduduk ÷ luas)</td></tr>
              <tr><td>desa_total / desa_mapped</td><td>Jumlah desa resmi vs yang punya koordinat</td></tr>
              <tr><td>tipe</td><td>desa | kelurahan</td></tr>
              <tr><td>nilai / satuan / opd</td><td>Nilai indikator, satuan, OPD pengampu</td></tr>
            </tbody>
          </table>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
