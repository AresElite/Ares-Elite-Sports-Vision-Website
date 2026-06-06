"use client";

import { Eye, Cpu, Zap, RotateCcw } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "1. ACQUIRE",
    date: "Visual Intake",
    content: "Rapidly gathering visual information from the environment.",
    category: "Intake",
    icon: Eye,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
    link: "/detail/acquire"
  },
  {
    id: 2,
    title: "2. ROUTE",
    date: "Neural Processing",
    content: "Processing the visual data and determining the correct response.",
    category: "Processing",
    icon: Cpu,
    relatedIds: [1, 3],
    status: "in-progress" as const,
    energy: 90,
    link: "/detail/route"
  },
  {
    id: 3,
    title: "3. EXECUTE",
    date: "Motor Response",
    content: "Firing the correct muscle sequences based on the processed data.",
    category: "Output",
    icon: Zap,
    relatedIds: [2, 4],
    status: "pending" as const,
    energy: 60,
    link: "/detail/execute"
  },
  {
    id: 4,
    title: "4. SYNCHRONIZE",
    date: "Game-Speed Harmony",
    content: "Seamless integration of vision and movement under pressure.",
    category: "Integration",
    icon: RotateCcw,
    relatedIds: [1, 3],
    status: "pending" as const,
    energy: 85,
    link: "/detail/synchronize"
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full h-full min-h-[600px] relative rounded-2xl overflow-hidden border border-[var(--color-ares-border)]">
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}
