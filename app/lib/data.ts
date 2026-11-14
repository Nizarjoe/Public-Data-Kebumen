export type Wilayah = {
  kabupaten: string;
  kode: string;
  total_desa: number;
  total_kelurahan: number;
  desa_mapped: number;
  sumber: string[];
  kecamatan: Kecamatan[];
};

export type Kecamatan = {
  kode: string;
  nama: string;
  penduduk: number;
  luas: number;
  kepadatan: number;
  lat: number | null;
  lon: number | null;
  desa_total: number;
  desa_mapped: number;
  desa_nama: string[];
};

export type Desa = { nama: string; tipe: string; lat: number; lon: number };

export type Indikator = {
  indikator: string;
  tahun: number | null;
  nilai: number;
  satuan: string;
  opd: string;
  file: string;
};

export type KatalogItem = {
  judul: string;
  judul_tampil: string;
  organisasi: string | null;
  catatan: string;
  sumber_url: string | null;
  dataset_url: string;
  diperbarui: string;
  topik: string;
};

import { readFile } from "node:fs/promises";
import path from "node:path";

const P = (f: string) => path.join(process.cwd(), "public", "data", f);

export async function getWilayah(): Promise<Wilayah> {
  return JSON.parse(await readFile(P("wilayah_ringkas.json"), "utf8"));
}

export async function getIndikator(): Promise<Indikator[]> {
  return JSON.parse(await readFile(P("indikator.json"), "utf8"));
}

export async function getKatalog(): Promise<KatalogItem[]> {
  return JSON.parse(await readFile(P("katalog.json"), "utf8"));
}

export async function getPadi(): Promise<Record<string, Record<string, number | string>>> {
  return JSON.parse(await readFile(P("padi.json"), "utf8"));
}

export function fmt(n: number, digits = 0) {
  return n.toLocaleString("id-ID", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
