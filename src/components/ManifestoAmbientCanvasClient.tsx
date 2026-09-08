"use client";

import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";

const ManifestoAmbientCanvas = dynamic(
  () =>
    import("@/components/ManifestoAmbientCanvas").then(
      (mod) => mod.ManifestoAmbientCanvas
    ),
  { ssr: false, loading: () => null }
);

export function ManifestoAmbientCanvasClient({
  progressRef,
  stepRef,
}: {
  progressRef: MutableRefObject<number>;
  stepRef: MutableRefObject<number>;
}) {
  return (
    <ManifestoAmbientCanvas progressRef={progressRef} stepRef={stepRef} />
  );
}
