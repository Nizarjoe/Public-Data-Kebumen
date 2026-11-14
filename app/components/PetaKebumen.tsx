"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polygon,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Kecamatan, Desa } from "../lib/data";

type Props = { kecamatan: Kecamatan[] };

const WARNA_KEPADATAN = (d: number) =>
  d > 2000 ? "#e8422e" : d > 1000 ? "#ff8ad4" : d > 600 ? "#ffc918" : "#c8f04b";

const BATAS_KAB: [number, number][][] = [];

function FitBoundsKebumen() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[-7.84, 109.37], [-7.45, 109.85]], { padding: [12, 12] });
  }, [map]);
  return null;
}

function divIconKec(warna: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:22px;height:22px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);background:${warna};
      border:3px solid #171412;box-shadow:2px 2px 0 #171412;
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 20],
  });
}

export default function PetaKebumen({ kecamatan }: Props) {
  const [desa, setDesa] = useState<Desa[]>([]);
  const [batas, setBatas] = useState<[number, number][][] | null>(null);
  const [aktif, setAktif] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<"satelit" | "terang">("satelit");
  const [mode, setMode] = useState<"kecamatan" | "desa" | "keduanya">("keduanya");

  const desaFiles = useMemo(() => kecamatan.map((k) => k.nama.toLowerCase()), [kecamatan]);

  useEffect(() => {
    let alive = true;
    Promise.all(
      desaFiles.map((f) =>
        fetch(`/data/desa/${f}.json`).then((r) => r.json() as Promise<{ desa: Desa[] }>)
      )
    ).then((all) => {
      if (alive) setDesa(all.flatMap((a) => a.desa));
    });
    fetch("/data/kebumen-feature.geojson")
      .then((r) => r.json())
      .then((f) => {
        if (!alive) return;
        const polys: [number, number][][][] = f.geometry.coordinates;
        setBatas(polys.map((p) => p[0].map((c: number[]) => [c[1], c[0]] as [number, number])));
      });
    return () => {
      alive = false;
    };
  }, [desaFiles]);

  const desaTampil = aktif
    ? desa.filter((d) => kecamatan.find((k) => k.nama === aktif)?.desa_nama.includes(d.nama))
    : desa;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["keduanya", "kecamatan", "desa"] as const).map((m) => (
          <button key={m} className={`anti-btn ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>
            {m === "keduanya" ? "Semua" : m === "kecamatan" ? "26 Kecamatan" : `${desa.length} Desa`}
          </button>
        ))}
        <span className="w-px self-stretch bg-ink mx-1" aria-hidden />
        {(["satelit", "terang"] as const).map((b) => (
          <button key={b} className={`anti-btn ${basemap === b ? "on" : ""}`} onClick={() => setBasemap(b)}>
            {b === "satelit" ? "Satelit" : "Terang"}
          </button>
        ))}
        {aktif && (
          <button className="anti-btn on" onClick={() => setAktif(null)}>
            ✷ Filter: {aktif} — hapus
          </button>
        )}
      </div>

      <div className="anti-card p-2 bg-white" style={{ transform: "rotate(-0.4deg)" }}>
        <MapContainer
          center={[-7.66, 109.63]}
          zoom={10}
          scrollWheelZoom
          style={{ height: 600, border: "2px solid #171412", background: "#e8e2d4" }}
        >
          {basemap === "satelit" ? (
            <>
              <TileLayer
                attribution="Esri, Maxar, Earthstar Geographics"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                attribution="&copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              />
            </>
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          )}

          {/* batas kabupaten — outline tebal anti-design */}
          {batas &&
            batas.map((ring, i) => (
              <Polygon
                key={i}
                positions={ring}
                pathOptions={{
                  color: "#171412",
                  weight: 4,
                  fill: true,
                  fillColor: "#f4efe4",
                  fillOpacity: basemap === "satelit" ? 0.18 : 0.06,
                }}
              />
            ))}

          {(mode !== "desa") &&
            kecamatan
              .filter((k) => k.lat && k.lon)
              .filter((k) => !aktif || k.nama === aktif)
              .map((k) => (
                <Marker
                  key={k.kode}
                  position={[k.lat!, k.lon!]}
                  icon={divIconKec(WARNA_KEPADATAN(k.kepadatan))}
                  eventHandlers={{ click: () => setAktif(k.nama) }}
                >
                  <Tooltip direction="top" offset={[0, -16]} permanent={mode === "kecamatan"}>
                    <strong>{k.nama}</strong>
                    <br />
                    {k.penduduk.toLocaleString("id-ID")} jiwa ✷ {k.kepadatan.toLocaleString("id-ID")} jiwa/km²
                    <br />
                    {k.desa_total} desa — <em>klik untuk filter</em>
                  </Tooltip>
                </Marker>
              ))}

          {(mode === "desa" || mode === "keduanya") &&
            desaTampil.map((d, i) => (
              <CircleMarker
                key={`${d.nama}-${i}`}
                center={[d.lat, d.lon]}
                radius={aktif ? 6.5 : 4.5}
                pathOptions={{
                  color: "#171412",
                  weight: 1.5,
                  fillColor: d.tipe === "kelurahan" ? "#2b48ff" : "#ffc918",
                  fillOpacity: 0.92,
                }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  {d.nama} <em>({d.tipe})</em>
                </Tooltip>
              </CircleMarker>
            ))}

          <FitBoundsKebumen />
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs items-center">
        <span className="sticker bg-white">Legenda</span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3.5 h-3.5 rotate-45 border-2 border-ink" style={{ background: "#e8422e" }} /> Kec. &gt;2000 jiwa/km²
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3.5 h-3.5 rotate-45 border-2 border-ink" style={{ background: "#ff8ad4" }} /> 1000–2000
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3.5 h-3.5 rotate-45 border-2 border-ink" style={{ background: "#ffc918" }} /> 600–1000
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3.5 h-3.5 rotate-45 border-2 border-ink" style={{ background: "#c8f04b" }} /> &lt;600
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3 h-3 rounded-full border-2 border-ink" style={{ background: "#ffc918" }} /> Desa
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-3 h-3 rounded-full border-2 border-ink" style={{ background: "#2b48ff" }} /> Kelurahan
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block w-4 h-0 border-t-4 border-ink" /> Batas kabupaten
        </span>
      </div>
    </div>
  );
}
