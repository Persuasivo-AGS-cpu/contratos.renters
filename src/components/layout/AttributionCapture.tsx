"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attributionClient";

export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
