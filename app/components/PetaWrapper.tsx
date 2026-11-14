"use client";
import dynamic from "next/dynamic";

const PetaKebumen = dynamic(() => import("./PetaKebumen"), { ssr: false });

export default function PetaWrapper({ kecamatan }: { kecamatan: import("../lib/data").Kecamatan[] }) {
  return <PetaKebumen kecamatan={kecamatan} />;
}
