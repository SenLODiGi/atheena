"use client";

import { useState } from "react";
import { StoryWelcome } from "@/components/StoryWelcome";
import { CallView } from "@/components/CallView";

export default function HomePage() {
  const [mode, setMode] = useState<"story" | "call">("story");

  if (mode === "story") {
    return <StoryWelcome onBegin={() => setMode("call")} />;
  }

  return <CallView onEnd={() => setMode("story")} />;
}
