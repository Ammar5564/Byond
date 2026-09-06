"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";

const ConstellationCanvas = dynamic(
  () =>
    import("@/components/ConstellationCanvas").then(
      (mod) => mod.ConstellationCanvas
    ),
  { ssr: false, loading: () => null }
);

export function ConstellationCanvasClient({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  return <ConstellationCanvas sectionRef={sectionRef} />;
}
