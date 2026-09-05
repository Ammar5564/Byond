"use client";

import dynamic from "next/dynamic";

const CrimsonBackgroundCanvas = dynamic(
  () =>
    import("@/components/CrimsonBackgroundCanvas").then(
      (mod) => mod.CrimsonBackgroundCanvas
    ),
  { ssr: false, loading: () => null }
);

export function BackgroundCanvasClient() {
  return <CrimsonBackgroundCanvas />;
}
