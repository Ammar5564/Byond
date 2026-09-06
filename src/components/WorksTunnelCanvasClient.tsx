"use client";

import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import type { WorkItem } from "@/lib/content";
import type { TunnelApi } from "@/components/WorksTunnelCanvas";

export type { TunnelApi };

const WorksTunnelCanvas = dynamic(
  () =>
    import("@/components/WorksTunnelCanvas").then(
      (mod) => mod.WorksTunnelCanvas
    ),
  { ssr: false, loading: () => null }
);

export function WorksTunnelCanvasClient({
  projects,
  progressRef,
  onActiveChange,
  onSelect,
  apiRef,
}: {
  projects: WorkItem[];
  progressRef: MutableRefObject<number>;
  onActiveChange: (index: number, proximity: number) => void;
  onSelect: (index: number) => void;
  apiRef: MutableRefObject<TunnelApi | null>;
}) {
  return (
    <WorksTunnelCanvas
      projects={projects}
      progressRef={progressRef}
      onActiveChange={onActiveChange}
      onSelect={onSelect}
      apiRef={apiRef}
    />
  );
}
